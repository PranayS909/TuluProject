/* ===================================================================
   UNIT ENGINE — runs every practice unit from a plain data object.

   A unit page defines `window.UNIT` (see unit1.js … unit5.js):
     { key:'unit-1', title:'First words', draft:false, steps:[ … ] }

   Step types (each step also takes title, desc, and optional kind):
     learn     { items:[{ tulu, en, kn? }], note? }         flashcards
     match     { pairs:[{ tulu, en }] }                     tap to match
     drag      { pairs:[{ tulu, en, dots? }] }              drag onto tile
     quiz      { questions:[{ prompt, answer, choices }] }  multiple choice
     build     { sentences:[{ en, words:[…], extra?:[…] }] }  sentence builder
     listen    { items:[{ tulu, en }], rounds? }            hear, then pick
     dialogue  { lines:[ { who:'them', tulu, en }
                         | { who:'you', goal, options:[{ tulu, en, correct? }] } ] }
     sort      { bins:[{ key, label }], items:[{ tulu, en, bin }] }
     read      { items:[{ kn, rom, en }] }                  read Kannada script
     alphabet  { letters:[{ kn, rom }] }                    letter chart
     letters   { letters:[{ kn, rom }], rounds? }           letter → sound quiz

   Any `tulu` text follows the learner's script choice (English letters,
   Kannada or Tulu Lipi). Kannada is auto-transliterated unless an item
   gives its own `kn`.
=================================================================== */

const ENGINE = { unit:null, cur:0, done:[], furthest:0, quizScores:[] };

document.addEventListener('DOMContentLoaded', () => {
  if (window.UNIT) startUnit(window.UNIT);
});

/* ---------------------------------------------------------------
   UTILITIES
--------------------------------------------------------------- */
function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function el(tag, className, html){
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html != null) e.innerHTML = html;
  return e;
}
function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

