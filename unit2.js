/* ===================================================================
   UNIT 2 PRACTICE EXERCISES
   1. Verb → picture match (flip card reveal)
   2. Tense conjugation fill-in-the-blank
   3. Simple sentence fill-in-the-blank
=================================================================== */

/* ---------------------------------------------------------------
   1. DATA — verb table from the study material
--------------------------------------------------------------- */
const VERBS = [
  { key: "Pola",   meaning: "to go",           emoji: "🚶➡️",
    past: "Pothe",     pastGloss: "I went",
    present: "Povaondulle", presentGloss: "I am going",
    future: "Pove",    futureGloss: "I will go" },
  { key: "Bala",   meaning: "to come",         emoji: "⬅️🚶",
    past: "Bathe",     pastGloss: "I came",
    present: "Baraondulle", presentGloss: "I am coming",
    future: "Barpe",   futureGloss: "I will come" },
  { key: "Tin",    meaning: "to eat",          emoji: "🍽️",
    past: "Thinde",    pastGloss: "I ate",
    present: "Tinaondulle", presentGloss: "I am eating",
    future: "Thinpe",  futureGloss: "I will eat" },
  { key: "Par",    meaning: "to drink",        emoji: "🥤",
    past: "Phare",     pastGloss: "I drank",
    present: "Paraondulle", presentGloss: "I am drinking",
    future: "Parpe",   futureGloss: "I will drink" },
  { key: "Pan",    meaning: "to tell",         emoji: "🗣️",
    past: "Pandhe",    pastGloss: "I told",
    present: "Panaondulle", presentGloss: "I am telling",
    future: "Panpe",   futureGloss: "I will tell" },
  { key: "Manpu",  meaning: "to do",           emoji: "🛠️",
    past: "Malthe",    pastGloss: "I did",
    present: "Malpaondulle", presentGloss: "I am doing",
    future: "Malpe",   futureGloss: "I will do" },
  { key: "Kullu",  meaning: "to sit",          emoji: "🪑",
    past: "Kullude",   pastGloss: "I sat",
    present: "Kullaondulle", presentGloss: "I am sitting",
    future: "Kulluve", futureGloss: "I will sit" },
  { key: "Lakk",   meaning: "to get up",       emoji: "⬆️🧍",
    past: "Lakh'the",  pastGloss: "I got up",
    present: "Lakkaondulle", presentGloss: "I am getting up",
    future: "Lakpe",   futureGloss: "I will get up" },
  { key: "Koru",   meaning: "to give",         emoji: "🎁➡️",
    past: "Korthe",    pastGloss: "I gave",
    present: "Koraondulle", presentGloss: "I am giving",
    future: "Korpe",   futureGloss: "I will give" },
  { key: "Detonu", meaning: "to take",         emoji: "⬅️🎁",
    past: "Detonde",   pastGloss: "I took",
    present: "Detonaondulle", presentGloss: "I am taking",
    future: "Detonpe", futureGloss: "I will take" },
  { key: "Malagu", meaning: "to sleep",        emoji: "😴",
    past: "Jethe",     pastGloss: "I slept",
    present: "Jalaondulle", presentGloss: "I am sleeping",
    future: "Jelpe",   futureGloss: "I will sleep" },
  { key: "Buru",   meaning: "to fall",         emoji: "😵⬇️",
    past: "Burthe",    pastGloss: "I fell",
    present: "Buraondulle", presentGloss: "I am falling",
    future: "Burpe",   futureGloss: "I will fall" },
  { key: "Balipu", meaning: "to run",          emoji: "🏃",
    past: "Balithe",   pastGloss: "I ran",
    present: "Balipaondulle", presentGloss: "I am running",
    future: "Balipe",  futureGloss: "I will run" },
  { key: "Nalipu", meaning: "to dance",        emoji: "💃",
    past: "Nalithe",   pastGloss: "I danced",
    present: "Nalipaondulle", presentGloss: "I am dancing",
    future: "Nalipe",  futureGloss: "I will dance" },
  { key: "Jakk",   meaning: "to wash",         emoji: "🧼",
    past: "Jakh'the",  pastGloss: "I washed",
    present: "Jakkaondulle", presentGloss: "I am washing",
    future: "Jakpe",   futureGloss: "I will wash" },
  { key: "Mi",     meaning: "to bathe",        emoji: "🛁",
    past: "Mithe",     pastGloss: "I bathed",
    present: "Miaondulle", presentGloss: "I am bathing",
    future: "Mipe",    futureGloss: "I will bathe" },
  { key: "Too",    meaning: "to see",          emoji: "👀",
    past: "Thuye",     pastGloss: "I saw",
    present: "Thuvaondulle", presentGloss: "I am seeing",
    future: "Thuve",   futureGloss: "I will see" },
  { key: "Ken",    meaning: "to listen / ask", emoji: "👂",
    past: "Kende",     pastGloss: "I heard",
    present: "Kenaondulle", presentGloss: "I am listening",
    future: "Kenpe",   futureGloss: "I will listen" },
  { key: "Odu",    meaning: "to read",         emoji: "📖",
    past: "Od'the",    pastGloss: "I read",
    present: "Odaondulle", presentGloss: "I am reading",
    future: "Odpe",    futureGloss: "I will read" },
  { key: "Bare",   meaning: "to write",        emoji: "✍️",
    past: "Barenthe",  pastGloss: "I wrote",
    present: "Bareaondulle", presentGloss: "I am writing",
    future: "Barepe",  futureGloss: "I will write" },
  { key: "Paater", meaning: "to talk",         emoji: "💬",
    past: "Paaterthe", pastGloss: "I spoke",
    present: "Paateraondulle", presentGloss: "I am talking",
    future: "Paaterpe", futureGloss: "I will talk" },
  { key: "Madapu", meaning: "to forget",       emoji: "🧽💭",
    past: "Madapthe",  pastGloss: "I forgot",
    present: "Madapaondulle", presentGloss: "I am forgetting",
    future: "Madappe", futureGloss: "I will forget" },
];

