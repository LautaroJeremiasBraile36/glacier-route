// Carrusel del hero: fundido cada 6 s, sin controles; solo se detiene mientras la
// pestaña no está visible. Con prefers-reduced-motion queda fija la primera imagen.

const INTERVALO = 6000;

export function initHero() {
  const hero = document.querySelector('[data-carrusel]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('.hero__slide')];
  const textos = [...hero.querySelectorAll('.hero__texto')];
  const total = slides.length;

  let actual = 0;
  let timer = null;

  function mostrar(i) {
    actual = (i + total) % total;
    [slides, textos].forEach(lista => lista.forEach((el, n) => {
      const activo = n === actual;
      el.classList.toggle('is-active', activo);
      el.toggleAttribute('inert', !activo);
      el.setAttribute('aria-hidden', String(!activo));
    }));
  }

  function programar() {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(() => { mostrar(actual + 1); programar(); }, INTERVALO);
  }

  mostrar(0);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Las fotos de los slides 2 en adelante se piden 2 s después del load:
  // no compiten con la primera foto ni con el primer render
  const cargarResto = () => hero.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
  const programarCarga = () => setTimeout(cargarResto, 2000);
  if (document.readyState === 'complete') programarCarga();
  else window.addEventListener('load', programarCarga, { once: true });

  document.addEventListener('visibilitychange', programar);
  programar();
}