let toastTimer = null;
function showToast(msg){
  let toast = document.getElementById('u1Toast');
  if (!toast){
    toast = el('div', 'u1-toast');
    toast.id = 'u1Toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2200);
}

// Plays a term if it has a recording; returns false when it doesn't.
function hear(term){
  if (!audioSrc(term)) return false;
  playTerm(term);
  return true;
}

/* ---------------------------------------------------------------
   SCRIPT CHOICE — English letters / Kannada / Tulu Lipi
--------------------------------------------------------------- */
const SCRIPT_KEY = 'tuluScript';
function currentScript(){
  try { return localStorage.getItem(SCRIPT_KEY) || 'roman'; } catch (e){ return 'roman'; }
}

// "Namaskara" → "namaskara" so the ITRANS converter doesn't read a
// sentence-case capital as a long vowel. Short ITRANS words ("El", "Aji")
// and mixed case ("raDD") are left alone.
function autoKannada(term){
  const t = term.replace(/^([A-Z])(?=[a-z]{3,}(\s|$|[?.!…]))/, (m) => m.toLowerCase());
  // Kannada writes a nasal before another (non-nasal) consonant as the
  // anusvara ಂ: ಮುನ್ದೆ → ಮುಂದೆ, ಒನ್ಜಿ → ಒಂಜಿ. Doubled nasals (ಅಮ್ಮೆ) stay.
  return romanToKannada(t).replace(/[ಙಞಣನಮ]್(?=[ಕ-ಹ])(?![ಙಞಣನಮ])/g, 'ಂ');
}

// Standard Kannada spellings for words whose English spelling in the
// course is too casual to convert well (e.g. no long vowels marked).
const KANNADA_SPELLINGS = {
  'Namaskara':'ನಮಸ್ಕಾರ',
  'Namaskara! Bale.':'ನಮಸ್ಕಾರ! ಬಲೆ.',
};

function scriptText(tulu, kn){
  const mode = currentScript();
  if (mode === 'roman') return tulu;
  const kannada = kn || KANNADA_SPELLINGS[tulu] || autoKannada(tulu);
  return mode === 'tulu-lipi' ? kannadaToTigalari(kannada) : kannada;
}

// Puts Tulu text into an element and remembers the source, so a later
// script switch can redraw it.
function setTulu(node, tulu, kn){
  node.dataset.tulu = tulu;
  if (kn) node.dataset.kn = kn;
  node.textContent = scriptText(tulu, kn);
  return node;
}

function applyScript(){
  const mode = currentScript();
  document.body.classList.toggle('script-kn', mode === 'kannada');
  document.body.classList.toggle('script-tg', mode === 'tulu-lipi');
  document.querySelectorAll('[data-tulu]').forEach(n => {
    n.textContent = scriptText(n.dataset.tulu, n.dataset.kn);
  });
  document.querySelectorAll('[data-script]').forEach(b => {
    const on = b.dataset.script === mode;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function initControls(){
  document.querySelectorAll('[data-script]').forEach(btn => {
    btn.addEventListener('click', () => {
      try { localStorage.setItem(SCRIPT_KEY, btn.dataset.script); } catch (e){ /* private mode */ }
      applyScript();
      if (btn.dataset.script === 'tulu-lipi' && typeof hasTigalariFont === 'function' && !hasTigalariFont()){
        showToast('This device has no Tulu Lipi font yet, so letters may show as boxes.');
      }
    });
  });
  const slow = document.getElementById('slowAudio');
  if (slow){
    slow.checked = audioRate() < 1;
    slow.addEventListener('change', () => setAudioRate(slow.checked ? 0.75 : 1));
  }
  applyScript();
}

/* ---------------------------------------------------------------
   STAGE CONTROLLER
--------------------------------------------------------------- */
const KIND_LABEL = {
  learn:'Learn', alphabet:'Learn', quiz:'Quiz',
  match:'Game', drag:'Game', build:'Game', listen:'Listen', dialogue:'Conversation',
  sort:'Game', read:'Read', letters:'Game',
};

function startUnit(unit){
  ENGINE.unit = unit;
  ENGINE.done = unit.steps.map(() => false);

  const notice = document.getElementById('draftNotice');
  if (notice) notice.hidden = !unit.draft;
  // Units already written in Kannada (Unit 3) don't need the script switch.
  if (unit.hideScriptSwitch){
    document.querySelectorAll('.script-switch, .script-hint').forEach(n => { n.hidden = true; });
  }

  const stage = document.getElementById('stage');
  unit.steps.forEach((step, i) => {
    const kind = step.kind || KIND_LABEL[step.type] || 'Game';
    const isGame = !['learn', 'alphabet'].includes(step.type);
    const sec = el('section', 'u1-ex card');
    sec.dataset.ex = i;
    sec.hidden = true;
    sec.innerHTML = `
      <div class="u1-ex-head">
        <span class="u1-ex-kind${isGame ? ' is-game' : ''}">${esc(kind)}</span>
        <h2>${esc(step.title)}</h2>
        ${step.desc ? `<p>${step.desc}</p>` : ''}
      </div>
    `;
    const body = el('div', 'step-body');
    sec.appendChild(body);
    stage.appendChild(sec);
    const render = RENDERERS[step.type];
    if (!render) throw new Error(`Unknown step type: ${step.type}`);
    render(body, step, i);
  });

  // done screen
  const done = el('section', 'u1-ex u1-done card');
  done.dataset.ex = unit.steps.length;
  done.hidden = true;
  done.innerHTML = `
    <div class="done-mark" aria-hidden="true"></div>
    <h2>${esc(unit.title)} complete.</h2>
    <p id="doneSummary">Nice work, you finished every step.</p>
    <p class="save-msg" id="saveMsg" aria-live="polite"></p>
    <div class="u1-done-actions">
      <button class="btn btn-lg" type="button" id="replayBtn">Play the unit again</button>
      ${unit.next
        ? `<a href="${unit.next.href}" class="btn btn-dark btn-lg">${esc(unit.next.label)} <span class="arr-dot" aria-hidden="true">→</span></a>`
        : `<a href="index.html#course" class="btn btn-dark btn-lg">Back to the course <span class="arr-dot" aria-hidden="true">→</span></a>`}
    </div>
  `;
  stage.appendChild(done);
  done.querySelector('#replayBtn').addEventListener('click', () => location.reload());

  document.getElementById('stepCount').textContent = `${unit.steps.length} steps`;
  document.getElementById('prevBtn').addEventListener('click', () => goTo(ENGINE.cur - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goTo(ENGINE.cur + 1));

  initControls();
  showStep(0);
}

function goTo(i){
  const last = ENGINE.unit.steps.length; // index of the done screen
  if (i < 0 || i > last) return;
  if (i > ENGINE.cur && !ENGINE.done[ENGINE.cur]) return; // finish this step first
  ENGINE.cur = i;
  showStep(i);
  window.scrollTo({ top: document.getElementById('stage').offsetTop - 120, behavior:'smooth' });
}

function showStep(i){
  const total = ENGINE.unit.steps.length;
  ENGINE.furthest = Math.max(ENGINE.furthest, i);
  document.querySelectorAll('#stage > .u1-ex').forEach(sec => {
    sec.hidden = Number(sec.dataset.ex) !== i;
  });
  renderProgress();
  document.getElementById('u1Nav').hidden = i === total;
  document.getElementById('prevBtn').disabled = i === 0;
  const next = document.getElementById('nextBtn');
  next.disabled = i < total && !ENGINE.done[i];
  next.textContent = i === total - 1 ? 'Finish →' : 'Next →';
  if (i === total) finishUnit();
}

function markComplete(i){
  ENGINE.done[i] = true;
  renderProgress();
  if (ENGINE.cur === i) document.getElementById('nextBtn').disabled = false;
}

function renderProgress(){
  const wrap = document.getElementById('u1Progress');
  const total = ENGINE.unit.steps.length;
  wrap.innerHTML = '';
  for (let i = 0; i < total; i++){
    const bar = el('span', 'u1-dot');
    if (ENGINE.done[i] && i <= ENGINE.furthest) bar.classList.add('is-done');
    if (i === ENGINE.cur) bar.classList.add('is-current');
    wrap.appendChild(bar);
  }
  document.getElementById('stepCaption').textContent =
    ENGINE.cur < total ? `Step ${ENGINE.cur + 1} of ${total}` : 'All steps done';
}

async function finishUnit(){
  const scores = ENGINE.quizScores.filter(Boolean);
  if (scores.length){
    const got = scores.reduce((s, q) => s + q.score, 0);
    const of = scores.reduce((s, q) => s + q.total, 0);
    document.getElementById('doneSummary').textContent =
      `Nice work. You got ${got} of ${of} answers right across the unit's quizzes and finished every step.`;
  }
  const msg = document.getElementById('saveMsg');
  if (typeof TuluProgress === 'undefined'){ msg.textContent = ''; return; }
  msg.textContent = 'Saving your progress…';
  const res = await TuluProgress.completeUnit(ENGINE.unit.key);
  if (res.saved){
    msg.innerHTML = res.xp
      ? `Saved. You earned <strong>${res.xp} XP</strong>${res.streak ? ` and your streak is <strong>${res.streak} ${res.streak === 1 ? 'day' : 'days'}</strong>` : ''}. <a href="dashboard.html">See your dashboard</a>.`
      : `Saved. You've already earned the XP for this unit${res.streak ? `, and your streak is <strong>${res.streak} ${res.streak === 1 ? 'day' : 'days'}</strong>` : ''}.`;
  } else if (res.reason === 'signed-out'){
    msg.innerHTML = `Saved on this device. <a href="register.html">Sign in</a> to earn XP and keep a streak.`;
  } else {
    msg.textContent = 'Saved on this device. We couldn\'t reach the server to add XP this time.';
  }
}

/* ---------------------------------------------------------------
   RENDERERS
--------------------------------------------------------------- */
const RENDERERS = {};

/* ----- learn: flashcards ----- */
RENDERERS.learn = (body, step, i) => {
  const grid = el('div', 'lm-grid');
  step.items.forEach(item => {
    const card = el('button', audioSrc(item.tulu) ? 'lm-card has-audio' : 'lm-card no-audio-known');
    card.type = 'button';
    card.innerHTML = `
      <div class="lm-card-top">
        <span class="lm-flip-hint">tap to hear</span>
        <span class="play" aria-hidden="true"></span>
      </div>
      <div class="lm-card-term"></div>
      <div class="lm-card-def">${esc(item.en)}</div>
    `;
    setTulu(card.querySelector('.lm-card-term'), item.tulu, item.kn);
    card.addEventListener('click', () => {
      card.classList.add('is-flipped');
      if (!hear(item.tulu)){
        card.classList.add('is-noaudio-flash');
        setTimeout(() => card.classList.remove('is-noaudio-flash'), 400);
        showToast(`No recording yet for "${item.tulu}"`);
      }
    });
    grid.appendChild(card);
  });
  body.appendChild(grid);
  if (step.note) body.appendChild(el('p', 'lm-note', step.note));
  body.appendChild(continueButton(i));
  markComplete(i); // study steps aren't graded
};

function continueButton(i){
  const btn = el('button', 'btn btn-dark btn-lg ex-next-btn', 'Continue <span class="arr-dot" aria-hidden="true">→</span>');
  btn.type = 'button';
  btn.addEventListener('click', () => goTo(i + 1));
  return btn;
}

/* ----- alphabet: letter chart ----- */
RENDERERS.alphabet = (body, step, i) => {
  const grid = el('div', 'letter-grid');
  step.letters.forEach(l => {
    grid.appendChild(el('div', 'letter-tile', `<span class="letter-kn" lang="kn">${l.kn}</span><span class="letter-rom">${esc(l.rom)}</span>`));
  });
  body.appendChild(grid);
  if (step.note) body.appendChild(el('p', 'lm-note', step.note));
  body.appendChild(continueButton(i));
  markComplete(i);
};

/* ----- match: tap a Tulu chip, then its meaning ----- */
RENDERERS.match = (body, step, i) => {
  const board = el('div', 'match-board');
  const left = el('div', 'match-col');
  const right = el('div', 'match-col');
  board.append(left, right);
  const status = el('p', 'u1-ex-status');
  status.setAttribute('aria-live', 'polite');
  body.append(board, status);
  if (step.note) body.appendChild(el('p', 'u1-ex-note', step.note));

  const pairs = step.pairs;
  let selected = null, matched = 0;
  const update = () => {
    status.textContent = matched === pairs.length ? 'All matched!' : `${matched} / ${pairs.length} matched`;
  };

  shuffle(pairs).forEach(p => {
    const chip = el('button', 'match-chip');
    chip.type = 'button';
    setTulu(chip, p.tulu, p.kn);
    chip.classList.toggle('has-audio', !!audioSrc(p.tulu));
    chip.addEventListener('click', () => {
      hear(p.tulu);
      if (chip.classList.contains('is-matched')) return;
      left.querySelectorAll('.match-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      selected = { chip, p };
    });
    left.appendChild(chip);
  });

  shuffle(pairs).forEach(p => {
    const chip = el('button', 'match-chip');
    chip.type = 'button';
    chip.textContent = p.en;
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-matched') || !selected) return;
      if (selected.p === p){
        selected.chip.classList.remove('is-selected');
        selected.chip.classList.add('is-matched');
        chip.classList.add('is-matched');
        matched++;
        selected = null;
        update();
        if (matched === pairs.length) markComplete(i);
      } else {
        const wrong = selected.chip;
        chip.classList.add('is-wrong');
        wrong.classList.add('is-wrong');
        wrong.classList.remove('is-selected');
        selected = null;
        setTimeout(() => { chip.classList.remove('is-wrong'); wrong.classList.remove('is-wrong'); }, 500);
      }
    });
    right.appendChild(chip);
  });
  update();
};

/* ----- drag: drag (or tap) a Tulu chip onto its tile ----- */
RENDERERS.drag = (body, step, i) => {
  const tray = el('div', 'drag-tray');
  const grid = el('div', 'drop-grid');
  const status = el('p', 'u1-ex-status');
  status.setAttribute('aria-live', 'polite');
  body.append(tray, grid, status);

  const pairs = step.pairs;
  let selectedChip = null, placed = 0;
  const chips = new Map();
  const update = () => {
    status.textContent = placed === pairs.length ? 'All placed!' : `${placed} / ${pairs.length} placed`;
  };

  shuffle(pairs).forEach((p, n) => {
    const chip = el('button', 'drag-chip');
    chip.type = 'button';
    chip.draggable = true;
    chip.dataset.idx = String(pairs.indexOf(p));
    setTulu(chip, p.tulu, p.kn);
    chip.classList.toggle('has-audio', !!audioSrc(p.tulu));
    chips.set(p, chip);
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-placed')) return;
      hear(p.tulu);
      tray.querySelectorAll('.drag-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      selectedChip = chip;
    });
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', chip.dataset.idx);
      hear(p.tulu);
    });
    tray.appendChild(chip);
  });

  shuffle(pairs).forEach(p => {
    const tile = el('div', 'drop-tile');
    tile.innerHTML = `
      ${p.dots ? `<span class="drop-dots" aria-hidden="true">${'<i></i>'.repeat(p.dots)}</span>` : ''}
      <span class="drop-label">${esc(p.en)}</span>
      <span class="drop-fill"></span>
    `;
    tile.addEventListener('click', () => {
      if (!selectedChip || tile.classList.contains('is-filled')) return;
      attempt(selectedChip, tile, p);
    });
    tile.addEventListener('dragover', (e) => e.preventDefault());
    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      if (tile.classList.contains('is-filled')) return;
      const src = pairs[Number(e.dataTransfer.getData('text/plain'))];
      const chip = src && chips.get(src);
      if (chip && !chip.classList.contains('is-placed')) attempt(chip, tile, p);
    });
    grid.appendChild(tile);
  });

  function attempt(chip, tile, tileP){
    if (chips.get(tileP) === chip){
      chip.classList.add('is-placed');
      chip.classList.remove('is-selected');
      chip.disabled = true;
      tile.classList.add('is-filled');
      setTulu(tile.querySelector('.drop-fill'), tileP.tulu, tileP.kn);
      placed++;
      selectedChip = null;
      update();
      if (placed === pairs.length) markComplete(i);
    } else {
      tile.classList.add('is-wrong');
      chip.classList.remove('is-selected');
      selectedChip = null;
      setTimeout(() => tile.classList.remove('is-wrong'), 500);
    }
  }
  update();
};

