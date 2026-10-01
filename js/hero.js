// Carrusel del hero: fundido cada 6 s; se pausa con hover, con foco de teclado,
// con el botón de pausa y cuando la pestaña no está visible.
// Con prefers-reduced-motion arranca pausado (las flechas y los puntos siguen andando).

const INTERVALO = 6000;

export function initHero() {
  const hero = document.querySelector('[data-carrusel]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('.hero__slide')];
  const textos = [...hero.querySelectorAll('.hero__texto')];
  const puntos = [...hero.querySelectorAll('[data-ir]')];
  const pausa = hero.querySelector('[data-pausa]');
  const region = hero.querySelector('.hero__textos');
  const total = slides.length;

  let actual = 0;
  let timer = null;
  let pausadoPorUsuario = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pausaTemporal = false;

  function mostrar(i) {
    actual = (i + total) % total;
    [slides, textos].forEach(lista => lista.forEach((el, n) => {
      const activo = n === actual;
      el.classList.toggle('is-active', activo);
      el.toggleAttribute('inert', !activo);
      el.setAttribute('aria-hidden', String(!activo));
    }));
    puntos.forEach((p, n) => p.setAttribute('aria-current', String(n === actual)));
  }

  function programar() {
    clearTimeout(timer);
    const corriendo = !pausadoPorUsuario && !pausaTemporal && !document.hidden;
    hero.dataset.pausado = String(pausadoPorUsuario);
    // Mientras rota no se anuncia cada cambio; en pausa, sí
    region.setAttribute('aria-live', corriendo ? 'off' : 'polite');
    if (corriendo) timer = setTimeout(() => { mostrar(actual + 1); programar(); }, INTERVALO);
  }

  function irA(i) {
    mostrar(i);
    programar();
  }

  hero.querySelector('[data-anterior]').addEventListener('click', () => irA(actual - 1));
  hero.querySelector('[data-siguiente]').addEventListener('click', () => irA(actual + 1));
  puntos.forEach(p => p.addEventListener('click', () => irA(Number(p.dataset.ir))));

  pausa.addEventListener('click', () => {
    pausadoPorUsuario = !pausadoPorUsuario;
    pausa.setAttribute('aria-label', pausadoPorUsuario ? 'Reproducir presentación' : 'Pausar presentación');
    programar();
  });

  const pausarTemporal = valor => () => { pausaTemporal = valor; programar(); };
  hero.addEventListener('mouseenter', pausarTemporal(true));
  hero.addEventListener('mouseleave', pausarTemporal(false));
  hero.addEventListener('focusin', pausarTemporal(true));
  hero.addEventListener('focusout', e => {
    if (!hero.contains(e.relatedTarget)) pausarTemporal(false)();
  });
  document.addEventListener('visibilitychange', programar);

  // Las fotos de los slides 2 en adelante se piden 2 s después del load (o al usar los
  // controles): no compiten con la primera foto ni con el primer render
  const cargarResto = () => hero.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
  const programarCarga = () => setTimeout(cargarResto, 2000);
  if (document.readyState === 'complete') programarCarga();
  else window.addEventListener('load', programarCarga, { once: true });
  hero.querySelector('.hero__controles').addEventListener('click', cargarResto, { once: true });

  if (pausadoPorUsuario) pausa.setAttribute('aria-label', 'Reproducir presentación');
  mostrar(0);
  programar();
}
