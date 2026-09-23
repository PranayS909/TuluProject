/* ===================================================================
   UNIT 2 PRACTICE — Food & Market, Simple Sentences, Coastal Phrases,
   Questions & Verbs, Quiz. Structured to match the unit1.html pattern
   you shared: a sequence of mini-games behind progress dots and a
   prev/next nav, ending on a "unit complete" screen.

   Scoring/progress is local to this page (session-only) — nothing is
   written to Supabase here, matching how unit1's practice page works
   for now.

   All vocabulary below is exactly what's already sourced in script.js
   (ROADMAP_UNITS → Unit 2), so it stays consistent with the roadmap.
=================================================================== */

/* ---------------------------------------------------------------
   DATA
--------------------------------------------------------------- */
const MARKET_PAIRS = [
  { tulu:'maNoli', en:'ivy gourd' },
  { tulu:'touthe', en:'cucumber' },
  { tulu:'koththambari', en:'coriander' },
  { tulu:'moolangi', en:'radish' },
  { tulu:'munchi', en:'pepper' },
];

const SENTENCE_PAIRS = [
  { tulu:'yAn pOpae', en:'I go', icon:'🧍' },
  { tulu:'Aye pOpe', en:'he goes', icon:'👨' },
  { tulu:'mOlu pOpal', en:'she goes', icon:'👩' },
];
// Used only in the quiz round (don't fit the drag-to-subject format above)
const SENTENCE_EXTRA = [
  { tulu:'yAn sAleg pOpae', en:'I go to school' },
  { tulu:'enkulu dinola pEpar Oduva', en:'we read the newspaper daily' },
];

const PHRASE_PAIRS = [
  { tulu:'nekk Eth?', en:'how much is this?' },
  { tulu:'vaNas aanDa?', en:'had your lunch?' },
];

const QUESTION_PAIRS = [
  { tulu:'att / ata', en:'no / isn’t it (statement)', icon:'🚫' },
  { tulu:'ijji / ijja', en:'no / isn’t it (existence)', icon:'❌' },
  { tulu:'undu dAde?', en:'what is this?', icon:'❓' },
  { tulu:'Ir dUra pOvondullar?', en:'where are you going? (formal)', icon:'🚶' },
  { tulu:'gaNTae EtAND?', en:'what time is it?', icon:'🕐' },
];