/* ----- quiz: multiple choice ----- */
RENDERERS.quiz = (body, step, i) => {
  const card = el('div', 'quiz-card');
  body.appendChild(card);
  const questions = step.questions;
  let q = 0, score = 0;

  function render(){
    if (q >= questions.length){
      card.innerHTML = `<p class="quiz-final">You got ${score} / ${questions.length} right.</p>`;
      ENGINE.quizScores[i] = { score, total: questions.length };
      markComplete(i);
      return;
    }
    const item = questions[q];
    const promptTerm = quizPromptTerm(item);
    card.innerHTML = `
      <p class="quiz-progress">Question ${q + 1} of ${questions.length}</p>
      <p class="quiz-question">${esc(item.prompt)}</p>
      ${promptTerm ? '<button type="button" class="quiz-hear"><span class="play" aria-hidden="true"></span>Hear it</button>' : ''}
      <div class="quiz-choices"></div>
      <p class="quiz-feedback" aria-live="polite"></p>
    `;
    const hearBtn = card.querySelector('.quiz-hear');
    if (hearBtn) hearBtn.addEventListener('click', () => playTerm(promptTerm));
    const wrap = card.querySelector('.quiz-choices');
    shuffle(item.choices).forEach(choice => {
      const btn = el('button', 'quiz-choice');
      btn.type = 'button';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('.quiz-choice').forEach(b => { b.disabled = true; });
        playTerm(quizAudioTerm(item));
        const fb = card.querySelector('.quiz-feedback');
        if (choice === item.answer){
          score++;
          btn.classList.add('is-correct');
          fb.textContent = 'Correct!';
          fb.className = 'quiz-feedback is-correct';
        } else {
          btn.classList.add('is-wrong');
          fb.textContent = `Not quite. It's "${item.answer}".`;
          fb.className = 'quiz-feedback is-wrong';
          wrap.querySelectorAll('.quiz-choice').forEach(b => { if (b.textContent === item.answer) b.classList.add('is-correct'); });
        }
        setTimeout(() => { q++; render(); }, 1400);
      });
      wrap.appendChild(btn);
    });
  }
  render();
};