const TENSE_LABEL = { past: "Past", present: "Present", future: "Future" };

// The five sentences given for this unit, cleaned up.
const TENSE_FIXED = [
  { sentence: "Yaan nanteed gunturodu ___.", verb: "Pola", tense: "future" },
  { sentence: "Yaanette ___.",               verb: "Tin",  tense: "past" },
  { sentence: "Yaan neer ___.",              verb: "Par",  tense: "present" },
  { sentence: "Yaan kurchilu ___.",          verb: "Kullu", tense: "past" },
  { sentence: "Yaan kalsa ___.",             verb: "Manpu", tense: "future" },
];

// Simple sentence practice (some accept more than one correct word).
const SENTENCES = [
  { sentence: "Yaan illade ___.",     gloss: "I come home", answers: ["Barpe"] },
  { sentence: "Ee olpa ___?",         gloss: "Where are you going", answers: ["Pova", "Pove"] },
  { sentence: "Aal koodlaDsis ___.",  gloss: "She came from Mangalore", answers: ["Batte", "Bydini"] },
];

/* ---------------------------------------------------------------
   2. SHARED HELPERS + NAVIGATION
--------------------------------------------------------------- */
const EXERCISE_COUNT = 3; // verbs, tenses, sentences (done screen = index 3)
let current = 0;
let completed = [false, false, false];

const stageSections = Array.from(document.querySelectorAll(".u2-ex"));
const progressWrap = document.getElementById("u2Progress");
const navWrap = document.getElementById("u2Nav");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findVerb(key) {
  return VERBS.find((v) => v.key === key);
}

function tenses() {
  return ["past", "present", "future"];
}

