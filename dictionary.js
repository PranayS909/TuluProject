/* ===================================================================
   DICTIONARY PAGE — searchable list built from STUDY_SECTIONS
   (vocab-data.js), so a word added to the course shows up here too.
=================================================================== */

let activeSection = 'all';
const ENTRIES = [];

document.addEventListener('DOMContentLoaded', () => {
  buildEntries();
  renderFilters();
  document.getElementById('dictQuery').addEventListener('input', render);
  render();
});

// lowercase, drop accents and punctuation so "Solmelu!" matches "solmelu"
function normalize(s){
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildEntries(){
  const seen = new Set();
  STUDY_SECTIONS.forEach(section => {
    section.groups.forEach(group => {
      group.items.forEach(item => {
        const key = `${section.id}::${item.tulu}`;
        if (seen.has(key)) return; // "irva" appears in two number groups
        seen.add(key);
        ENTRIES.push({
          ...item,
          numeral: !!group.numeral,
          section,
          group: group.name,
          haystack: normalize(`${item.tulu} ${item.en} ${group.name}`),
        });
      });
    });
  });
}

function renderFilters(){
  const wrap = document.getElementById('dictFilters');
  const make = (id, label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'study-jump-btn';
    b.dataset.section = id;
    b.setAttribute('role', 'tab');
    b.textContent = label;
    b.addEventListener('click', () => { activeSection = id; render(); });
    wrap.appendChild(b);
  };
  make('all', '✨ All');
  STUDY_SECTIONS.forEach(s => make(s.id, `${s.icon} ${s.title}`));
}

function render(){
  const q = normalize(document.getElementById('dictQuery').value);
  const terms = q ? q.split(' ') : [];

  document.querySelectorAll('#dictFilters [data-section]').forEach(b => {
    const on = b.dataset.section === activeSection;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
  });

  const results = ENTRIES.filter(e =>
    (activeSection === 'all' || e.section.id === activeSection) &&
    terms.every(t => e.haystack.includes(t))
  );

  const list = document.getElementById('dictList');
  list.innerHTML = '';
  results.forEach(e => list.appendChild(row(e)));

  document.getElementById('dictCount').textContent =
    `${results.length} ${results.length === 1 ? 'entry' : 'entries'}${q ? ` for “${document.getElementById('dictQuery').value.trim()}”` : ''}`;
  document.getElementById('dictEmpty').hidden = results.length > 0;
}

function row(e){
  const el = document.createElement('div');
  el.className = 'dict-row';
  const badge = e.numeral
    ? `<span class="dict-badge dict-badge--num">${e.en}</span>`
    : `<span class="dict-badge">${e.emoji || '🗣️'}</span>`;
  el.innerHTML = `
    ${badge}
    <div class="dict-words">
      <div class="dict-tulu"></div>
      <div class="dict-en"></div>
    </div>
    <div class="dict-meta">
      <span class="dict-tag"></span>
      <a class="dict-practice" href="${e.section.crosslink ? e.section.crosslink.href : 'study.html'}">Practice →</a>
    </div>
    <button type="button" class="study-speaker dict-speaker" aria-label="Play ${e.tulu}">🔊</button>
  `;
  // vocab text goes in via textContent so stray < or & can't break the page
  el.querySelector('.dict-tulu').textContent = e.tulu;
  el.querySelector('.dict-en').textContent = e.numeral ? `the number ${e.en}` : e.en;
  el.querySelector('.dict-tag').textContent = `${e.section.title} · ${e.group}`;
  el.querySelector('.dict-speaker').addEventListener('click', () => play(e));
  return el;
}

function play(e){
  const audio = new Audio(`audio/${e.section.id}/${slugify(e.tulu)}.${AUDIO_EXT}`);
  audio.play().catch(() => showToast(`🔇 No recording yet for "${e.tulu}"`));
}

let toastTimer = null;
function showToast(msg){
  const toast = document.getElementById('studyToast');
  toast.textContent = msg;
  toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2200);
}
