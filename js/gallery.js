const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Cinta automática ──
   Se mueve sola, sin controles. Se duplica la lista para que el loop no tenga salto;
   los clones quedan fuera del árbol de accesibilidad y del orden de tabulación. */
function initCinta(viewport) {
  const track = viewport.querySelector('.gallery__track');
  if (!track || sinMovimiento()) return;

  // Las fotos llegan con data-src (ver cargarFotos): los clones se crean sin descargar nada
  [...track.children].forEach(li => {
    const clon = li.cloneNode(true);
    clon.setAttribute('aria-hidden', 'true');
    clon.querySelectorAll('button').forEach(b => { b.tabIndex = -1; });
    track.appendChild(clon);
  });

  // ~6 s por foto, sin importar cuántas haya
  track.style.setProperty('--galeria-duracion', `${track.children.length / 2 * 6}s`);

  // Pausa cuando la galería no se ve
  new IntersectionObserver(([entry]) => {
    viewport.classList.toggle('is-fuera', !entry.isIntersecting);
  }).observe(viewport);
}

/* ── Fotos: data-src → src cuando la galería se acerca a la pantalla ──
   Ya insertadas, el loading="lazy" nativo difiere las que quedan lejos en la cinta. */
function cargarFotos(viewport) {
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    viewport.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    obs.disconnect();
  }, { rootMargin: '600px 0px' });
  obs.observe(viewport);
}

/* ── Video: el póster se pide recién cerca de la pantalla (el video, solo con play) ── */
function initVideo() {
  const video = document.querySelector('video[data-poster]');
  if (!video) return;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    video.poster = video.dataset.poster;
    obs.disconnect();
  }, { rootMargin: '400px 0px' });
  obs.observe(video);
}

/* ── Lightbox ── */
export function initGallery() {
  initVideo();
  const viewport = document.querySelector('[data-galeria]');
  const lightbox = document.getElementById('lightbox');
  if (!viewport || !lightbox) return;

  // Solo las fotos originales (antes de clonar la cinta)
  const items = [...viewport.querySelectorAll('.gallery__item')];
  initCinta(viewport);
  cargarFotos(viewport);

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const caption    = lightbox.querySelector('.lightbox__caption');
  const closeBtn   = lightbox.querySelector('.lightbox__close');
  const prevBtn    = lightbox.querySelector('.lightbox__prev');
  const nextBtn    = lightbox.querySelector('.lightbox__next');
  const backdrop   = lightbox.querySelector('.lightbox__backdrop');

  const images = items.map(item => {
    const img = item.querySelector('img');
    return { src: img.dataset.full, alt: img.alt }; // el lightbox muestra la foto completa
  });

  let current = 0;
  let origen = null;

  function show(index) {
    current = index;
    const { src, alt } = images[current];
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    if (caption) caption.textContent = `${alt} (${current + 1} de ${images.length})`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === images.length - 1;
  }

  function open(index, boton) {
    origen = boton;
    show(index);
    lightbox.removeAttribute('hidden');
    viewport.classList.add('is-pausado');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    viewport.classList.remove('is-pausado');
    origen?.focus({ preventScroll: true });
  }

  function prev() { if (current > 0) show(current - 1); }
  function next() { if (current < images.length - 1) show(current + 1); }

  // Abrir al hacer click (también desde los clones de la cinta)
  viewport.addEventListener('click', e => {
    const item = e.target.closest('.gallery__item');
    if (!item) return;
    const i = Number(item.dataset.index);
    open(i, items[i]);
  });

  // Controles
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Teclado: ESC, flechas y Tab circular dentro del lightbox
  document.addEventListener('keydown', e => {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Tab') {
      const controles = [closeBtn, prevBtn, nextBtn].filter(b => !b.disabled);
      const i = controles.indexOf(document.activeElement);
      e.preventDefault();
      controles[(i + (e.shiftKey ? -1 : 1) + controles.length) % controles.length].focus();
    }
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