/* ----- build: put the words in order (Tulu is subject–object–verb) ----- */
RENDERERS.build = (body, step, i) => {
  const box = el('div', 'build');
  body.appendChild(box);
  if (step.note) body.appendChild(el('p', 'u1-ex-note', step.note));
  const sentences = step.sentences;
  let s = 0;

  function render(){
    if (s >= sentences.length){
      box.innerHTML = `<p class="quiz-final">All ${sentences.length} sentences built.</p>`;
      markComplete(i);
      return;
    }
    const item = sentences[s];
    let misses = 0;
    box.innerHTML = `
      <p class="quiz-progress">Sentence ${s + 1} of ${sentences.length}</p>
      <p class="build-prompt">${esc(item.en)}</p>
      <div class="build-answer" aria-label="Your sentence"></div>
      <div class="build-pool" aria-label="Words to use"></div>
      <div class="build-actions">
        <button type="button" class="btn" data-act="clear">Clear</button>
        <button type="button" class="btn btn-dark" data-act="check">Check</button>
      </div>
      <p class="quiz-feedback" aria-live="polite"></p>
    `;
    const ans = box.querySelector('.build-answer');
    const pool = box.querySelector('.build-pool');
    const fb = box.querySelector('.quiz-feedback');

    const words = shuffle([...item.words, ...(item.extra || [])]);
    words.forEach(w => {
      const chip = el('button', 'drag-chip build-chip');
      chip.type = 'button';
      setTulu(chip, w);
      chip.addEventListener('click', () => {
        (chip.parentElement === pool ? ans : pool).appendChild(chip);
        fb.textContent = ''; fb.className = 'quiz-feedback';
        ans.classList.remove('is-wrong', 'is-right');
      });
      pool.appendChild(chip);
    });

    box.querySelector('[data-act="clear"]').addEventListener('click', () => {
      Array.from(ans.children).forEach(c => pool.appendChild(c));
      fb.textContent = '';
    });
    box.querySelector('[data-act="check"]').addEventListener('click', () => {
      const built = Array.from(ans.children).map(c => c.dataset.tulu);
      const target = item.words.join(' ');
      if (built.join(' ') === target){
        ans.classList.add('is-right');
        fb.textContent = 'Correct!';
        fb.className = 'quiz-feedback is-correct';
        hear(target);
        box.querySelectorAll('button').forEach(b => { b.disabled = true; });
        setTimeout(() => { s++; render(); }, 1200);
      } else {
        misses++;
        ans.classList.add('is-wrong');
        setTimeout(() => ans.classList.remove('is-wrong'), 450);
        fb.className = 'quiz-feedback is-wrong';
        fb.textContent = misses >= 2
          ? `The answer is: ${item.words.map(w => scriptText(w)).join(' ')}`
          : (built.length ? 'Not quite. Remember: the verb usually comes last.' : 'Tap the words to build the sentence first.');
      }
    });
  }
  render();
};

