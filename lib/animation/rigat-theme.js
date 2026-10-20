export function initializeTheme() {
 'use strict';
 const nav = document.getElementById('siteNav');
 const links = [...nav.querySelectorAll('nav a')];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 function updateNav() {
  nav.classList.toggle('scrolled', scrollY > 20);
  const top = document.getElementById('savoir-faire').getBoundingClientRect().top;
  const exit = window.RigatStory?.getExit() || 0;
  const result = Number(window.BMNHero?.getStatus()?.chapter) === 6;
  const current = top < innerHeight * .55 ? 3 : exit > .7 ? (result ? 2 : 1) : 0;
  links.forEach((link, i) => {
   link.classList.toggle('nav-active', current === i);
   if (current === i) link.setAttribute('aria-current', 'location');
   else link.removeAttribute('aria-current');
  });
 }
 let queued = false;
 function queueNav() { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; updateNav(); }); } }
 addEventListener('scroll', queueNav, {passive:true});
 addEventListener('resize', queueNav, {passive:true});
 updateNav();
 const menu = document.getElementById('mobileNav'), toggle = document.getElementById('mobileMenuToggle');
 function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Ouvrir la navigation'); }
 toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer la navigation' : 'Ouvrir la navigation');
  menu.hidden = !open;
 });
 menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
 addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
 addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); }, {passive:true});
 document.addEventListener('click', event => { if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu(); });
 document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
   if (!item.open) return;
   document.querySelectorAll('.faq-list details').forEach(other => { if (other !== item) other.open = false; });
  });
 });
 // Progressive enhancement: every section remains visible without JavaScript.
 if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting) {
    entry.target.animate([{opacity:.4,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}], {duration:650,easing:'cubic-bezier(.2,.65,.3,1)'});
    observer.unobserve(entry.target);
   }
  }), {threshold:.12});
  document.querySelectorAll('.expertise-card, .process-grid article, .section-heading, .faq-section>div, .closing-section').forEach(el => observer.observe(el));
 }
}
