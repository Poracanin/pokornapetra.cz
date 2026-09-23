// Reveal editorial content once; forms, navigation and results stay immediate.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
  const pending = new Set();
  const active = new Map();
  const selectors = [
    '.intro-inner', '.section-heading', '.property-card', '.service-item',
    '.contact-band-inner', '.review', '.article-card', '.service-detail',
    '.article-body > section',
  ].join(',');

  function reveal(element, immediate = false) {
    observer.unobserve(element);
    element.removeAttribute('data-reveal-pending');
    pending.delete(element);
    if (immediate || reducedMotion.matches || document.hidden) return;

    const staggered = element.matches('.property-card, .service-item, .review, .article-card');
    const siblings = [...element.parentElement.children].filter(child => child.matches(selectors));
    const delay = staggered ? Math.min(siblings.indexOf(element), 2) * 70 : 0;
    const animation = element.animate(
      [{ opacity: 0, translate: '0 18px' }, { opacity: 1, translate: '0 0' }],
      { duration: 900, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' },
    );
    active.set(element, animation);
    animation.finished.catch(() => {}).finally(() => active.delete(element));
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  // Arm only below-the-fold content, avoiding flashes on load or scroll restoration.
  for (const element of document.querySelectorAll(selectors)) {
    if (element.hidden || element.getBoundingClientRect().top < window.innerHeight - 24) continue;
    pending.add(element);
    observer.observe(element);
    element.setAttribute('data-reveal-pending', '');
  }

  function revealFocused(event) {
    const element = event.target.closest(selectors);
    if (!element) return;
    if (pending.has(element)) reveal(element, true);
    active.get(element)?.cancel();
  }
  document.addEventListener('focusin', revealFocused);

  function revealAnchor() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const element = target?.closest(selectors);
    if (element && pending.has(element)) reveal(element, true);
    if (element) active.get(element)?.cancel();
  }
  window.addEventListener('hashchange', revealAnchor);
  revealAnchor();

  function finish() {
    observer.disconnect();
    for (const element of pending) element.removeAttribute('data-reveal-pending');
    pending.clear();
    for (const animation of active.values()) animation.cancel();
    active.clear();
    document.removeEventListener('focusin', revealFocused);
    window.removeEventListener('hashchange', revealAnchor);
  }
  reducedMotion.addEventListener('change', event => { if (event.matches) finish(); });
  window.addEventListener('pagehide', finish, { once: true });
}
