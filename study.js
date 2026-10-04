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
  showToast(`🔇 No recording yet for "${tuluWord}" — text-only for now.`);
}

function playAudio(card, tuluWord){
  const src = audioSrc(tuluWord);
  if (!src) return flashNoAudio(card, tuluWord);

  const audio = new Audio(src);
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

function buildCard(sectionId, item, theme, isNumeral){
  const card = document.createElement('button');
  card.type = 'button';
  card.className = audioSrc(item.tulu) ? 'study-card has-audio' : 'study-card no-audio-known';
  const wordKey = `${sectionId}::${item.tulu}`;

  const media = isNumeral
    ? `<span class="study-card-numeral">${item.en}</span>`
    : `<span class="study-card-emoji">${item.emoji || '🗣️'}</span>`;

  card.innerHTML = `
    <div class="study-card-top">
      ${media}
      <span class="study-speaker" aria-hidden="true">🔊</span>
    </div>
    <div class="study-card-tulu">${item.tulu}</div>
    <div class="study-card-en">${isNumeral ? 'tap to hear it spoken' : item.en}</div>
    <span class="study-card-learned" title="Mark as learned">✓</span>
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
  const rootStyle = getComputedStyle(document.documentElement);

  STUDY_SECTIONS.forEach(section => {
    const theme = SECTION_THEME[section.id];
    const face = rootStyle.getPropertyValue(theme.var).trim();

    // jump nav pill
    const pill = document.createElement('a');
    pill.href = `#sec-${section.id}`;
    pill.className = 'study-jump-btn';
    pill.dataset.section = section.id;
    pill.innerHTML = `${section.icon} ${section.title}`;
    pill.style.setProperty('--pill-face', face);
    jumpnav.appendChild(pill);

    // section
    const sectionEl = document.createElement('section');
    sectionEl.className = 'study-section';
    sectionEl.id = `sec-${section.id}`;

    const head = document.createElement('div');
    head.className = 'study-section-head';
    head.innerHTML = `
      <div class="study-section-icon" style="--c:${face}">${section.icon}</div>
      <div>
        <h2>${section.title}</h2>
        <p>${section.desc}</p>
      </div>
    `;
    sectionEl.appendChild(head);

    section.groups.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'study-group';
      groupEl.innerHTML = `
        <div class="study-group-head">
          <span class="study-group-name">${group.name}</span>
          <span class="study-group-count">${group.items.length} words</span>
        </div>
        ${group.note ? `<div class="study-group-note">${group.note}</div>` : ''}
      `;
      const grid = document.createElement('div');
      grid.className = 'study-grid';
      group.items.forEach(item => {
        totalWords++;
        grid.appendChild(buildCard(section.id, item, theme, !!group.numeral));
      });
      groupEl.appendChild(grid);
      sectionEl.appendChild(groupEl);
    });

    if (section.crosslink){
      const link = document.createElement('a');
      link.href = section.crosslink.href;
      link.className = 'study-crosslink';
      link.textContent = section.crosslink.label;
      sectionEl.appendChild(link);
    }

    main.appendChild(sectionEl);
  });

  updateMeta();
  setupScrollSpy();
}

function setupScrollSpy(){
  const pills = Array.from(document.querySelectorAll('.study-jump-btn'));
  const sections = STUDY_SECTIONS.map(s => document.getElementById(`sec-${s.id}`));

  function setActive(id){
    pills.forEach(p => {
      const active = p.dataset.section === id;
      p.classList.toggle('is-active', active);
      p.style.background = active ? p.style.getPropertyValue('--pill-face') : '';
      p.style.borderColor = active ? 'transparent' : '';
    });
  }

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id.replace('sec-', ''));
      });
    }, { rootMargin: '-140px 0px -70% 0px', threshold: 0 });
    sections.forEach(s => s && io.observe(s));
  }

  if (pills[0]) setActive(pills[0].dataset.section);
}

document.addEventListener('DOMContentLoaded', renderSections);