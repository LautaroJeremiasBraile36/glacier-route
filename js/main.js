import { initNav }                       from './nav.js';
import { initWhatsApp, getWhatsAppLink } from './whatsapp.js';
import { initGallery }                   from './gallery.js';
import { initCatalogo }                  from './catalogo.js';
import { initReserva }                   from './reserva.js';
import { initSosTc }                     from './sos-tc.js';
import { INSTAGRAM_URL }                 from './config.js';

// Cada inicializador sale sin hacer nada si su elemento no está en la página
initNav();
initWhatsApp();
initInstagramLinks();
initCatalogo();
initReserva();
initSosTc();
initGallery();
initScrollIndicator();
initSectionAnimations();
initFabScrollSpy();

/* ── Links de Instagram desde js/config.js ── */
function initInstagramLinks() {
  document.querySelectorAll('.js-instagram').forEach(el => {
    el.href = INSTAGRAM_URL;
  });
}

/* ── Oculta la flecha del hero al llegar a la sección siguiente ── */
function initScrollIndicator() {
  const indicator = document.querySelector('.hero__scroll-indicator');
  const target    = document.querySelector('.hero')?.nextElementSibling;
  if (!indicator || !target) return;

  new IntersectionObserver(
    ([entry]) => indicator.classList.toggle('is-hidden', entry.isIntersecting),
    { threshold: 0.1 }
  ).observe(target);
}

/* ── Fade-in de secciones al entrar en viewport ── */
function initSectionAnimations() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.add('animate'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  sections.forEach(s => observer.observe(s));
}

/* ── FAB WhatsApp cambia mensaje según sección visible ── */
function initFabScrollSpy() {
  const fab = document.querySelector('.fab--whatsapp');
  if (!fab) return;

  const sectionKeys = {
    calafate: 'calafate_generico',
    chalten:  'chalten_generico',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const key = sectionKeys[entry.target.id] ?? fab.dataset.whatsappKey ?? 'generic';
      fab.href = getWhatsAppLink(key);
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  });

  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}
