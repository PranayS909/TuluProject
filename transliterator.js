/* ===================================================================
   TRANSLITERATOR PAGE — roman/Kannada input → Tulu Lipi, plus an
   on-screen Tulu Lipi keyboard. Converters live in lipi-data.js.
=================================================================== */

let mode = 'roman'; // 'roman' | 'kannada'

document.addEventListener('DOMContentLoaded', () => {
  initModes();
  initConverter();
  initKeyboard();
  initCopyButtons();
  renderCheatSheet();
  const run = () => { document.getElementById('fontNotice').hidden = hasTigalariFont(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
});

/* ---------- converter ---------- */
function convert(){
  const text = document.getElementById('tlInput').value;
  const kannada = mode === 'roman'
    ? romanToKannada(text, { ignoreCase: document.getElementById('ignoreCase').checked })
    : text;
  document.getElementById('knOut').textContent = kannada;
  document.getElementById('tgOut').textContent = kannadaToTigalari(kannada);
}

function initConverter(){
  document.getElementById('tlInput').addEventListener('input', convert);
  document.getElementById('ignoreCase').addEventListener('change', convert);
  document.querySelectorAll('#tlExamples [data-ex]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mode !== 'roman') setMode('roman');
      document.getElementById('tlInput').value = btn.dataset.ex;
      convert();
    });
  });
}

function setMode(next){
  mode = next;
  document.querySelectorAll('.tl-modes [data-mode]').forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
  });
  const input = document.getElementById('tlInput');
  const roman = mode === 'roman';
  document.getElementById('tlInputLabel').textContent = roman ? 'Type Tulu in English letters' : 'Type or paste Tulu in Kannada script';
  input.placeholder = roman ? 'e.g. namaskAra, tuLu, solmelu' : 'ಉದಾ: ತುಳು, ನಮಸ್ಕಾರ';
  input.classList.toggle('kn', !roman);
  document.getElementById('romanOptions').hidden = !roman;
  document.getElementById('knOutWrap').hidden = !roman;
  input.value = '';
  convert();
  input.focus();
}

function initModes(){
  document.querySelectorAll('.tl-modes [data-mode]').forEach(b => {
    b.addEventListener('click', () => setMode(b.dataset.mode));
  });
}

/* ---------- keyboard ---------- */
function initKeyboard(){
  const out = document.getElementById('kbdOut');
  const rows = document.getElementById('kbdRows');

  const addRow = (label, keys) => {
    const row = document.createElement('div');
    row.className = 'kbd-row';
    row.innerHTML = `<span class="kbd-row-label">${label}</span>`;
    keys.forEach(k => {
      const key = document.createElement('button');
      key.type = 'button';
      key.className = 'kbd-key';
      key.title = k.rom;
      key.innerHTML = `<span class="tg">${k.tg}</span><small>${k.kn}</small>`;
      key.addEventListener('click', () => { out.textContent += k.tg; });
      row.appendChild(key);
    });
    rows.appendChild(row);
  };

  addRow('Vowels', LIPI_VOWELS);
  LIPI_CONSONANT_GROUPS.forEach(g => addRow(g.name.split(' (')[0], g.items));
  addRow('Signs', [
    ...LIPI_VOWEL_SIGNS.filter(s => s.tg),
    { tg:tg(0x113CE), kn:'್', rom:'virama (joins consonants)' },
  ]);

  // Array.from splits by code point, so one tap removes one character
  document.getElementById('kbdBack').addEventListener('click', () => {
    out.textContent = Array.from(out.textContent).slice(0, -1).join('');
  });
  document.getElementById('kbdSpace').addEventListener('click', () => { out.textContent += ' '; });
  document.getElementById('kbdClear').addEventListener('click', () => { out.textContent = ''; });
}

/* ---------- copy ---------- */
let toastTimer = null;
function showToast(msg){
  const toast = document.getElementById('studyToast');
  toast.textContent = msg;
  toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 1800);
}

function initCopyButtons(){
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = document.getElementById(btn.dataset.copy).textContent;
      if (!text) return showToast('Nothing to copy yet');
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied ✓');
      } catch (e){
        showToast('Copy failed — select the text and copy manually');
      }
    });
  });
}

/* ---------- cheat sheet ---------- */
function renderCheatSheet(){
  const grid = document.getElementById('cheatGrid');
  LIPI_ALL_LETTERS.forEach(l => {
    const cell = document.createElement('div');
    cell.className = 'cheat-cell';
    cell.innerHTML = `<code>${l.key}</code><span class="kn">${l.kn}</span><span class="tg">${l.tg}</span>`;
    grid.appendChild(cell);
  });
  [['M', 'ಂ', tg(0x113CC), 'aṃ'], ['H', 'ಃ', tg(0x113CD), 'aḥ']].forEach(([key, kn, t]) => {
    const cell = document.createElement('div');
    cell.className = 'cheat-cell';
    cell.innerHTML = `<code>${key}</code><span class="kn">${kn}</span><span class="tg">${t}</span>`;
    grid.appendChild(cell);
  });
}
