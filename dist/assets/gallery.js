const gallery = document.querySelector('#gallery-dialog');
if (gallery) {
  const { photos, title } = JSON.parse(document.querySelector('#gallery-data').textContent);
  const image = gallery.querySelector('#gallery-image');
  const counter = gallery.querySelector('#gallery-count');
  const thumbnails = [...gallery.querySelectorAll('[data-gallery-thumb]')];
  const stage = gallery.querySelector('.lightbox-stage');
  const fitButton = gallery.querySelector('[data-gallery-fit]');
  let index = 0, trigger, touch;

  function show(next, focusThumbnail = false) {
    index = (next + photos.length) % photos.length;
    image.src = photos[index];
    image.alt = `${title} – fotografie ${index + 1} z ${photos.length}`;
    counter.textContent = `${index + 1} / ${photos.length}`;
    thumbnails.forEach((button, i) => {
      button.tabIndex = i === index ? 0 : -1;
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    if (gallery.open) {
      thumbnails[index].scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
      if (focusThumbnail) thumbnails[index].focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('[data-gallery-open]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      gallery.showModal();
      show(Number(button.dataset.galleryOpen));
    });
  });
  thumbnails.forEach((button, i) => button.addEventListener('click', () => show(i, true)));
  gallery.querySelector('[data-gallery-close]').addEventListener('click', () => gallery.close());
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(index - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(index + 1));
  fitButton.addEventListener('click', () => {
    const contain = gallery.classList.toggle('show-whole-photo');
    fitButton.setAttribute('aria-pressed', String(contain));
    fitButton.textContent = contain ? 'Vyplnit obrazovku' : 'Celá fotografie';
  });
  gallery.addEventListener('keydown', event => {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: photos.length - 1 }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      show(next, !!event.target.closest('[data-gallery-thumb]'));
    }
  });
  gallery.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
  // Swiping the photo changes it; the thumbnail strip keeps native horizontal scrolling.
  stage.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touch || event.target.closest('button')) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) show(index + (dx < 0 ? 1 : -1));
    touch = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touch = null; }, { passive: true });
}