/* ----- listen: hear a recording, pick what was said ----- */
RENDERERS.listen = (body, step, i) => {
  const pool = step.items.filter(it => audioSrc(it.tulu));
  const rounds = shuffle(pool).slice(0, Math.min(step.rounds || 6, pool.length));
  const box = el('div', 'quiz-card listen');
  body.appendChild(box);
  let r = 0, score = 0;

  if (!rounds.length){
    box.innerHTML = '<p class="u1-ex-note">No recordings for this set yet.</p>';
    markComplete(i);
    return;
  }

  function render(){
    if (r >= rounds.length){
      box.innerHTML = `<p class="quiz-final">You recognised ${score} / ${rounds.length} by ear.</p>`;
      ENGINE.quizScores[i] = { score, total: rounds.length };
      markComplete(i);
      return;
    }
    const answer = rounds[r];
    const others = shuffle(pool.filter(it => it !== answer)).slice(0, 3);
    box.innerHTML = `
      <p class="quiz-progress">Clip ${r + 1} of ${rounds.length}</p>
      <button type="button" class="listen-play"><span class="play" aria-hidden="true"></span><span>Play the clip</span></button>
      <p class="quiz-question">Which phrase did you hear?</p>
      <div class="quiz-choices"></div>
      <p class="quiz-feedback" aria-live="polite"></p>
    `;
    box.querySelector('.listen-play').addEventListener('click', () => playTerm(answer.tulu));
    const wrap = box.querySelector('.quiz-choices');
    shuffle([answer, ...others]).forEach(opt => {
      const btn = el('button', 'quiz-choice');
      btn.type = 'button';
      setTulu(btn, opt.tulu, opt.kn);
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('.quiz-choice').forEach(b => { b.disabled = true; });
        const fb = box.querySelector('.quiz-feedback');
        if (opt === answer){
          score++;
          btn.classList.add('is-correct');
          fb.textContent = `Correct! It means "${answer.en}".`;
          fb.className = 'quiz-feedback is-correct';
        } else {
          btn.classList.add('is-wrong');
          wrap.querySelectorAll('.quiz-choice').forEach(b => { if (b.dataset.tulu === answer.tulu) b.classList.add('is-correct'); });
          fb.textContent = `It was "${answer.tulu}", meaning "${answer.en}".`;
          fb.className = 'quiz-feedback is-wrong';
        }
        setTimeout(() => { r++; render(); }, 1700);
      });
      wrap.appendChild(btn);
    });
  }
  render();
};

