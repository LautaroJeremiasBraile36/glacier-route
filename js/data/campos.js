// Catálogo de campos de reserva: cada servicio los referencia por id en `campos`.
// `etiqueta` es como aparece el dato en el mensaje de WhatsApp.

export const PERSONAS_GRUPO = '5+';

export const campos = {
  nombre: {
    label: 'Nombre y apellido',
    etiqueta: 'Nombre',
    type: 'text',
    required: true,
    autocomplete: 'name',
  },
  fecha: {
    label: 'Fecha',
    etiqueta: 'Fecha',
    type: 'date',
    required: true,
  },
  hora: {
    label: 'Horario',
    etiqueta: 'Hora',
    type: 'time',
    required: false,
    ayuda: 'El horario en que te buscamos, si ya lo sabés.',
  },
  personas: {
    label: 'Pasajeros',
    etiqueta: 'Personas',
    type: 'select',
    required: true,
    opciones: [
      { value: '1', label: '1 pasajero' },
      { value: '2', label: '2 pasajeros' },
      { value: '3', label: '3 pasajeros' },
      { value: '4', label: '4 pasajeros' },
      { value: PERSONAS_GRUPO, label: '5 o más' },
    ],
  },
  equipaje: {
    label: 'Valijas grandes',
    etiqueta: 'Valijas',
    type: 'number',
    required: false,
    min: 0,
    max: 10,
  },
  vuelo: {
    label: 'Número de vuelo',
    etiqueta: 'Vuelo',
    type: 'text',
    required: false,
    placeholder: 'Ej.: AR1234',
    autocomplete: 'off',
  },
  hotel: {
    label: 'Hotel o alojamiento',
    etiqueta: 'Hotel',
    type: 'text',
    required: true,
  },
  vianda: {
    label: 'Agregar vianda',
    etiqueta: 'Vianda',
    type: 'toggle',
    required: false,
  },
};
