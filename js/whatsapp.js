const WHATSAPP_NUMBER = '5491162806101';

const messages = {
  generic:             'Hola! Quiero consultar sobre sus servicios en la Patagonia.',
  aeropuerto_in:       'Hola! Quiero consultar sobre el traslado desde el aeropuerto de El Calafate.',
  aeropuerto_out:      'Hola! Quiero consultar sobre el traslado al aeropuerto de El Calafate.',
  city_tour:           'Hola! Me interesa el City Tour de El Calafate. ¿Podría consultarte disponibilidad?',
  glaciar_ida:         'Hola! Quiero consultar el traslado solo ida al Glaciar Perito Moreno.',
  glaciar_puertos:     'Hola! Quiero consultar el traslado a los puertos del Glaciar Perito Moreno.',
  glaciar_completo:    'Hola! Quiero consultar el traslado ida y vuelta con espera en pasarelas al Glaciar Perito Moreno.',
  chalten_ida:         'Hola! Quiero consultar el traslado de El Calafate a El Chaltén (solo ida).',
  chalten_aeropuerto:  'Hola! Quiero consultar el traslado de El Chaltén al aeropuerto de Calafate.',
  chalten_fullday:     'Hola! Quiero consultar el Chaltén Full Day. ¿Podés darme más información?',
  calafate_generico:   'Hola! Quiero consultar sobre los servicios en El Calafate.',
  chalten_generico:    'Hola! Quiero consultar sobre los servicios hacia El Chaltén.',
};

export function getWhatsAppLink(key = 'generic') {
  const msg = messages[key] ?? messages.generic;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function initWhatsApp() {
  // Enchufar todos los botones con data-whatsapp-key
  document.querySelectorAll('.js-whatsapp[data-whatsapp-key]').forEach(el => {
    el.href = getWhatsAppLink(el.dataset.whatsappKey);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // Toggle de pills (City Tour)
  document.querySelectorAll('.pills').forEach(group => {
    const pills = group.querySelectorAll('.pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => {
          p.classList.remove('pill--active');
          p.setAttribute('aria-pressed', 'false');
        });
        pill.classList.add('pill--active');
        pill.setAttribute('aria-pressed', 'true');
      });
    });
  });
}
