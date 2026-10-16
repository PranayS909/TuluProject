/* ===================================================================
   SHARED BEHAVIOUR — floating nav + scroll reveal.
   Loaded by every redesigned page (the homepage has its own copy of
   these in script.js).
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSiteNav();
  initSiteReveal();
  initJumpnav();
});

function initSiteNav(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    if (toggle){
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  };
  if (toggle) toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  if (links) links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

function initSiteReveal(){
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)){
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -30px 0px' });
  targets.forEach(el => io.observe(el));
}

/* Highlights the jump-nav pill for the section in view. Pages that
   build their pills later (study.js) call this again once they exist. */
function initJumpnav(){
  const pills = Array.from(document.querySelectorAll('.jumpnav a[href^="#"]'));
  if (!pills.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(pills.map(p => [p.getAttribute('href').slice(1), p]));
  const setActive = (id) => pills.forEach(p => p.classList.toggle('is-active', p === byId.get(id)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin:'-160px 0px -65% 0px', threshold:0 });
  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  setActive(pills[0].getAttribute('href').slice(1));
}
