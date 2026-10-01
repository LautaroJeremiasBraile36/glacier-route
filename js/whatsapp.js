import { WHATSAPP_RESERVAS } from './config.js';

const messages = {
  generic:             'Hola! Quiero reservar un traslado con Glacier Route.',
  aeropuerto_in:       'Hola! Quiero reservar el traslado desde el aeropuerto de El Calafate a mi alojamiento.',
  aeropuerto_out:      'Hola! Quiero reservar el traslado desde mi alojamiento al aeropuerto de El Calafate.',
  glaciar_ida:         'Hola! Quiero reservar el traslado solo ida al Glaciar Perito Moreno.',
  glaciar_puertos:     'Hola! Quiero reservar el traslado a los puertos del Glaciar Perito Moreno.',
  glaciar_completo:    'Hola! Quiero reservar el traslado ida y vuelta con espera en pasarelas al Glaciar Perito Moreno.',
  chalten_ida:         'Hola! Quiero reservar el traslado de El Calafate a El Chaltén (solo ida).',
  chalten_aeropuerto:  'Hola! Quiero reservar el traslado de El Chaltén al aeropuerto de El Calafate.',
  chalten_fullday:     'Hola! Quiero reservar el Chaltén Full Day.',
  calafate_generico:   'Hola! Quiero reservar un traslado en El Calafate.',
  chalten_generico:    'Hola! Quiero reservar un traslado hacia El Chaltén.',
};

export function getWhatsAppLink(key = 'generic') {
  const msg = messages[key] ?? messages.generic;
  return `https://wa.me/${WHATSAPP_RESERVAS}?text=${encodeURIComponent(msg)}`;
}

export function initWhatsApp() {
  // Enchufar todos los botones con data-whatsapp-key
  document.querySelectorAll('.js-whatsapp[data-whatsapp-key]').forEach(el => {
    el.href = getWhatsAppLink(el.dataset.whatsappKey);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}