/* ----- dialogue: a short conversation, pick your replies ----- */
RENDERERS.dialogue = (body, step, i) => {
  const chat = el('div', 'chat');
  const choices = el('div', 'chat-choices');
  const fb = el('p', 'quiz-feedback');
  fb.setAttribute('aria-live', 'polite');
  body.append(chat, choices, fb);
  if (step.note) body.appendChild(el('p', 'u1-ex-note', step.note));
  const who = step.speaker || 'Them';
  let n = 0;

  function bubble(side, tulu, en){
    const b = el('div', `chat-bubble chat-bubble--${side}`);
    b.innerHTML = `<span class="chat-who">${side === 'them' ? esc(who) : 'You'}</span><span class="chat-tulu"></span><span class="chat-en">${esc(en)}</span>`;
    setTulu(b.querySelector('.chat-tulu'), tulu);
    chat.appendChild(b);
    hear(tulu);
  }

  function next(){
    choices.innerHTML = '';
    if (n >= step.lines.length){
      fb.className = 'quiz-feedback is-correct';
      fb.textContent = 'Conversation complete.';
      markComplete(i);
      return;
    }
    const line = step.lines[n];
    if (line.who === 'them'){
      bubble('them', line.tulu, line.en);
      n++;
      setTimeout(next, 900);
      return;
    }
    choices.appendChild(el('p', 'chat-goal', esc(line.goal)));
    shuffle(line.options).forEach(opt => {
      const btn = el('button', 'quiz-choice chat-option');
      btn.type = 'button';
      btn.innerHTML = '<span class="chat-tulu"></span>';
      setTulu(btn.querySelector('.chat-tulu'), opt.tulu);
      btn.addEventListener('click', () => {
        if (opt.correct){
          fb.textContent = '';
          fb.className = 'quiz-feedback';
          bubble('you', opt.tulu, opt.en);
          n++;
          setTimeout(next, 700);
        } else {
          btn.classList.add('is-wrong');
          btn.disabled = true;
          fb.className = 'quiz-feedback is-wrong';
          fb.textContent = `That means "${opt.en}". Try another.`;
        }
      });
      choices.appendChild(btn);
    });
  }
  next();
};