const QUIZ_QUESTIONS = [
  { prompt:'What does "maNoli" mean?', answer:'ivy gourd', choices:['ivy gourd','cucumber','radish','pepper'] },
  { prompt:'What does "touthe" mean?', answer:'cucumber', choices:['cucumber','coriander','radish','ivy gourd'] },
  { prompt:'How do you say "I go" in Tulu?', answer:'yAn pOpae', choices:['yAn pOpae','Aye pOpe','mOlu pOpal','yAn sAleg pOpae'] },
  { prompt:'What does "yAn sAleg pOpae" mean?', answer:'I go to school', choices:['I go to school','I go home','he goes to school','we go daily'] },
  { prompt:'What does "enkulu dinola pEpar Oduva" mean?', answer:'we read the newspaper daily', choices:['we read the newspaper daily','I read the newspaper','he reads daily','we go to school daily'] },
  { prompt:'What does "nekk Eth?" mean?', answer:'how much is this?', choices:['how much is this?','what is this?','where are you going?','had your lunch?'] },
  { prompt:'What does "undu dAde?" mean?', answer:'what is this?', choices:['what is this?','how much is this?','what time is it?','where are you going?'] },
  { prompt:'What does "gaNTae EtAND?" mean?', answer:'what time is it?', choices:['what time is it?','what is this?','where are you going?','had your lunch?'] },
  { prompt:'Which word means "she goes"?', answer:'mOlu pOpal', choices:['mOlu pOpal','Aye pOpe','yAn pOpae','ijji / ijja'] },
  { prompt:'What does "ijji / ijja" mean?', answer:'no / isn’t it (existence)', choices:['no / isn’t it (existence)','no / isn’t it (statement)','what is this?','how much is this?'] },
];

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
function cssKey(str){ return str.replace(/"/g, '\\"'); }

/* ---------------------------------------------------------------
   STAGE CONTROLLER
--------------------------------------------------------------- */
const TOTAL_STAGES = 6; // 0-4 exercises, 5 = done
const stageComplete = [false, false, false, false, false];
let curStage = 0;

function initStages(){
  document.getElementById('prevBtn').addEventListener('click', () => goTo(curStage - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goTo(curStage + 1));
  document.getElementById('replayBtn').addEventListener('click', () => location.reload());
  renderDots();
  showStage(0);
}

function goTo(i){
  if (i < 0 || i >= TOTAL_STAGES) return;
  if (i > curStage && !stageComplete[curStage]) return; // can't skip ahead of an unfinished stage
  curStage = i;
  showStage(curStage);
}

function showStage(i){
  document.querySelectorAll('.u1-ex').forEach(sec => {
    sec.hidden = Number(sec.dataset.ex) !== i;
  });
  renderDots();
  const nav = document.getElementById('u2Nav');
  nav.hidden = (i === 5);
  document.getElementById('prevBtn').disabled = (i === 0);
  document.getElementById('nextBtn').disabled = i < 5 && !stageComplete[i];
  document.getElementById('nextBtn').textContent = (i === 4) ? 'Finish →' : 'Next →';
}

function markComplete(stageIndex){
  stageComplete[stageIndex] = true;
  renderDots();
  if (curStage === stageIndex) document.getElementById('nextBtn').disabled = false;
}

function renderDots(){
  const wrap = document.getElementById('u2Progress');
  wrap.innerHTML = '';
  for (let i = 0; i < 5; i++){
    const dot = document.createElement('span');
    dot.className = 'u1-dot';
    if (stageComplete[i]) dot.classList.add('is-done');
    if (i === curStage) dot.classList.add('is-current');
    wrap.appendChild(dot);
  }
}

/* ---------------------------------------------------------------
   GAME TYPE 1 — tap-to-match
--------------------------------------------------------------- */
function initTapMatch(leftId, rightId, statusId, pairs, stageIndex){
  const leftCol = document.getElementById(leftId);
  const rightCol = document.getElementById(rightId);
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';
  let selected = null;
  let matchedCount = 0;

  shuffle(pairs).forEach(p => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'match-chip';
    chip.textContent = p.tulu;
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-matched')) return;
      leftCol.querySelectorAll('.match-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      selected = { chip, p };
    });
    leftCol.appendChild(chip);
  });

  shuffle(pairs).forEach(p => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'match-chip';
    chip.textContent = p.en;
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-matched') || !selected) return;
      if (selected.p.tulu === p.tulu){
        selected.chip.classList.add('is-matched');
        selected.chip.classList.remove('is-selected');
        chip.classList.add('is-matched');
        matchedCount++;
        selected = null;
        document.getElementById(statusId).textContent =
          matchedCount === pairs.length ? 'All matched! ✓' : `${matchedCount} / ${pairs.length} matched`;
        if (matchedCount === pairs.length) markComplete(stageIndex);
      } else {
        const wrongChip = selected.chip;
        chip.classList.add('is-wrong');
        wrongChip.classList.add('is-wrong');
        selected = null;
        setTimeout(() => {
          chip.classList.remove('is-wrong');
          wrongChip.classList.remove('is-wrong');
        }, 500);
      }
    });
    rightCol.appendChild(chip);
  });

  document.getElementById(statusId).textContent = `0 / ${pairs.length} matched`;
}

