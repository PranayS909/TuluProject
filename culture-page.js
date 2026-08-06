/* ===================================================================
   CULTURE DETAIL PAGES — shared behaviour
   (Independent of script.js so the main site is never touched.)
   Used by: nagaradhane.html, kambala.html, aliyasantana.html,
            everyday-cuisine.html, festivals.html
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initThemeCustomizer();
});

/* ---------- NAV ---------- */
function initNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    links.style.cssText = open
      ? 'display:flex;flex-direction:column;gap:16px;position:absolute;top:100%;left:0;right:0;background:#fff;padding:20px 24px;border-bottom:2px solid var(--grey-light);'
      : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    links.style.cssText = '';
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ===================================================================
   THEME CUSTOMIZER — same behaviour as the main site
=================================================================== */
const DEFAULT_THEME = { accent:'#58CC02', bg:'#FFFFFF' };

function hexToRgb(hex){
  const h = hex.replace('#','');
  const full = h.length === 3 ? h.split('').map(c => c+c).join('') : h;
  const num = parseInt(full, 16);
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}
function rgbToHex(r,g,b){
  return '#' + [r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function darken(hex, amount){
  const { r,g,b } = hexToRgb(hex);
  return rgbToHex(r*(1-amount), g*(1-amount), b*(1-amount));
}

function applyAccent(hex){
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-dark', darken(hex, 0.18));
  document.getElementById('accentCustom').value = hex;
}
function applyBackground(hex){
  document.documentElement.style.setProperty('--page-bg', hex);
  document.getElementById('bgCustom').value = hex;
}

function initThemeCustomizer(){
  const fab = document.getElementById('themeFab');
  const panel = document.getElementById('themePanel');
  const scrim = document.getElementById('themeScrim');
  const closeBtn = document.getElementById('themeClose');
  const resetBtn = document.getElementById('themeReset');
  const accentCustom = document.getElementById('accentCustom');
  const bgCustom = document.getElementById('bgCustom');

  const openPanel = () => { panel.classList.add('is-open'); scrim.classList.add('is-open'); fab.setAttribute('aria-expanded','true'); };
  const closePanel = () => { panel.classList.remove('is-open'); scrim.classList.remove('is-open'); fab.setAttribute('aria-expanded','false'); };

  fab.addEventListener('click', () => panel.classList.contains('is-open') ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);

  document.querySelectorAll('#accentSwatches [data-accent]').forEach(btn => {
    btn.addEventListener('click', () => applyAccent(btn.dataset.accent));
  });
  document.querySelectorAll('#bgSwatches [data-bg]').forEach(btn => {
    btn.addEventListener('click', () => applyBackground(btn.dataset.bg));
  });

  accentCustom.addEventListener('input', () => applyAccent(accentCustom.value));
  bgCustom.addEventListener('input', () => applyBackground(bgCustom.value));

  resetBtn.addEventListener('click', () => {
    applyAccent(DEFAULT_THEME.accent);
    applyBackground(DEFAULT_THEME.bg);
  });
}
