/* ===================================================================
   UNIT 1 PRACTICE EXERCISES
   Five self-contained mini-games built from the Unit 1 study material.
   Pure vanilla JS, Pointer Events for drag-and-drop (works with mouse,
   touch, and pen alike). No backend calls yet — see the note at the
   bottom about wiring completion into XP/streak.
=================================================================== */

/* ---------------------------------------------------------------
   1. DATA — straight from the Unit 1 study material
--------------------------------------------------------------- */
const GREETINGS = [
  { tulu: "Yencha ullar?",        en: "How are you?" },
  { tulu: "Yaan usar ulle",       en: "I am fine" },
  { tulu: "Erena pudar enchina?", en: "What is your name?" },
  { tulu: "Yenna pudar…",         en: "My name is…" },
  { tulu: "Solmelu",              en: "Thank you" },
  { tulu: "Barpe",                en: "Goodbye" },
];

const NUMBERS = [
  { key: "onji",   word: "onji",   n: 1 },
  { key: "raDD",   word: "raDD",   n: 2 },
  { key: "mUji",   word: "mUji",   n: 3 },
  { key: "nAl",    word: "nAl",    n: 4 },
  { key: "ain",    word: "ain",    n: 5 },
  { key: "Aji",    word: "Aji",    n: 6 },
  { key: "El",     word: "El",     n: 7 },
  { key: "enma",   word: "enma",   n: 8 },
  { key: "orumba", word: "orumba", n: 9 },
  { key: "patt",   word: "patt",   n: 10 },
];

const FAMILY = [
  { key: "appe",    word: "appe",    visual: "👩" }, // mother
  { key: "amme",    word: "amme",    visual: "👨" }, // father
  { key: "ajje",    word: "ajje",    visual: "👴" }, // grandfather
  { key: "ajji",    word: "ajji",    visual: "👵" }, // grandmother
  { key: "mage",    word: "mage",    visual: "👦" }, // son
  { key: "magal",   word: "magal",   visual: "👧" }, // daughter
  { key: "kaNDane", word: "kaNDane", visual: "🤵" }, // husband
  { key: "boDedi",  word: "boDedi",  visual: "👰" }, // wife
];

const MARKET = [
  { key: "bangude",  word: "bangude",  visual: "🐟" }, // mackerel
  { key: "yetti",    word: "yetti",    visual: "🦐" }, // prawns
  { key: "denji",    word: "denji",    visual: "🦀" }, // crab
  { key: "noonji",   word: "noonji",   visual: "🦑" }, // squid
  { key: "ulli",     word: "ulli",     visual: "🧅" }, // onion
  { key: "bollulli", word: "bollulli", visual: "🧄" }, // garlic
  { key: "munchi",   word: "munchi",   visual: "🌶️" }, // chilli
  { key: "kumbala",  word: "kumbala",  visual: "🎃" }, // pumpkin
];

const QUIZ = [
  { q: "How do you say \u201cThank you\u201d in Tulu?", options: ["Solmelu", "Barpe", "Yencha ullar?", "Yenna pudar…"] },
  { q: "What does \u201cBarpe\u201d mean?", options: ["Goodbye", "Thank you", "How are you?", "My name is…"] },
  { q: "What number is \u201cmUji\u201d?", options: ["3", "4", "2", "5"] },
  { q: "How do you say \u201c7\u201d in Tulu?", options: ["El", "Aji", "enma", "orumba"] },
  { q: "Who is your \u201cajji\u201d?", options: ["Grandmother", "Grandfather", "Mother", "Daughter"] },
  { q: "\u201cmagal\u201d means…", options: ["Daughter", "Son", "Wife", "Sister"] },
  { q: "\u201cbangude\u201d is a kind of…", options: ["Fish", "Prawn", "Crab", "Vegetable"] },
  { q: "\u201culli\u201d means…", options: ["Onion", "Garlic", "Ginger", "Chilli"] },
];

/* ---------------------------------------------------------------
   2. SHARED STATE + NAVIGATION
--------------------------------------------------------------- */
const EXERCISE_COUNT = 5; // greetings, numbers, family, market, quiz (done screen = index 5)
let current = 0;
let completed = [false, false, false, false, false];

const stageSections = Array.from(document.querySelectorAll(".u1-ex"));
const progressWrap = document.getElementById("u1Progress");
const navWrap = document.getElementById("u1Nav");
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