/* ---------------------------------------------------------------
   GAME TYPE 2 — drag (or tap) word onto matching tile
--------------------------------------------------------------- */
function initDragMatch(trayId, gridId, statusId, pairs, stageIndex){
  const tray = document.getElementById(trayId);
  const grid = document.getElementById(gridId);
  tray.innerHTML = '';
  grid.innerHTML = '';
  let selectedChip = null;
  let placedCount = 0;

  shuffle(pairs).forEach(p => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'drag-chip';
    chip.textContent = p.tulu;
    chip.draggable = true;
    chip.dataset.key = p.tulu;
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-placed')) return;
      tray.querySelectorAll('.drag-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      selectedChip = chip;
    });
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', p.tulu);
    });
    tray.appendChild(chip);
  });

  shuffle(pairs).forEach(p => {
    const tile = document.createElement('div');
    tile.className = 'drop-tile';
    tile.innerHTML = `
      <span class="drop-icon">${p.icon || '🔹'}</span>
      <span class="drop-label">${p.en}</span>
      <span class="drop-fill"></span>
    `;
    tile.addEventListener('click', () => {
      if (!selectedChip || tile.classList.contains('is-filled')) return;
      attempt(selectedChip, selectedChip.dataset.key, tile, p);
    });
    tile.addEventListener('dragover', (e) => e.preventDefault());
    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      if (tile.classList.contains('is-filled')) return;
      const key = e.dataTransfer.getData('text/plain');
      const chip = tray.querySelector(`.drag-chip[data-key="${cssKey(key)}"]`);
      if (chip && !chip.classList.contains('is-placed')) attempt(chip, key, tile, p);
    });
    grid.appendChild(tile);
  });

  function attempt(chip, chipKey, tile, tileP){
    if (chipKey === tileP.tulu){
      chip.classList.add('is-placed');
      chip.classList.remove('is-selected');
      chip.disabled = true;
      tile.classList.add('is-filled');
      tile.querySelector('.drop-fill').textContent = chip.textContent;
      placedCount++;
      selectedChip = null;
      document.getElementById(statusId).textContent =
        placedCount === pairs.length ? 'All placed! ✓' : `${placedCount} / ${pairs.length} placed`;
      if (placedCount === pairs.length) markComplete(stageIndex);
    } else {
      tile.classList.add('is-wrong');
      if (selectedChip) selectedChip.classList.remove('is-selected');
      selectedChip = null;
      setTimeout(() => tile.classList.remove('is-wrong'), 500);
    }
  }

  document.getElementById(statusId).textContent = `0 / ${pairs.length} placed`;
}

/* ---------------------------------------------------------------
   GAME TYPE 3 — quiz
--------------------------------------------------------------- */
function initQuiz(cardId, questions, stageIndex){
  const card = document.getElementById(cardId);
  let qIdx = 0, score = 0;

  function render(){
    if (qIdx >= questions.length){
      card.innerHTML = `<p class="quiz-final">You got ${score} / ${questions.length} right! 🎉</p>`;
      markComplete(stageIndex);
      return;
    }
    const q = questions[qIdx];
    card.innerHTML = `
      <p class="quiz-progress">Question ${qIdx + 1} of ${questions.length}</p>
      <p class="quiz-question">${q.prompt}</p>
      <div class="quiz-choices"></div>
      <p class="quiz-feedback"></p>
    `;
    const choicesWrap = card.querySelector('.quiz-choices');
    shuffle(q.choices).forEach(choice => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-choice';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        card.querySelectorAll('.quiz-choice').forEach(b => b.disabled = true);
        const fb = card.querySelector('.quiz-feedback');
        if (choice === q.answer){
          score++;
          btn.classList.add('is-correct');
          fb.textContent = '✓ Correct!';
          fb.className = 'quiz-feedback is-correct';
        } else {
          btn.classList.add('is-wrong');
          fb.textContent = `✗ It's "${q.answer}."`;
          fb.className = 'quiz-feedback is-wrong';
          card.querySelectorAll('.quiz-choice').forEach(b => {
            if (b.textContent === q.answer) b.classList.add('is-correct');
          });
        }
        setTimeout(() => { qIdx++; render(); }, 900);
      });
      choicesWrap.appendChild(btn);
    });
  }
  render();
}

/* ---------------------------------------------------------------
   INIT
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initStages();
  initTapMatch('marketTulu', 'marketEnglish', 'marketStatus', MARKET_PAIRS, 0);
  initDragMatch('sentencesTray', 'sentencesGrid', 'sentencesStatus', SENTENCE_PAIRS, 1);
  initTapMatch('phrasesTulu', 'phrasesEnglish', 'phrasesStatus', PHRASE_PAIRS, 2);
  initDragMatch('questionsTray', 'questionsGrid', 'questionsStatus', QUESTION_PAIRS, 3);
  initQuiz('quizCard', QUIZ_QUESTIONS, 4);
});