/* ----- sort: put each phrase into the right group ----- */
RENDERERS.sort = (body, step, i) => {
  const pool = el('div', 'drag-tray');
  const bins = el('div', 'sort-bins');
  const status = el('p', 'u1-ex-status');
  status.setAttribute('aria-live', 'polite');
  body.append(pool, bins, status);
  if (step.note) body.appendChild(el('p', 'u1-ex-note', step.note));

  let selected = null, placed = 0;
  const total = step.items.length;
  const update = () => { status.textContent = placed === total ? 'All sorted!' : `${placed} / ${total} sorted`; };

  const binEls = {};
  step.bins.forEach(b => {
    const bin = el('div', 'sort-bin');
    bin.innerHTML = `<p class="sort-bin-label">${esc(b.label)}</p>${b.hint ? `<p class="sort-bin-hint">${esc(b.hint)}</p>` : ''}<div class="sort-bin-items"></div>`;
    bin.addEventListener('click', () => {
      if (!selected) return;
      const { chip, item } = selected;
      if (item.bin === b.key){
        chip.classList.remove('is-selected');
        chip.classList.add('is-sorted');
        chip.disabled = true;
        chip.title = item.en;
        bin.querySelector('.sort-bin-items').appendChild(chip);
        placed++;
        update();
        if (placed === total) markComplete(i);
      } else {
        bin.classList.add('is-wrong');
        chip.classList.remove('is-selected');
        showToast(`"${item.tulu}" means "${item.en}". Try the other group.`);
        setTimeout(() => bin.classList.remove('is-wrong'), 500);
      }
      selected = null;
    });
    binEls[b.key] = bin;
    bins.appendChild(bin);
  });

  shuffle(step.items).forEach(item => {
    const chip = el('button', 'drag-chip');
    chip.type = 'button';
    setTulu(chip, item.tulu, item.kn);
    chip.classList.toggle('has-audio', !!audioSrc(item.tulu));
    chip.addEventListener('click', (e) => {
      if (chip.disabled) return;
      e.stopPropagation();
      hear(item.tulu);
      pool.querySelectorAll('.drag-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      selected = { chip, item };
    });
    pool.appendChild(chip);
  });
  update();
};

/* ----- read: Kannada script → sound → meaning ----- */
RENDERERS.read = (body, step, i) => {
  const box = el('div', 'quiz-card read');
  body.appendChild(box);
  if (step.note) body.appendChild(el('p', 'u1-ex-note', step.note));
  const items = shuffle(step.items);
  let r = 0, score = 0;

  function ask(item, phase){
    const isSound = phase === 'sound';
    const pool = step.items.filter(x => x !== item);
    const opts = shuffle([item, ...shuffle(pool).slice(0, 3)]);
    box.innerHTML = `
      <p class="quiz-progress">Word ${r + 1} of ${items.length} · ${isSound ? 'How does it sound?' : 'What does it mean?'}</p>
      <p class="read-word" lang="kn">${item.kn}</p>
      ${isSound ? '' : `<p class="read-rom">${esc(item.rom)}</p>`}
      <div class="quiz-choices"></div>
      <p class="quiz-feedback" aria-live="polite"></p>
    `;
    const wrap = box.querySelector('.quiz-choices');
    opts.forEach(opt => {
      const btn = el('button', 'quiz-choice');
      btn.type = 'button';
      btn.textContent = isSound ? opt.rom : opt.en;
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('.quiz-choice').forEach(b => { b.disabled = true; });
        const fb = box.querySelector('.quiz-feedback');
        const right = opt === item;
        if (right){ score++; btn.classList.add('is-correct'); fb.textContent = 'Correct!'; fb.className = 'quiz-feedback is-correct'; }
        else {
          btn.classList.add('is-wrong');
          wrap.querySelectorAll('.quiz-choice').forEach(b => { if (b.textContent === (isSound ? item.rom : item.en)) b.classList.add('is-correct'); });
          fb.textContent = `It's "${isSound ? item.rom : item.en}".`;
          fb.className = 'quiz-feedback is-wrong';
        }
        setTimeout(() => {
          if (isSound) ask(item, 'meaning');
          else { r++; render(); }
        }, right ? 900 : 1500);
      });
      wrap.appendChild(btn);
    });
  }

  function render(){
    if (r >= items.length){
      box.innerHTML = `<p class="quiz-final">You read ${items.length} words. ${score} / ${items.length * 2} answers right.</p>`;
      ENGINE.quizScores[i] = { score, total: items.length * 2 };
      markComplete(i);
      return;
    }
    ask(items[r], 'sound');
  }
  render();
};