function buildDots() {
  progressWrap.innerHTML = "";
  for (let i = 0; i < EXERCISE_COUNT; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "u1-dot";
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
  const dots = progressWrap.querySelectorAll(".u1-dot");
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
   3. EXERCISE 1 — TAP TO MATCH (greetings)
--------------------------------------------------------------- */
const matchTuluEl = document.getElementById("matchTulu");
const matchEnglishEl = document.getElementById("matchEnglish");
const greetStatus = document.getElementById("greetStatus");

let greetSelected = null;
let greetMatchedCount = 0;

function renderGreetings() {
  matchTuluEl.innerHTML = "";
  matchEnglishEl.innerHTML = "";
  greetSelected = null;
  greetMatchedCount = 0;
  greetStatus.textContent = "";

  const tuluOrder = shuffle(GREETINGS.map((g, i) => i));
  const enOrder = shuffle(GREETINGS.map((g, i) => i));

  tuluOrder.forEach((idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "match-card";
    card.textContent = GREETINGS[idx].tulu;
    card.dataset.idx = idx;
    card.addEventListener("click", () => onGreetClick("tulu", idx, card));
    matchTuluEl.appendChild(card);
  });

  enOrder.forEach((idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "match-card";
    card.textContent = GREETINGS[idx].en;
    card.dataset.idx = idx;
    card.addEventListener("click", () => onGreetClick("en", idx, card));
    matchEnglishEl.appendChild(card);
  });
}

function onGreetClick(type, idx, el) {
  if (el.classList.contains("is-correct")) return;

  if (!greetSelected) {
    greetSelected = { type, idx, el };
    el.classList.add("is-selected");
    return;
  }

  if (greetSelected.type === type) {
    greetSelected.el.classList.remove("is-selected");
    greetSelected = { type, idx, el };
    el.classList.add("is-selected");
    return;
  }

  const a = greetSelected;
  const b = { type, idx, el };
  if (a.idx === b.idx) {
    a.el.classList.remove("is-selected");
    a.el.classList.add("is-correct");
    b.el.classList.add("is-correct");
    greetMatchedCount++;
    if (greetMatchedCount === GREETINGS.length) {
      greetStatus.textContent = "All matched! Great job. 🎉";
      markComplete(0);
    }
  } else {
    a.el.classList.add("is-wrong");
    b.el.classList.add("is-wrong");
    setTimeout(() => {
      a.el.classList.remove("is-selected", "is-wrong");
      b.el.classList.remove("is-wrong");
    }, 400);
  }
  greetSelected = null;
}

/* ---------------------------------------------------------------
   4. EXERCISES 2–4 — GENERIC DRAG & DROP ENGINE
--------------------------------------------------------------- */
let ghostEl = null;

function moveGhost(x, y) {
  if (!ghostEl) return;
  ghostEl.style.left = x + "px";
  ghostEl.style.top = y + "px";
}

function setupDragDrop(trayEl, gridEl, items, statusEl, exIndex, visualFn) {
  trayEl.innerHTML = "";
  gridEl.innerHTML = "";
  statusEl.textContent = "";
  let placedCount = 0;

  const chipOrder = shuffle(items.map((it, i) => i));
  const targetOrder = shuffle(items.map((it, i) => i));

  chipOrder.forEach((i) => {
    const item = items[i];
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item.word;
    chip.dataset.key = item.key;
    chip.dataset.word = item.word;
    attachDragHandlers(chip);
    trayEl.appendChild(chip);
  });

  targetOrder.forEach((i) => {
    const item = items[i];
    const target = document.createElement("div");
    target.className = "drop-target";
    target.dataset.key = item.key;
    target.innerHTML = `
      <span class="drop-visual">${visualFn(item)}</span>
      <span class="drop-answer"></span>
    `;
    gridEl.appendChild(target);
  });

  function attachDragHandlers(chip) {
    chip.addEventListener("pointerdown", (e) => {
      if (chip.classList.contains("is-placed")) return;
      e.preventDefault();
      chip.setPointerCapture(e.pointerId);
      chip.classList.add("is-dragging");

      ghostEl = document.createElement("div");
      ghostEl.className = "chip-ghost";
      ghostEl.textContent = chip.dataset.word;
      document.body.appendChild(ghostEl);
      moveGhost(e.clientX, e.clientY);

      let lastHover = null;

      function onMove(ev) {
        moveGhost(ev.clientX, ev.clientY);
        ghostEl.style.display = "none";
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        ghostEl.style.display = "";
        const target = under?.closest(".drop-target");
        if (target !== lastHover) {
          if (lastHover) lastHover.classList.remove("is-hover");
          if (target && !target.classList.contains("is-filled")) target.classList.add("is-hover");
          lastHover = target;
        }
      }

      function onUp(ev) {
        chip.removeEventListener("pointermove", onMove);
        chip.removeEventListener("pointerup", onUp);
        chip.removeEventListener("pointercancel", onUp);
        chip.classList.remove("is-dragging");
        if (lastHover) lastHover.classList.remove("is-hover");
        ghostEl?.remove();
        ghostEl = null;

        const under2 = document.elementFromPoint(ev.clientX, ev.clientY);
        const dropEl = under2?.closest(".drop-target");

        if (dropEl && !dropEl.classList.contains("is-filled")) {
          if (dropEl.dataset.key === chip.dataset.key) {
            dropEl.classList.add("is-filled");
            dropEl.querySelector(".drop-answer").textContent = chip.dataset.word;
            chip.classList.add("is-placed");
            placedCount++;
            if (placedCount === items.length) {
              statusEl.textContent = "All matched! 🎉";
              markComplete(exIndex);
            }
          } else {
            dropEl.classList.add("is-wrong-flash");
            setTimeout(() => dropEl.classList.remove("is-wrong-flash"), 350);
          }
        }
      }

      chip.addEventListener("pointermove", onMove);
      chip.addEventListener("pointerup", onUp);
      chip.addEventListener("pointercancel", onUp);
    });
  }
}

function shellVisual(item) {
  return `<span class="dot-cluster">${"🐚".repeat(item.n)}</span>`;
}
function emojiVisual(item) {
  return item.visual;
}

/* ---------------------------------------------------------------
   5. EXERCISE 5 — QUICK QUIZ
--------------------------------------------------------------- */
const quizCard = document.getElementById("quizCard");
let quizIndex = 0;
let quizScore = 0;

function renderQuiz() {
  const q = QUIZ[quizIndex];
  const correctText = q.options[0];
  const shuffled = shuffle(q.options);

  quizCard.innerHTML = `
    <p class="quiz-progress">Question ${quizIndex + 1} of ${QUIZ.length}</p>
    <p class="quiz-prompt">${q.q}</p>
    <div class="quiz-options"></div>
    <p class="quiz-score">Score: ${quizScore} / ${QUIZ.length}</p>
  `;

  const optionsWrap = quizCard.querySelector(".quiz-options");
  shuffled.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.addEventListener("click", () => onQuizAnswer(btn, opt, correctText, optionsWrap));
    optionsWrap.appendChild(btn);
  });
}

