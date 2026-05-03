export function initNav() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

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

  // Scroll spy — marca el link activo según la sección visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('nav__link--active', isActive);
      });
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  });

  sections.forEach(section => observer.observe(section));
}
