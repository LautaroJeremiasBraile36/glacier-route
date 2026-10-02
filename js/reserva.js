import { servicios, PRECIO_VIANDA } from './data/servicios.js';
import { campos, PERSONAS_GRUPO } from './data/campos.js';
import { buildWhatsAppLink } from './whatsapp.js';
import { esc, precio, fechaCorta, hoyISO } from './formato.js';

let dialog;
let servicio;
let opener;

/* ════════════════════════════════════════
   MARCADO
════════════════════════════════════════ */

const ICONO_CERRAR = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

function campoHTML(id) {
  const c = campos[id];
  const fid = `reserva-${id}`;
  const ayuda = id === 'vianda'
    ? `${precio(PRECIO_VIANDA)} por persona. Te contamos las opciones por WhatsApp.`
    : c.ayuda;
  const describedby = ayuda ? ` aria-describedby="${fid}-ayuda"` : '';
  const ayudaHTML = ayuda ? `<p id="${fid}-ayuda" class="campo__ayuda">${esc(ayuda)}</p>` : '';

  if (c.type === 'toggle') {
    return `
      <div class="campo campo--toggle" data-campo="${id}">
        <button type="button" id="${fid}" class="toggle" aria-pressed="false"${describedby}>
          <span class="toggle__switch" aria-hidden="true"></span>
          <span class="toggle__label">${esc(c.label)}</span>
        </button>
        ${ayudaHTML}
      </div>`;
  }

  const req = c.required ? ' required' : '';
  const marca = c.required ? ' <span class="campo__req" aria-hidden="true">*</span>' : '';
  let control;

  if (c.type === 'select') {
    control = `
      <select id="${fid}" name="${id}"${req}${describedby}>
        <option value="" disabled selected>Elegí una opción</option>
        ${c.opciones.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}
      </select>`;
  } else {
    const attrs = [
      c.type === 'date' ? `min="${hoyISO()}"` : '',
      c.min != null ? `min="${c.min}"` : '',
      c.max != null ? `max="${c.max}"` : '',
      c.type === 'number' ? 'inputmode="numeric"' : '',
      c.placeholder ? `placeholder="${esc(c.placeholder)}"` : '',
      c.autocomplete ? `autocomplete="${c.autocomplete}"` : '',
    ].filter(Boolean).join(' ');
    control = `<input id="${fid}" name="${id}" type="${c.type}" ${attrs}${req}${describedby} />`;
  }

  return `
    <div class="campo" data-campo="${id}">
      <label for="${fid}" class="campo__label">${esc(c.label)}${marca}</label>
      ${control}
      ${ayudaHTML}
    </div>`;
}

function formHTML(s) {
  const ids = ['nombre', ...s.campos];
  const grupoMsg = buildWhatsAppLink(`Hola! Somos 5 o más pasajeros y queremos reservar: ${s.titulo}.`);

  return `
    <div class="reserva__header">
      <div>
        <p class="eyebrow">Reservá tu traslado</p>
        <h2 id="reserva-titulo" class="reserva__titulo">${esc(s.titulo)}</h2>
        ${s.recorrido ? `<p class="reserva__recorrido">${esc(s.recorrido)}</p>` : ''}
      </div>
      <button type="button" class="reserva__cerrar" data-cerrar aria-label="Cerrar">${ICONO_CERRAR}</button>
    </div>

    <form class="reserva__form">
      <div class="reserva__campos">
        ${ids.map(id => campoHTML(id) + (id === 'personas' ? '<p class="reserva__total" aria-live="polite"></p>' : '')).join('')}
        ${s.vianda ? campoHTML('vianda') : ''}
      </div>

      <div class="reserva__grupo" hidden>
        <p class="reserva__grupo-titulo">Para 5 o más pasajeros armamos una propuesta a medida.</p>
        <div class="reserva__grupo-acciones">
          <a href="${grupoMsg}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">Consultanos por WhatsApp</a>
          <a href="sos-tc.html" class="btn btn--secondary">Soy coordinador de grupo</a>
        </div>
      </div>

      <div class="reserva__acciones">
        <button type="submit" class="btn btn--primary reserva__enviar" disabled>Reservar por WhatsApp</button>
        <p class="reserva__pendiente">Completá los campos obligatorios (*) para continuar.</p>
      </div>
    </form>

    <div class="reserva__enviado" hidden>
      <p class="reserva__enviado-titulo" tabindex="-1">¡Listo! Abrimos WhatsApp con tu pedido.</p>
      <p class="reserva__enviado-texto">Envialo desde ahí y te confirmamos la reserva. Si no se abrió, <a class="reserva__enviado-link" target="_blank" rel="noopener noreferrer">tocá acá</a>.</p>
      <button type="button" class="btn btn--secondary" data-cerrar>Cerrar</button>
    </div>`;
}

