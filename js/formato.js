export const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const precio = valor => (valor == null ? 'Consultar' : formatoPrecio.format(valor));

// Para interpolar datos en plantillas HTML
export const esc = str => String(str).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// "2026-11-12" → "12/11/2026"
export const fechaCorta = iso => iso.split('-').reverse().join('/');

// Fecha local de hoy en formato yyyy-mm-dd (para el min de <input type="date">)
export function hoyISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
