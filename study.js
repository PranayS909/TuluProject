/* ===================================================================
   STUDY PAGE — sectioned vocab/phrase cards, click-to-play audio.
   Word lists live in vocab-data.js; recordings are mapped in audio-map.js.
=================================================================== */

let heardWords = new Set();
let learnedWords = new Set();
let totalWords = 0;

function flashNoAudio(card, tuluWord){
  card.classList.add('no-audio-known');
  card.classList.remove('has-audio');
  card.classList.add('is-noaudio-flash');
  setTimeout(() => card.classList.remove('is-noaudio-flash'), 400);
  showToast(`No recording yet for "${tuluWord}". Text only for now.`);
}

function playAudio(card, tuluWord){
  const src = audioSrc(tuluWord);
  if (!src) return flashNoAudio(card, tuluWord);

  const audio = newClip(src);
  card.classList.add('is-playing');
  const clearPlaying = () => card.classList.remove('is-playing');

  audio.addEventListener('ended', clearPlaying);
  audio.addEventListener('error', () => { clearPlaying(); flashNoAudio(card, tuluWord); });
  audio.play().catch(() => { clearPlaying(); flashNoAudio(card, tuluWord); });
}

let toastTimer = null;
function showToast(msg){
  const toast = document.getElementById('studyToast');
  toast.textContent = msg;
  toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2200);
}

function updateMeta(){
  document.getElementById('metaHeard').textContent = heardWords.size;
  document.getElementById('metaTotal').textContent = totalWords;
}

function buildCard(sectionId, item, isNumeral){
  const card = document.createElement('button');
  card.type = 'button';
  card.className = audioSrc(item.tulu) ? 'study-card has-audio' : 'study-card no-audio-known';
  card.setAttribute('aria-label', `${item.tulu}: ${item.en}. Play recording`);
  const wordKey = `${sectionId}::${item.tulu}`;

  card.innerHTML = `
    <div class="study-card-top">
      ${isNumeral ? `<span class="study-card-numeral">${item.en}</span>` : '<span></span>'}
      <span class="play" aria-hidden="true"></span>
    </div>
    <div class="study-card-tulu">${item.tulu}</div>
    <div class="study-card-en">${isNumeral ? 'tap to hear it spoken' : item.en}</div>
    <span class="study-card-learned" title="Mark as learned"></span>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.study-card-learned')){
      e.stopPropagation();
      card.classList.toggle('is-learned');
      if (card.classList.contains('is-learned')) learnedWords.add(wordKey);
      else learnedWords.delete(wordKey);
      return;
    }
    heardWords.add(wordKey);
    updateMeta();
    playAudio(card, item.tulu);
  });

  return card;
}

function renderSections(){
  const main = document.getElementById('studyMain');
  const jumpnav = document.getElementById('studyJumpnav');

  STUDY_SECTIONS.forEach((section, i) => {
    // jump nav pill
    const pill = document.createElement('a');
    pill.href = `#sec-${section.id}`;
    pill.className = 'jump-btn';
    pill.textContent = section.title;
    jumpnav.appendChild(pill);

    // section
    const sectionEl = document.createElement('section');
    sectionEl.className = 'tool-section';
    sectionEl.id = `sec-${section.id}`;

    const head = document.createElement('div');
    head.className = 'tool-section-head';
    head.innerHTML = `
      <span class="num">${String(i + 1).padStart(2, '0')}</span>
      <h2>${section.title}</h2>
      <p>${section.desc}</p>
    `;
    sectionEl.appendChild(head);

    section.groups.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'group';
      groupEl.innerHTML = `
        <div class="group-head">
          <span class="group-name">${group.name}</span>
          <span class="group-count">${group.items.length} words</span>
        </div>
        ${group.note ? `<div class="group-note">${group.note}</div>` : ''}
      `;
      const grid = document.createElement('div');
      grid.className = 'study-grid';
      group.items.forEach(item => {
        totalWords++;
        grid.appendChild(buildCard(section.id, item, !!group.numeral));
      });
      groupEl.appendChild(grid);
      sectionEl.appendChild(groupEl);
    });

    if (section.crosslink){
      const link = document.createElement('a');
      link.href = section.crosslink.href;
      link.className = 'btn btn-primary study-crosslink';
      link.textContent = section.crosslink.label;
      sectionEl.appendChild(link);
    }

    main.appendChild(sectionEl);
  });

  updateMeta();
  if (typeof initJumpnav === 'function') initJumpnav();
}

document.addEventListener('DOMContentLoaded', renderSections);
