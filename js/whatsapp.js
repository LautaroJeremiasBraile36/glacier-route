import { WHATSAPP_RESERVAS } from './config.js';

const messages = {
  generic:             'Hola! Quiero reservar un traslado con Glacier Route.',
  calafate_generico:   'Hola! Quiero reservar un traslado en El Calafate.',
  chalten_generico:    'Hola! Quiero reservar un traslado hacia El Chaltén.',
  grupos:              'Hola! Soy coordinador/a de grupo y quiero cotizar traslados para mi grupo.',
};

export function buildWhatsAppLink(text) {
  return `https://wa.me/${WHATSAPP_RESERVAS}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppLink(key = 'generic') {
  return buildWhatsAppLink(messages[key] ?? messages.generic);
}

export function initWhatsApp() {
  // Enchufar todos los botones con data-whatsapp-key
  document.querySelectorAll('.js-whatsapp[data-whatsapp-key]').forEach(el => {
    el.href = getWhatsAppLink(el.dataset.whatsappKey);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}
