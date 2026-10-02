import { servicios, TAMANOS_GRUPO, PRECIO_VIANDA } from './data/servicios.js';
import { buildWhatsAppLink } from './whatsapp.js';
import { esc, precio, fechaCorta, hoyISO } from './formato.js';

const CLAVE_BORRADOR = 'glacier-route:sos-tc';
const MAX_DIAS = 30;
const DESTINOS = { calafate: 'El Calafate', chalten: 'El Chaltén' };

// Estado del itinerario: { 'yyyy-mm-dd': [{ uid, servicioId, hora, obs }] }
let itinerario = {};
let panelAbierto = false;
let diaEditando = null;   // día con el mini formulario "+ Agregar traslado" abierto
let deshacer = null;      // fechas e itinerario previos a un cambio que quitó traslados
let fechasPrevias = { inicio: '', fin: '' };
let contador = 0;

let form;
const $ = id => document.getElementById(id);

/* ════════════════════════════════════════
   FECHAS
════════════════════════════════════════ */

const aUTC = iso => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

function diasEntre(inicio, fin) {
  const dias = [];
  for (let d = aUTC(inicio); d <= aUTC(fin); d.setUTCDate(d.getUTCDate() + 1)) {
    dias.push(d.toISOString().slice(0, 10));
  }
  return dias;
}

const fmtDia = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' });

