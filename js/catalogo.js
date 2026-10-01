import { servicios } from './data/servicios.js';
import { buildWhatsAppLink } from './whatsapp.js';

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const esc = str => String(str).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/* ── Card de servicio ──
   La reserva va directo a WhatsApp; la spec 03 la reemplaza por el formulario. */
function cardHTML(s, { badge = true, maxDetalles = Infinity } = {}) {
  const desde = s.precios[1];
  const detalles = s.detalles.slice(0, maxDetalles);
  const reservar = buildWhatsAppLink(`Hola! Quiero reservar: ${s.titulo}.`);

  return `
    <article class="card card--visual card--servicio${s.destacado && badge ? ' card--featured' : ''}" id="servicio-${esc(s.id)}">
      <div class="card__image-wrap">
        <img class="card__image" src="${esc(s.imagen)}" alt="${esc(s.alt)}" loading="lazy" />
        ${s.destacado && badge ? '<span class="card__badge">Más recomendado</span>' : ''}
      </div>
      <div class="card__body">
        ${s.recorrido ? `<p class="card__meta">${esc(s.recorrido)}</p>` : ''}
        <h3 class="card__title">${esc(s.titulo)}</h3>
        <ul class="card__list" role="list">
          ${detalles.map(d => `<li>${esc(d)}</li>`).join('')}
        </ul>
        ${s.nota ? `<p class="card__note">${esc(s.nota)}</p>` : ''}
        <p class="card__price">
          <span class="card__price-label">Desde</span>
          ${desde == null ? 'Consultar' : esc(formatoPrecio.format(desde))}
        </p>
        <a href="${reservar}" class="btn btn--primary" target="_blank" rel="noopener noreferrer"
           aria-label="Reservar ahora: ${esc(s.titulo)}">Reservar ahora</a>
      </div>
    </article>`;
}

/* ── Inicio: "Más recomendados" ── */
function initDestacados() {
  const grid = document.querySelector('[data-destacados]');
  if (!grid) return;
  grid.innerHTML = servicios
    .filter(s => s.destacado)
    .map(s => cardHTML(s, { badge: false, maxDetalles: 3 }))
    .join('');
}

/* ── Servicios: una grilla por destino ── */
function initListados() {
  document.querySelectorAll('[data-destino]').forEach(grid => {
    grid.innerHTML = servicios
      .filter(s => s.destino === grid.dataset.destino)
      .map(s => cardHTML(s))
      .join('');
  });
}

/* ── Pestañas por destino (patrón ARIA tabs, con deep link por hash) ── */
function initTabs() {
  const tablist = document.querySelector('.tabs__list[role="tablist"]');
  if (!tablist) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panelOf = tab => document.getElementById(tab.getAttribute('aria-controls'));

  function select(tab, { focus = false, updateHash = false } = {}) {
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      panelOf(t).hidden = !active;
    });
    if (focus) tab.focus();
    if (updateHash) history.replaceState(null, '', `#${tab.getAttribute('aria-controls')}`);
  }

  function fromHash() {
    const id = location.hash.slice(1);
    return tabs.find(t => t.getAttribute('aria-controls') === id);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, { updateHash: true }));
    tab.addEventListener('keydown', e => {
      const last = tabs.length - 1;
      const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[next], { focus: true, updateHash: true });
    });
  });

  window.addEventListener('hashchange', () => {
    const tab = fromHash();
    if (tab) select(tab);
  });

  select(fromHash() ?? tabs[0]);
}

export function initCatalogo() {
  initDestacados();
  initListados();
  initTabs();
}
