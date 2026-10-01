// "/", "/index.html", "/servicios.html" y "/servicios" (URLs limpias del hosting) → misma clave
const normalizar = path => path.replace(/index\.html$/, '').replace(/\.html$/, '');

export function initNav() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!header || !hamburger) return;

  // Fondo sólido al hacer scroll
  function onScroll() {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('site-header--scrolled', scrolled);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Toggle menú hamburguesa
  hamburger.addEventListener('click', () => {
    const isOpen = header.classList.toggle('site-header--open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar menú al hacer click en cualquier link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('site-header--open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Cerrar menú con tecla ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('site-header--open')) {
      header.classList.remove('site-header--open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });

  // Link activo según la página actual (el botón CTA no se marca)
  const actual = normalizar(location.pathname);
  navLinks.forEach(link => {
    if (link.classList.contains('nav__link--cta')) return;
    const isActive = normalizar(new URL(link.href).pathname) === actual;
    link.classList.toggle('nav__link--active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });
}
