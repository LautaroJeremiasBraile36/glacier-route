export function initGallery() {
  const items = [...document.querySelectorAll('.gallery__item')];
  const lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const closeBtn   = lightbox.querySelector('.lightbox__close');
  const prevBtn    = lightbox.querySelector('.lightbox__prev');
  const nextBtn    = lightbox.querySelector('.lightbox__next');
  const backdrop   = lightbox.querySelector('.lightbox__backdrop');

  const images = items.map(item => {
    const img = item.querySelector('img');
    return { src: img.src, alt: img.alt };
  });

  let current = 0;

  function show(index) {
    current = index;
    const { src, alt } = images[current];
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === images.length - 1;
  }

  function open(index) {
    show(index);
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    items[current]?.focus();
  }

  function prev() { if (current > 0) show(current - 1); }
  function next() { if (current < images.length - 1) show(current + 1); }

  // Abrir al hacer click
  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  // Controles
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Teclado
  document.addEventListener('keydown', e => {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe en mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
  }, { passive: true });
}
