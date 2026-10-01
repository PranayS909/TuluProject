/* ===================================================================
   TULU LIPI PAGE — alphabet grid, syllable builder, tracing canvas,
   and a 10-question quiz. Letter data lives in lipi-data.js.
=================================================================== */

const QUIZ_LENGTH = 10;
const QUIZ_BEST_KEY = 'tuluLipiQuizBest';

let traceIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  renderAlphabet();
  renderSyllablePicker();
  initTrace();
  initQuiz();
  checkFont();
});

/* ---------- font check ---------- */
function checkFont(){
  const run = () => { document.getElementById('fontNotice').hidden = hasTigalariFont(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  else run();
}

/* ---------- alphabet ---------- */
function letterTile(letter, index){
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'lipi-tile';
  tile.innerHTML = `
    <span class="lipi-tg tg">${letter.tg}</span>
    <span class="lipi-kn">${letter.kn}</span>
    <span class="lipi-rom">${letter.rom}</span>
    <span class="lipi-key" title="Type this in the transliterator">${letter.key}</span>
  `;
  tile.addEventListener('click', () => {
    setTraceLetter(index);
    document.getElementById('trace').scrollIntoView({ behavior:'smooth', block:'start' });
  });
  return tile;
}

function renderAlphabet(){
  const vowelGrid = document.getElementById('vowelGrid');
  LIPI_VOWELS.forEach((v, i) => vowelGrid.appendChild(letterTile(v, i)));
  document.getElementById('vowelCount').textContent = `${LIPI_VOWELS.length} letters`;

  const wrap = document.getElementById('consonantGroups');
  let index = LIPI_VOWELS.length;
  LIPI_CONSONANT_GROUPS.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'study-group';
    groupEl.innerHTML = `
      <div class="study-group-head">
        <span class="study-group-name">Consonants · ${group.name}</span>
        <span class="study-group-count">${group.items.length} letters</span>
      </div>
    `;
    const grid = document.createElement('div');
    grid.className = 'lipi-grid';
    group.items.forEach(c => grid.appendChild(letterTile(c, index++)));
    groupEl.appendChild(grid);
    wrap.appendChild(groupEl);
  });
}

/* ---------- syllables ---------- */
function renderSyllablePicker(){
  const picker = document.getElementById('sylPicker');
  const consonants = LIPI_CONSONANT_GROUPS.flatMap(g => g.items);
  consonants.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'syl-pick';
    btn.setAttribute('role', 'tab');
    btn.innerHTML = `<span class="tg">${c.tg}</span><small>${c.rom}</small>`;
    btn.addEventListener('click', () => selectConsonant(i));
    picker.appendChild(btn);
  });
  selectConsonant(0);
}

function selectConsonant(i){
  const consonants = LIPI_CONSONANT_GROUPS.flatMap(g => g.items);
  const c = consonants[i];
  document.querySelectorAll('.syl-pick').forEach((b, j) => {
    b.classList.toggle('is-active', j === i);
    b.setAttribute('aria-selected', String(j === i));
  });

  const base = c.rom.replace(/a$/, ''); // "ka" → "k"
  const grid = document.getElementById('sylGrid');
  grid.innerHTML = '';
  LIPI_VOWEL_SIGNS.forEach(sign => {
    const rom = base + sign.rom;
    const cell = document.createElement('div');
    cell.className = 'syl-cell';
    cell.innerHTML = `
      <span class="syl-tg tg">${c.tg}${sign.tg}</span>
      <span class="syl-kn">${c.kn}${sign.kn}</span>
      <span class="syl-rom">${rom}</span>
    `;
    grid.appendChild(cell);
  });
}

/* ---------- tracing ----------
   Scoring: render the letter as a mask, compare with the learner's
   strokes. "coverage" = how much of the letter got drawn over;
   "precision" = how much of the ink landed near the letter. */
let traceCtx, drawing = false, strokes = [];

function initTrace(){
  const canvas = document.getElementById('traceCanvas');
  traceCtx = canvas.getContext('2d');

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x:(e.clientX - r.left) * canvas.width / r.width, y:(e.clientY - r.top) * canvas.height / r.height };
  };
  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    strokes.push([pos(e)]);
    redrawTrace();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    strokes[strokes.length - 1].push(pos(e));
    redrawTrace();
  });
  const stop = () => { drawing = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  document.getElementById('traceClear').addEventListener('click', () => { strokes = []; setStars(''); redrawTrace(); });
  document.getElementById('tracePrev').addEventListener('click', () => setTraceLetter(traceIndex - 1));
  document.getElementById('traceNext').addEventListener('click', () => setTraceLetter(traceIndex + 1));
  document.getElementById('traceCheck').addEventListener('click', scoreTrace);

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTraceLetter(0));
  else setTraceLetter(0);
}

function setTraceLetter(i){
  const n = LIPI_ALL_LETTERS.length;
  traceIndex = (i + n) % n;
  const letter = LIPI_ALL_LETTERS[traceIndex];
  document.getElementById('traceTg').textContent = letter.tg;
  document.getElementById('traceKn').textContent = letter.kn;
  document.getElementById('traceRom').textContent = letter.rom;
  strokes = [];
  setStars('');
  redrawTrace();
}

function glyphFont(){
  const stack = getComputedStyle(document.documentElement).getPropertyValue('--font-tg').trim() || 'serif';
  return `220px ${stack}`;
}

function drawGlyph(ctx, color, outline){
  const { width:w, height:h } = ctx.canvas;
  ctx.save();
  ctx.font = glyphFont();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(LIPI_ALL_LETTERS[traceIndex].tg, w / 2, h / 2 + 10);
  if (outline){
    ctx.strokeStyle = color;
    ctx.lineWidth = outline;
    ctx.lineJoin = 'round';
    ctx.strokeText(LIPI_ALL_LETTERS[traceIndex].tg, w / 2, h / 2 + 10);
  }
  ctx.restore();
}