function onQuizAnswer(btn, chosen, correctText, optionsWrap) {
  const allButtons = optionsWrap.querySelectorAll(".quiz-option");
  allButtons.forEach((b) => (b.disabled = true));

  if (chosen === correctText) {
    btn.classList.add("is-correct");
    quizScore++;
  } else {
    btn.classList.add("is-wrong");
    allButtons.forEach((b) => {
      if (b.textContent === correctText) b.classList.add("is-correct");
    });
  }

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < QUIZ.length) {
      renderQuiz();
    } else {
      quizCard.innerHTML = `
        <p class="quiz-prompt">You scored ${quizScore} / ${QUIZ.length}! 🎯</p>
        <p class="quiz-score">Tap "Finish" below to wrap up Unit 1.</p>
      `;
      markComplete(4);
    }
  }, 700);
}

/* ---------------------------------------------------------------
   6. DONE SCREEN + REPLAY
--------------------------------------------------------------- */
const doneSummary = document.getElementById("doneSummary");
const replayBtn = document.getElementById("replayBtn");

function goToDone() {
  current = EXERCISE_COUNT;
  showExercise(current);
  doneSummary.textContent = `You matched every word and scored ${quizScore} / ${QUIZ.length} on the quiz.`;
}

replayBtn.addEventListener("click", () => {
  completed = [false, false, false, false, false];
  quizIndex = 0;
  quizScore = 0;
  renderGreetings();
  setupDragDrop(document.getElementById("numbersTray"), document.getElementById("numbersGrid"), NUMBERS, document.getElementById("numbersStatus"), 1, shellVisual);
  setupDragDrop(document.getElementById("familyTray"), document.getElementById("familyGrid"), FAMILY, document.getElementById("familyStatus"), 2, emojiVisual);
  setupDragDrop(document.getElementById("marketTray"), document.getElementById("marketGrid"), MARKET, document.getElementById("marketStatus"), 3, emojiVisual);
  renderQuiz();
  goTo(0);
});

/* ---------------------------------------------------------------
   7. INIT
--------------------------------------------------------------- */
buildDots();
renderGreetings();
setupDragDrop(document.getElementById("numbersTray"), document.getElementById("numbersGrid"), NUMBERS, document.getElementById("numbersStatus"), 1, shellVisual);
setupDragDrop(document.getElementById("familyTray"), document.getElementById("familyGrid"), FAMILY, document.getElementById("familyStatus"), 2, emojiVisual);
setupDragDrop(document.getElementById("marketTray"), document.getElementById("marketGrid"), MARKET, document.getElementById("marketStatus"), 3, emojiVisual);
renderQuiz();
showExercise(0);
