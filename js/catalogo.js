import { servicios, PRECIO_VIANDA } from './data/servicios.js';
import { getWhatsAppLink } from './whatsapp.js';
import { esc, precio } from './formato.js';

const pasajeros = n => `${n} ${n === 1 ? 'pasajero' : 'pasajeros'}`;

function preciosHTML(s) {
  return `
    <div class="precios">
      <p class="precios__titulo">Precio total del traslado</p>
      <dl class="precios__lista">
        ${[1, 2, 3, 4].map(n => `
          <div class="precios__item">
            <dt>${pasajeros(n)}</dt>
            <dd>${esc(precio(s.precios[n]))}</dd>
          </div>`).join('')}
      </dl>
      ${s.vianda ? `<p class="precios__vianda">Vianda opcional: ${esc(precio(PRECIO_VIANDA))} por persona</p>` : ''}
    </div>
    <p class="card__grupos">
      ¿5 o más?
      <a href="${getWhatsAppLink('grupos')}" target="_blank" rel="noopener noreferrer">Consultanos</a>
      o <a href="sos-tc.html">armá el itinerario del grupo</a>.
    </p>`;
}

/* ── Card de servicio ──
   compacta: solo "Desde" (inicio). completa: tabla de precios por pasajeros (servicios). */
function cardHTML(s, { compacta = false } = {}) {
  const destacada = s.destacado && !compacta;
  const detalles = compacta ? s.detalles.slice(0, 3) : s.detalles;

  return `
    <article class="card card--visual card--servicio${destacada ? ' card--featured' : ''}" id="servicio-${esc(s.id)}">
      <div class="card__image-wrap">
        <img class="card__image" src="${esc(s.imagen)}" alt="${esc(s.alt)}" loading="lazy" />
        ${destacada ? '<span class="card__badge">Más recomendado</span>' : ''}
      </div>
      <div class="card__body">
        ${s.recorrido ? `<p class="card__meta">${esc(s.recorrido)}</p>` : ''}
        <h3 class="card__title">${esc(s.titulo)}</h3>
        <ul class="card__list" role="list">
          ${detalles.map(d => `<li>${esc(d)}</li>`).join('')}
        </ul>
        ${s.nota ? `<p class="card__note">${esc(s.nota)}</p>` : ''}
        ${compacta
          ? `<p class="card__price"><span class="card__price-label">Desde</span> ${esc(precio(s.precios[1]))}</p>`
          : preciosHTML(s)}
        <button type="button" class="btn btn--primary" data-reservar="${esc(s.id)}"
                aria-label="Reservar ahora: ${esc(s.titulo)}" aria-haspopup="dialog">Reservar ahora</button>
      </div>
    </article>`;
}

/* ── Inicio: "Más recomendados" ── */
function initDestacados() {
  const grid = document.querySelector('[data-destacados]');
  if (!grid) return;
  grid.innerHTML = servicios
    .filter(s => s.destacado)
    .map(s => cardHTML(s, { compacta: true }))
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