function drawStrokes(ctx, color, width){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  strokes.forEach(s => {
    ctx.beginPath();
    s.forEach((p, j) => j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y);
    ctx.stroke();
  });
  ctx.restore();
}

function redrawTrace(){
  const ctx = traceCtx;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // guide lines
  ctx.save();
  ctx.strokeStyle = '#E5E5E5';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height / 2); ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
  ctx.moveTo(ctx.canvas.width / 2, 0); ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
  ctx.stroke();
  ctx.restore();

  drawGlyph(ctx, 'rgba(18,51,44,.13)');
  drawStrokes(ctx, getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#58CC02', 14);
}

function maskFrom(drawFn){
  const c = document.createElement('canvas');
  c.width = traceCtx.canvas.width;
  c.height = traceCtx.canvas.height;
  const ctx = c.getContext('2d');
  drawFn(ctx);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const mask = new Uint8Array(c.width * c.height);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 60 ? 1 : 0;
  return mask;
}

function scoreTrace(){
  if (!strokes.length){ setStars('Draw over the letter first ✏️'); return; }

  const glyph = maskFrom(ctx => drawGlyph(ctx, '#000'));
  const glyphNear = maskFrom(ctx => drawGlyph(ctx, '#000', 22));
  const ink = maskFrom(ctx => drawStrokes(ctx, '#000', 22));
  const inkThin = maskFrom(ctx => drawStrokes(ctx, '#000', 14));

  let glyphPx = 0, covered = 0, inkPx = 0, onTarget = 0;
  for (let i = 0; i < glyph.length; i++){
    if (glyph[i]){ glyphPx++; if (ink[i]) covered++; }
    if (inkThin[i]){ inkPx++; if (glyphNear[i]) onTarget++; }
  }
  if (!glyphPx){ setStars('This letter needs a Tulu Lipi font to trace.'); return; }

  const score = Math.sqrt((covered / glyphPx) * (onTarget / Math.max(inkPx, 1)));
  const stars = score >= 0.72 ? 3 : score >= 0.52 ? 2 : score >= 0.32 ? 1 : 0;
  const words = ['Keep going — try again!', 'Nice start!', 'Good tracing!', 'Excellent! 🎉'];
  setStars(`${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}  ${words[stars]}`);
}

function setStars(text){ document.getElementById('traceStars').textContent = text; }

/* ---------- quiz ---------- */
let quiz = null;

function initQuiz(){
  showBest();
  document.getElementById('quizStartBtn').addEventListener('click', startQuiz);
  document.getElementById('quizAgainBtn').addEventListener('click', startQuiz);
}

function readBest(){
  try { return Number(localStorage.getItem(QUIZ_BEST_KEY)) || 0; } catch (e){ return 0; }
}
function showBest(){
  const best = readBest();
  document.getElementById('quizBest').textContent = best
    ? `Your best so far: ${best} / ${QUIZ_LENGTH}`
    : 'Match Tulu Lipi letters to their sounds and Kannada twins.';
}

function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz(){
  const letters = shuffle(LIPI_ALL_LETTERS).slice(0, QUIZ_LENGTH);
  quiz = { letters, i:0, score:0 };
  document.getElementById('quizStart').hidden = true;
  document.getElementById('quizDone').hidden = true;
  document.getElementById('quizPlay').hidden = false;
  showQuestion();
}

function showQuestion(){
  const answer = quiz.letters[quiz.i];
  const distractors = shuffle(LIPI_ALL_LETTERS.filter(l => l !== answer)).slice(0, 3);
  const options = shuffle([answer, ...distractors]);
  // alternate: Tigalari → sound, then Kannada → Tigalari
  const forward = quiz.i % 2 === 0;

  document.getElementById('quizFill').style.width = `${(quiz.i / QUIZ_LENGTH) * 100}%`;
  document.getElementById('quizPrompt').textContent = forward
    ? 'Which sound is this Tulu Lipi letter?'
    : 'Which Tulu Lipi letter matches this Kannada one?';
  const glyph = document.getElementById('quizGlyph');
  glyph.textContent = forward ? answer.tg : answer.kn;
  glyph.className = `quiz-glyph ${forward ? 'tg' : 'kn'}`;

  const box = document.getElementById('quizOptions');
  box.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quiz-opt${forward ? '' : ' tg'}`;
    btn.textContent = forward ? opt.rom : opt.tg;
    btn.addEventListener('click', () => answerQuestion(btn, opt === answer, answer, forward));
    box.appendChild(btn);
  });
}

function answerQuestion(btn, correct, answer, forward){
  const buttons = document.querySelectorAll('.quiz-opt');
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === (forward ? answer.rom : answer.tg)) b.classList.add('is-right');
  });
  if (correct) quiz.score++;
  else btn.classList.add('is-wrong');

  setTimeout(() => {
    quiz.i++;
    if (quiz.i < QUIZ_LENGTH) showQuestion();
    else finishQuiz();
  }, correct ? 650 : 1300);
}

function finishQuiz(){
  document.getElementById('quizPlay').hidden = true;
  document.getElementById('quizDone').hidden = false;
  const best = Math.max(readBest(), quiz.score);
  try { localStorage.setItem(QUIZ_BEST_KEY, String(best)); } catch (e){ /* private mode */ }
  const cheer = quiz.score === QUIZ_LENGTH ? 'Perfect! 🏆' : quiz.score >= 7 ? 'Great work! 🎉' : 'Keep practising 💪';
  document.getElementById('quizScore').textContent = `${quiz.score} / ${QUIZ_LENGTH} — ${cheer}`;
  showBest();
}