/* ----- letters: Kannada letter → its sound ----- */
RENDERERS.letters = (body, step, i) => {
  const box = el('div', 'quiz-card');
  body.appendChild(box);
  const rounds = shuffle(step.letters).slice(0, step.rounds || 10);
  let r = 0, score = 0;

  function render(){
    if (r >= rounds.length){
      box.innerHTML = `<p class="quiz-final">You got ${score} / ${rounds.length} letters right.</p>`;
      ENGINE.quizScores[i] = { score, total: rounds.length };
      markComplete(i);
      return;
    }
    const answer = rounds[r];
    const opts = shuffle([answer, ...shuffle(step.letters.filter(l => l !== answer)).slice(0, 3)]);
    box.innerHTML = `
      <p class="quiz-progress">Letter ${r + 1} of ${rounds.length}</p>
      <p class="read-word" lang="kn">${answer.kn}</p>
      <p class="quiz-question">Which sound is this?</p>
      <div class="quiz-options-grid"></div>
      <p class="quiz-feedback" aria-live="polite"></p>
    `;
    const wrap = box.querySelector('.quiz-options-grid');
    opts.forEach(opt => {
      const btn = el('button', 'quiz-choice');
      btn.type = 'button';
      btn.textContent = opt.rom;
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('.quiz-choice').forEach(b => { b.disabled = true; });
        const fb = box.querySelector('.quiz-feedback');
        if (opt === answer){ score++; btn.classList.add('is-correct'); fb.textContent = 'Correct!'; fb.className = 'quiz-feedback is-correct'; }
        else {
          btn.classList.add('is-wrong');
          wrap.querySelectorAll('.quiz-choice').forEach(b => { if (b.textContent === answer.rom) b.classList.add('is-correct'); });
          fb.textContent = `It's "${answer.rom}".`;
          fb.className = 'quiz-feedback is-wrong';
        }
        setTimeout(() => { r++; render(); }, opt === answer ? 800 : 1400);
      });
      wrap.appendChild(btn);
    });
  }
  render();
};