// "2026-11-12" → "Jue 12/11"
function diaCorto(iso) {
  const p = Object.fromEntries(fmtDia.formatToParts(aUTC(iso)).map(x => [x.type, x.value]));
  const dia = p.weekday.replace('.', '');
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${p.day}/${p.month}`;
}

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

/* ════════════════════════════════════════
   LECTURA DEL FORMULARIO
════════════════════════════════════════ */

function datos() {
  const f = Object.fromEntries(new FormData(form));
  f.vianda = $('tc-vianda').getAttribute('aria-pressed') === 'true';
  return f;
}

// Valida el rango (fin >= inicio, máximo MAX_DIAS) y devuelve los días, o null
function rango() {
  const inicio = $('tc-inicio');
  const fin = $('tc-fin');
  fin.min = inicio.value || hoyISO();

  let mensaje = '';
  if (inicio.value && fin.value && fin.value >= inicio.value
      && diasEntre(inicio.value, fin.value).length > MAX_DIAS) {
    mensaje = `El itinerario puede tener hasta ${MAX_DIAS} días. Para estadías más largas, consultanos.`;
  }
  fin.setCustomValidity(mensaje);

  if (!inicio.checkValidity() || !fin.checkValidity() || !inicio.value || !fin.value) return null;
  return diasEntre(inicio.value, fin.value);
}

// Texto visible para un rango inválido (la validación nativa solo se ve al enviar)
function problemaFechas() {
  const inicio = $('tc-inicio');
  const fin = $('tc-fin');
  if (inicio.value && inicio.validity.rangeUnderflow) return 'La fecha de inicio no puede ser anterior a hoy.';
  if (!inicio.value || !fin.value) return '';
  if (fin.value < inicio.value) return 'La fecha de fin tiene que ser igual o posterior a la de inicio.';
  return fin.validity.customError ? fin.validationMessage : '';
}

const servicioPorId = id => servicios.find(s => s.id === id);

function traslados(dias) {
  return dias.flatMap(dia => (itinerario[dia] ?? []).map(t => ({ ...t, dia })));
}

/* ════════════════════════════════════════
   COTIZACIÓN
════════════════════════════════════════ */

function cotizar(dias, grupo) {
  const lista = traslados(dias);
  const precios = lista.map(t => servicioPorId(t.servicioId)?.preciosGrupo?.[grupo] ?? null);
  const completo = lista.length > 0 && precios.every(p => p != null);
  return {
    cantidad: lista.length,
    total: completo ? precios.reduce((a, b) => a + b, 0) : null,
  };
}

/* ════════════════════════════════════════
   RENDER DEL ITINERARIO
════════════════════════════════════════ */

function opcionesServicios() {
  return Object.entries(DESTINOS).map(([destino, nombre]) => `
    <optgroup label="${esc(nombre)}">
      ${servicios.filter(s => s.destino === destino)
        .map(s => `<option value="${esc(s.id)}">${esc(s.titulo)}</option>`).join('')}
    </optgroup>`).join('');
}

function nuevoTrasladoHTML(dia) {
  const id = `tc-nuevo-${dia}`;
  return `
    <div class="dia__nuevo" data-nuevo="${dia}">
      <div class="campo">
        <label for="${id}-servicio" class="campo__label">Traslado <span class="campo__req" aria-hidden="true">*</span></label>
        <select id="${id}-servicio" data-nuevo-campo="servicio">
          <option value="" disabled selected>Elegí un traslado</option>
          ${opcionesServicios()}
        </select>
      </div>
      <div class="dia__nuevo-grid">
        <div class="campo">
          <label for="${id}-hora" class="campo__label">Horario</label>
          <input id="${id}-hora" type="time" data-nuevo-campo="hora" />
        </div>
        <div class="campo">
          <label for="${id}-obs" class="campo__label">Observaciones</label>
          <input id="${id}-obs" type="text" data-nuevo-campo="obs" placeholder="Ej.: vuelo AR1234" />
        </div>
      </div>
      <p class="dia__nuevo-error campo__ayuda" role="alert"></p>
      <div class="dia__nuevo-acciones">
        <button type="button" class="btn btn--primary" data-confirmar="${dia}">Agregar</button>
        <button type="button" class="btn btn--secondary" data-cancelar="${dia}">Cancelar</button>
      </div>
    </div>`;
}

function diaHTML(dia, n, grupo) {
  const lista = itinerario[dia] ?? [];
  const titulo = diaCorto(dia);

  const items = lista.map(t => {
    const s = servicioPorId(t.servicioId);
    const valor = s?.preciosGrupo?.[grupo];
    const meta = [t.hora, t.obs].filter(Boolean).map(esc).join(' · ');
    return `
      <li class="traslado">
        <div class="traslado__info">
          <span class="traslado__nombre">${esc(s?.titulo ?? t.servicioId)}</span>
          ${meta ? `<span class="traslado__meta">${meta}</span>` : ''}
        </div>
        ${valor != null ? `<span class="traslado__precio">${esc(precio(valor))}</span>` : ''}
        <button type="button" class="traslado__quitar" data-quitar="${t.uid}"
                aria-label="Quitar ${esc(s?.titulo ?? '')} del ${esc(titulo)}">Quitar</button>
      </li>`;
  }).join('');

  return `
    <li class="dia" data-dia="${dia}">
      <div class="dia__header">
        <h4 class="dia__titulo">${esc(titulo)}</h4>
        <span class="dia__num">Día ${n}</span>
      </div>
      ${lista.length ? `<ul class="dia__traslados" role="list">${items}</ul>` : '<p class="dia__vacio">Sin traslados</p>'}
      ${diaEditando === dia
        ? nuevoTrasladoHTML(dia)
        : `<button type="button" class="dia__agregar" data-agregar="${dia}">+ Agregar traslado</button>`}
    </li>`;
}

function renderItinerario(dias, grupo, foco) {
  $('tc-dias-lista').innerHTML = dias.map((dia, i) => diaHTML(dia, i + 1, grupo)).join('');
  if (foco) $('tc-dias-lista').querySelector(foco)?.focus();
}

/* ════════════════════════════════════════
   MENSAJE DE WHATSAPP
════════════════════════════════════════ */

function mensaje(d, dias) {
  const nombre = d.agencia?.trim() ? `${d.nombre.trim()} (${d.agencia.trim()})` : d.nombre.trim();
  const lineas = [
    'Hola! Soy coordinador/a de grupo y quiero reservar un itinerario.',
    `• Nombre: ${nombre}`,
  ];
  if (d.telefono?.trim()) lineas.push(`• Teléfono: ${d.telefono.trim()}`);
  lineas.push(
    `• Grupo: hasta ${d.grupo} pasajeros`,
    `• Fechas: ${fechaCorta(d.inicio)} al ${fechaCorta(d.fin)} (${plural(dias.length, 'día', 'días')})`,
    `• Vianda: ${d.vianda ? 'Sí' : 'No'}`,
    '',
    'Itinerario:',
  );

  dias.forEach(dia => {
    lineas.push(diaCorto(dia));
    const lista = itinerario[dia] ?? [];
    if (!lista.length) lineas.push('  - Sin traslados');
    lista.forEach(t => {
      const extra = [t.hora && `(${t.hora})`, t.obs && `— ${t.obs}`].filter(Boolean).join(' ');
      lineas.push(`  - ${servicioPorId(t.servicioId)?.titulo ?? t.servicioId}${extra ? ` ${extra}` : ''}`);
    });
  });

  const { total } = cotizar(dias, d.grupo);
  lineas.push('', total != null ? `Total estimado: ${precio(total)}` : 'Total estimado: cotización final por WhatsApp');
  return lineas.join('\n');
}

/* ════════════════════════════════════════
   ACTUALIZACIÓN GENERAL
════════════════════════════════════════ */

function avisar(html) {
  $('tc-aviso').innerHTML = html;
  $('tc-aviso').hidden = !html;
}

// Si cambian las fechas, se conservan los traslados de los días que siguen en el rango
function podarItinerario(dias) {
  const fueraDeRango = Object.keys(itinerario).filter(dia => !dias.includes(dia) && itinerario[dia].length);
  if (!fueraDeRango.length) return;

  const perdidos = fueraDeRango.reduce((n, dia) => n + itinerario[dia].length, 0);
  deshacer = { ...fechasPrevias, itinerario: structuredClone(itinerario) };
  fueraDeRango.forEach(dia => delete itinerario[dia]);
  avisar(`Se ${perdidos === 1 ? 'quitó 1 traslado' : `quitaron ${perdidos} traslados`} de días que quedaron fuera de las fechas.
    <button type="button" class="tc__deshacer" data-deshacer>Deshacer</button>`);
}

function actualizar({ foco } = {}) {
  const d = datos();
  const dias = rango();

  if (dias) {
    podarItinerario(dias);
    fechasPrevias = { inicio: d.inicio, fin: d.fin };
  }

  $('tc-dias').textContent = dias ? `${plural(dias.length, 'día', 'días')} de itinerario` : problemaFechas();
  $('tc-dias').classList.toggle('tc__dias--error', !dias && Boolean(problemaFechas()));

  const puedeGestionar = Boolean(dias && d.grupo);
  $('tc-gestion').disabled = !puedeGestionar;
  $('tc-gestion-ayuda').hidden = puedeGestionar;
  $('tc-gestion').setAttribute('aria-expanded', String(puedeGestionar && panelAbierto));
  $('tc-itinerario').hidden = !(puedeGestionar && panelAbierto);
  if (puedeGestionar && panelAbierto) renderItinerario(dias, d.grupo, foco);

  // Resumen y cotización
  const cot = dias ? cotizar(dias, d.grupo) : { cantidad: 0, total: null };
  $('tc-resumen').innerHTML = cot.cantidad
    ? `<span class="tc__resumen-cant">${plural(cot.cantidad, 'traslado', 'traslados')}</span>
       <span class="tc__resumen-total">${cot.total != null
         ? `Total estimado: <strong>${esc(precio(cot.total))}</strong>`
         : 'Cotización final por WhatsApp'}</span>`
    : '';
  $('tc-resumen').hidden = !cot.cantidad;

  // Envío: nombre, grupo, fechas y al menos un traslado
  const faltan = [
    !d.nombre?.trim() && 'tu nombre',
    !d.grupo && 'el tamaño del grupo',
    !dias && 'las fechas',
    dias && !cot.cantidad && 'al menos un traslado',
  ].filter(Boolean);
  $('tc-enviar').disabled = faltan.length > 0;
  $('tc-pendiente').textContent = faltan.length ? `Para reservar falta: ${faltan.join(', ')}.` : '';

  guardar(d);
}

/* ════════════════════════════════════════
   BORRADOR (localStorage, opcional)
════════════════════════════════════════ */

function guardar(d) {
  try {
    localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ ...d, itinerario, panelAbierto, contador }));
  } catch { /* sin almacenamiento: el formulario funciona igual */ }
}

function restaurar() {
  let b;
  try {
    b = JSON.parse(localStorage.getItem(CLAVE_BORRADOR));
  } catch { return; }
  if (!b) return;

  ['nombre', 'agencia', 'telefono', 'grupo', 'inicio', 'fin'].forEach(k => {
    if (b[k] != null && form.elements[k]) form.elements[k].value = b[k];
  });
  $('tc-vianda').setAttribute('aria-pressed', String(Boolean(b.vianda)));
  itinerario = b.itinerario ?? {};
  panelAbierto = Boolean(b.panelAbierto);
  contador = b.contador ?? 0;
  fechasPrevias = { inicio: b.inicio ?? '', fin: b.fin ?? '' };
}

function vaciar() {
  if (!confirm('¿Borrar los datos y el itinerario cargados?')) return;
  try { localStorage.removeItem(CLAVE_BORRADOR); } catch { /* nada que borrar */ }
  form.reset();
  $('tc-vianda').setAttribute('aria-pressed', 'false');
  itinerario = {};
  panelAbierto = false;
  diaEditando = null;
  deshacer = null;
  avisar('');
  $('tc-enviado').hidden = true;
  actualizar();
  $('tc-nombre').focus();
}

/* ════════════════════════════════════════
   EVENTOS
════════════════════════════════════════ */

function confirmarTraslado(dia) {
  const caja = form.querySelector(`[data-nuevo="${dia}"]`);
  const campo = nombre => caja.querySelector(`[data-nuevo-campo="${nombre}"]`);
  const servicioId = campo('servicio').value;

  if (!servicioId) {
    caja.querySelector('.dia__nuevo-error').textContent = 'Elegí un traslado para agregarlo.';
    campo('servicio').focus();
    return;
  }

  (itinerario[dia] ??= []).push({
    uid: ++contador,
    servicioId,
    hora: campo('hora').value,
    obs: campo('obs').value.trim(),
  });
  diaEditando = null;
  actualizar({ foco: `[data-agregar="${dia}"]` });
}

export function initSosTc() {
  form = $('tc-form');
  if (!form) return;

  const grupo = $('tc-grupo');
  grupo.insertAdjacentHTML('beforeend', TAMANOS_GRUPO
    .map(n => `<option value="${n}">Hasta ${n} pasajeros</option>`).join(''));
  form.querySelector('[data-ayuda-vianda]').textContent =
    `${precio(PRECIO_VIANDA)} por persona. Te contamos las opciones por WhatsApp.`;
  $('tc-inicio').min = hoyISO();

  restaurar();

  // Campos principales (los del mini formulario no disparan recálculo)
  ['input', 'change'].forEach(tipo => form.addEventListener(tipo, e => {
    if (e.target.closest('.dia__nuevo')) return;
    actualizar();
  }));

  $('tc-vianda').addEventListener('click', e => {
    const btn = e.currentTarget;
    btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
    actualizar();
  });

  $('tc-gestion').addEventListener('click', () => {
    panelAbierto = !panelAbierto;
    actualizar();
    if (panelAbierto) $('tc-itinerario').querySelector('[data-agregar]')?.focus();
  });

  // Delegación dentro del itinerario
  $('tc-itinerario').addEventListener('click', e => {
    const el = e.target.closest('[data-agregar], [data-confirmar], [data-cancelar], [data-quitar], [data-deshacer]');
    if (!el) return;
    const { agregar, confirmar, cancelar, quitar } = el.dataset;

    if (agregar) {
      diaEditando = agregar;
      actualizar({ foco: `[data-nuevo="${agregar}"] select` });
    } else if (confirmar) {
      confirmarTraslado(confirmar);
    } else if (cancelar) {
      diaEditando = null;
      actualizar({ foco: `[data-agregar="${cancelar}"]` });
    } else if (quitar) {
      const dia = el.closest('[data-dia]').dataset.dia;
      itinerario[dia] = itinerario[dia].filter(t => t.uid !== Number(quitar));
      actualizar({ foco: `[data-dia="${dia}"] [data-agregar]` });
    } else if ('deshacer' in el.dataset && deshacer) {
      $('tc-inicio').value = deshacer.inicio;
      $('tc-fin').value = deshacer.fin;
      itinerario = deshacer.itinerario;
      deshacer = null;
      avisar('');
      actualizar();
    }
  });

  // Enter dentro del mini formulario agrega el traslado (no envía la reserva)
  $('tc-itinerario').addEventListener('keydown', e => {
    const caja = e.target.closest('[data-nuevo]');
    if (e.key === 'Enter' && caja && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      confirmarTraslado(caja.dataset.nuevo);
    }
    if (e.key === 'Escape' && caja) {
      diaEditando = null;
      actualizar({ foco: `[data-agregar="${caja.dataset.nuevo}"]` });
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const dias = rango();
    if (!form.checkValidity() || !dias || $('tc-enviar').disabled) return form.reportValidity();

    const url = buildWhatsAppLink(mensaje(datos(), dias));
    window.open(url, '_blank', 'noopener');
    $('tc-enviado-link').href = url;
    $('tc-enviado').hidden = false;
  });

  $('tc-vaciar').addEventListener('click', vaciar);

  avisar('');
  actualizar();
}