function buildDots() {
  progressWrap.innerHTML = "";
  for (let i = 0; i < EXERCISE_COUNT; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "u2-dot";
    dot.setAttribute("aria-label", `Go to exercise ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    progressWrap.appendChild(dot);
  }
}

function markComplete(index) {
  completed[index] = true;
  updateUI();
}

function showExercise(index) {
  stageSections.forEach((sec) => {
    sec.hidden = Number(sec.dataset.ex) !== index;
  });
  navWrap.style.display = index === EXERCISE_COUNT ? "none" : "flex";
  updateUI();
}

function updateUI() {
  const dots = progressWrap.querySelectorAll(".u2-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("is-current", i === current);
    dot.classList.toggle("is-done", completed[i] && i !== current);
  });
  prevBtn.disabled = current === 0;
  if (current < EXERCISE_COUNT) {
    nextBtn.textContent = current === EXERCISE_COUNT - 1 ? "Finish 🎉" : "Next →";
    nextBtn.disabled = !completed[current];
  }
}

function goTo(index) {
  current = index;
  showExercise(current);
}

prevBtn.addEventListener("click", () => {
  if (current > 0) goTo(current - 1);
});

nextBtn.addEventListener("click", () => {
  if (current === EXERCISE_COUNT - 1 && completed[current]) {
    goToDone();
    return;
  }
  if (current < EXERCISE_COUNT - 1) goTo(current + 1);
});

/* ---------------------------------------------------------------
   3. EXERCISE 1 — VERB → PICTURE MATCH (flip card)
--------------------------------------------------------------- */
const verbCountEl = document.getElementById("verbCount");
const flipCardInner = document.getElementById("flipCardInner");
const flipWordEl = document.getElementById("flipWord");
const flipBackVisual = document.getElementById("flipBackVisual");
const flipBackWord = document.getElementById("flipBackWord");
const flipBackMeaning = document.getElementById("flipBackMeaning");
const flipBackTenses = document.getElementById("flipBackTenses");
const verbOptionsEl = document.getElementById("verbOptions");
const nextWordBtn = document.getElementById("nextWordBtn");
const verbStatus = document.getElementById("verbStatus");

let verbOrder = [];
let verbIndex = 0;

function setupVerbExercise() {
  verbOrder = shuffle(VERBS.map((v, i) => i));
  verbIndex = 0;
  flipCardInner.classList.remove("is-flipped");
  verbStatus.textContent = "";
  nextWordBtn.hidden = true;
  renderVerbRound();
}

function renderVerbRound() {
  const verb = VERBS[verbOrder[verbIndex]];
  verbCountEl.textContent = `Word ${verbIndex + 1} / ${VERBS.length}`;
  flipWordEl.textContent = verb.key;
  flipBackVisual.textContent = verb.emoji;
  flipBackWord.textContent = verb.key;
  flipBackMeaning.textContent = verb.meaning;
  flipBackTenses.innerHTML = `
    <span>${verb.past}</span>
    <span>${verb.present}</span>
    <span>${verb.future}</span>
  `;
  flipCardInner.classList.remove("is-flipped");
  nextWordBtn.hidden = true;

  const distractors = shuffle(VERBS.filter((v) => v.key !== verb.key)).slice(0, 3);
  const options = shuffle([verb, ...distractors]);

  verbOptionsEl.innerHTML = "";
  options.forEach((opt) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "verb-option";
    tile.textContent = opt.emoji;
    tile.dataset.key = opt.key;
    tile.addEventListener("click", () => onVerbOptionClick(tile, opt.key === verb.key));
    verbOptionsEl.appendChild(tile);
  });
}

function onVerbOptionClick(tile, isCorrect) {
  if (isCorrect) {
    Array.from(verbOptionsEl.children).forEach((t) => (t.disabled = true));
    tile.classList.add("is-correct");
    setTimeout(() => {
      flipCardInner.classList.add("is-flipped");
      nextWordBtn.hidden = false;
    }, 250);
  } else {
    tile.classList.add("is-wrong");
    tile.disabled = true;
  }
}

nextWordBtn.addEventListener("click", () => {
  verbIndex++;
  if (verbIndex < verbOrder.length) {
    renderVerbRound();
  } else {
    verbStatus.textContent = "All 22 verbs matched! 🎉";
    nextWordBtn.hidden = true;
    markComplete(0);
  }
});

/* ---------------------------------------------------------------
   4. GENERIC FILL-IN-THE-BLANK ENGINE (shared by tenses + sentences)
--------------------------------------------------------------- */
function makeFibRunner({ cardEl, questions, buildQuestionView, exIndex }) {
  let index = 0;
  let score = 0;

  function render() {
    const q = questions[index];
    const { sentenceHtml, glossText, options, isCorrect } = buildQuestionView(q);
    const shuffledOptions = shuffle(options);

    cardEl.innerHTML = `
      <p class="fib-progress">Question ${index + 1} of ${questions.length}</p>
      <p class="fib-sentence">${sentenceHtml}</p>
      <p class="fib-gloss">${glossText}</p>
      <div class="fib-options"></div>
      <p class="fib-score">Score: ${score} / ${questions.length}</p>
    `;

    const wrap = cardEl.querySelector(".fib-options");
    shuffledOptions.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fib-option";
      btn.textContent = opt;
      btn.addEventListener("click", () => onAnswer(btn, opt, isCorrect, wrap));
      wrap.appendChild(btn);
    });
  }

  function onAnswer(btn, chosen, isCorrect, wrap) {
    const allButtons = wrap.querySelectorAll(".fib-option");
    allButtons.forEach((b) => (b.disabled = true));

    const correct = isCorrect(chosen);
    if (correct) {
      btn.classList.add("is-correct");
      score++;
    } else {
      btn.classList.add("is-wrong");
      allButtons.forEach((b) => {
        if (isCorrect(b.textContent)) b.classList.add("is-correct");
      });
    }

    setTimeout(() => {
      index++;
      if (index < questions.length) {
        render();
      } else {
        cardEl.innerHTML = `
          <p class="fib-sentence">You scored ${score} / ${questions.length}! 🎯</p>
        `;
        markComplete(exIndex);
      }
    }, 800);
  }

  return {
    render,
    reset: () => {
      index = 0;
      score = 0;
      render();
    },
  };
}

/* ---------------------------------------------------------------
   5. EXERCISE 2 — TENSE PRACTICE
--------------------------------------------------------------- */
function buildTenseQuestions() {
  const usedKeys = new Set(TENSE_FIXED.map((q) => q.verb));
  const remaining = shuffle(VERBS.filter((v) => !usedKeys.has(v.key))).slice(0, 7);

  const extra = remaining.map((v) => ({
    sentence: "Yaan ___.",
    verb: v.key,
    tense: tenses()[Math.floor(Math.random() * 3)],
  }));

  return [...TENSE_FIXED, ...extra];
}

function tenseQuestionView(q) {
  const verb = findVerb(q.verb);
  const form = verb[q.tense];
  const gloss = verb[q.tense + "Gloss"];
  const sentenceHtml = q.sentence.replace("___", '<span class="fib-blank">______</span>');
  const glossText = `(${verb.key} \u2192 ${TENSE_LABEL[q.tense]}: \u201c${gloss}\u201d)`;

  const otherTenses = tenses().filter((t) => t !== q.tense).map((t) => verb[t]);
  const otherVerb = VERBS[Math.floor(Math.random() * VERBS.length)];
  const randomForm = otherVerb[tenses()[Math.floor(Math.random() * 3)]];

  let options = [form, ...otherTenses, randomForm].filter((v, i, arr) => arr.indexOf(v) === i);
  while (options.length < 4) {
    const filler = VERBS[Math.floor(Math.random() * VERBS.length)].past;
    if (!options.includes(filler)) options.push(filler);
  }

  return {
    sentenceHtml,
    glossText,
    options: options.slice(0, 4),
    isCorrect: (chosen) => chosen === form,
  };
}

const tenseCardEl = document.getElementById("tenseCard");
let tenseRunner;

/* ---------------------------------------------------------------
   6. EXERCISE 3 — SIMPLE SENTENCES
--------------------------------------------------------------- */
function sentenceQuestionView(q) {
  const sentenceHtml = q.sentence.replace("___", '<span class="fib-blank">______</span>');
  const glossText = `(${q.gloss})`;

  const pool = VERBS.flatMap((v) => [v.past, v.present, v.future]);
  const distractors = shuffle(pool.filter((w) => !q.answers.includes(w))).slice(0, 4 - q.answers.length);
  const options = shuffle([...q.answers, ...distractors]).slice(0, 4);

  return {
    sentenceHtml,
    glossText,
    options,
    isCorrect: (chosen) => q.answers.includes(chosen),
  };
}

const sentenceCardEl = document.getElementById("sentenceCard");
let sentenceRunner;

/* ---------------------------------------------------------------
   7. DONE SCREEN + REPLAY
--------------------------------------------------------------- */
const replayBtn = document.getElementById("replayBtn");

function goToDone() {
  current = EXERCISE_COUNT;
  showExercise(current);
}

replayBtn.addEventListener("click", () => {
  completed = [false, false, false];
  setupVerbExercise();
  tenseRunner.reset();
  sentenceRunner.reset();
  goTo(0);
});

/* ---------------------------------------------------------------
   8. INIT
--------------------------------------------------------------- */
buildDots();
setupVerbExercise();

tenseRunner = makeFibRunner({
  cardEl: tenseCardEl,
  questions: buildTenseQuestions(),
  buildQuestionView: tenseQuestionView,
  exIndex: 1,
});
tenseRunner.render();

sentenceRunner = makeFibRunner({
  cardEl: sentenceCardEl,
  questions: SENTENCES,
  buildQuestionView: sentenceQuestionView,
  exIndex: 2,
});
sentenceRunner.render();

showExercise(0);