/* ════════════════════════════════════════
   LÓGICA
════════════════════════════════════════ */

function leer(form) {
  const datos = Object.fromEntries(new FormData(form));
  const vianda = form.querySelector('#reserva-vianda');
  datos.vianda = vianda?.getAttribute('aria-pressed') === 'true';
  return datos;
}

function cotizar(s, personas, vianda) {
  if (!personas || personas === PERSONAS_GRUPO) return null;
  const base = s.precios[personas];
  if (base == null) return { consultar: true };
  const extra = vianda ? PRECIO_VIANDA * Number(personas) : 0;
  return { base, extra, total: base + extra };
}

function textoTotal(cot, personas) {
  if (!cot) return 'Elegí la cantidad de pasajeros para ver el precio.';
  if (cot.consultar) return 'Precio: consultar.';
  if (!cot.extra) return `Total: ${precio(cot.total)}`;
  return `Total: ${precio(cot.total)} (traslado ${precio(cot.base)} + vianda ${personas} × ${precio(PRECIO_VIANDA)})`;
}

function mensaje(s, datos) {
  const lineas = [`Hola! Quiero reservar: ${s.titulo}`];

  ['nombre', ...s.campos].forEach(id => {
    const valor = (datos[id] ?? '').trim();
    if (!valor) return;
    lineas.push(`• ${campos[id].etiqueta}: ${id === 'fecha' ? fechaCorta(valor) : valor}`);
  });

  if (datos.vianda) {
    lineas.push(`• ${campos.vianda.etiqueta}: Sí (${datos.personas} × ${precio(PRECIO_VIANDA)})`);
  }

  const cot = cotizar(s, datos.personas, datos.vianda);
  if (cot && !cot.consultar) lineas.push(`• Precio de referencia: ${precio(cot.total)}`);

  return lineas.join('\n');
}

function actualizar(form) {
  const datos = leer(form);
  const esGrupo = datos.personas === PERSONAS_GRUPO;

  // "5 o más": el formulario común se reemplaza por el aviso de grupos
  form.querySelectorAll('.campo').forEach(campo => {
    campo.hidden = esGrupo && campo.dataset.campo !== 'personas';
  });
  form.querySelector('.reserva__total').hidden = esGrupo;
  form.querySelector('.reserva__grupo').hidden = !esGrupo;
  form.querySelector('.reserva__acciones').hidden = esGrupo;

  form.querySelector('.reserva__total').textContent =
    textoTotal(cotizar(servicio, datos.personas, datos.vianda), datos.personas);

  const listo = !esGrupo && form.checkValidity();
  form.querySelector('.reserva__enviar').disabled = !listo;
  form.querySelector('.reserva__pendiente').hidden = listo;
}

// `origen`: el botón que abrió el modal, para devolverle el foco al cerrar
export function abrirReserva(id, origen = document.activeElement) {
  servicio = servicios.find(s => s.id === id);
  if (!servicio || !dialog) return;

  opener = origen;
  dialog.innerHTML = formHTML(servicio);
  const form = dialog.querySelector('.reserva__form');

  form.addEventListener('input', () => actualizar(form));
  form.addEventListener('change', () => actualizar(form));

  form.querySelector('#reserva-vianda')?.addEventListener('click', e => {
    const btn = e.currentTarget;
    btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
    actualizar(form);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();

    const url = buildWhatsAppLink(mensaje(servicio, leer(form)));
    window.open(url, '_blank', 'noopener');

    const enviado = dialog.querySelector('.reserva__enviado');
    enviado.querySelector('.reserva__enviado-link').href = url;
    form.hidden = true;
    enviado.hidden = false;
    enviado.querySelector('.reserva__enviado-titulo').focus();
  });

  actualizar(form);
  dialog.showModal();
  form.querySelector('input, select')?.focus();
}

export function initReserva() {
  if (!document.querySelector('[data-destacados], [data-destino]')) return;

  dialog = document.createElement('dialog');
  dialog.className = 'reserva';
  dialog.setAttribute('aria-labelledby', 'reserva-titulo');
  document.body.appendChild(dialog);

  // Abrir desde cualquier botón "Reservar ahora" de las cards
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-reservar]');
    if (btn) abrirReserva(btn.dataset.reservar, btn);
  });

  dialog.addEventListener('click', e => {
    // Botones de cerrar, o click en el fondo (fuera de la caja)
    if (e.target.closest('[data-cerrar]') || e.target === dialog) dialog.close();
  });

  // El <dialog> deja la página inerte, pero Tab puede salir a la barra del navegador:
  // lo hacemos circular dentro del modal
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusables = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusables.length) return;
    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  });

  dialog.addEventListener('close', () => {
    dialog.innerHTML = '';
    opener?.focus();
  });
}
