/* ===================================================================
   DETAIL PAGES — shared nav toggle + reveal behaviour
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
});

function initNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

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

function initReveal(){
  const targets = document.querySelectorAll('[data-reveal-auto]');
  targets.forEach(el => el.setAttribute('data-reveal', ''));

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
