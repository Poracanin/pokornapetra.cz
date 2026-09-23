const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#navigation');
const backdrop = document.querySelector('.menu-backdrop');
const mobile = window.matchMedia('(max-width: 850px)');
const pageContent = [...document.querySelectorAll('main, .site-footer')];
let opened = false;
let ticking = false;

function updateScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 36);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('pageshow', updateScroll);
updateScroll();

function setMenu(next, returnFocus = false) {
  opened = next && mobile.matches;
  toggle.setAttribute('aria-expanded', String(opened));
  toggle.setAttribute('aria-label', opened ? 'Zavřít navigaci' : 'Otevřít navigaci');
  header.classList.toggle('menu-open', opened);
  menu.classList.toggle('is-open', opened);
  document.body.classList.toggle('navigation-open', opened);
  pageContent.forEach(element => { element.inert = opened; });
  if (opened) menu.querySelector('a').focus({ preventScroll: true });
  else if (returnFocus) toggle.focus({ preventScroll: true });
}
toggle.addEventListener('click', () => setMenu(!opened, opened));
backdrop.addEventListener('click', () => setMenu(false, true));
menu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
mobile.addEventListener('change', () => setMenu(false));
window.addEventListener('pagehide', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (!opened) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false, true);
  }
  if (event.key === 'Tab') {
    const stops = [toggle, ...menu.querySelectorAll('a[href]')];
    const first = stops[0], last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});
