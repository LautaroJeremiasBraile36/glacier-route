# 03 · Servicios, cards y formulario de reserva (cliente común)

## Objetivo

Cada traslado tiene una card con imagen, detalles y precio por cantidad de personas, y un botón "Reservar ahora" que abre un formulario propio del servicio. Al completarlo, se abre WhatsApp al número de reservas con todo el pedido.

## Datos: `js/data/servicios.js`

Una sola fuente de verdad. Las cards y los formularios se generan desde acá.

```js
export const PRECIO_VIANDA = 27500; // ARS por persona

export const servicios = [
  {
    id: 'aeropuerto-in',
    destino: 'calafate',            // 'calafate' | 'chalten'
    titulo: 'Aeropuerto IN',
    recorrido: '18 km · 30 min',    // opcional: distancia y duración
    imagen: 'assets/servicios/aeropuerto-in.webp',
    alt: '...',
    detalles: [
      'Traslado puntual hacia la ciudad de El Calafate',
      'Te buscamos con tu nombre y cantidad de pasajeros',
      'Baúl amplio para tus valijas',
      'Te llevamos a tu hotel o alojamiento',
    ],
    nota: null,                     // opcional: aclaración visible en la card
    destacado: true,                // true = aparece en "Más recomendados" del inicio
    precios: { 1: 36000, 2: 40000, 3: 43000, 4: 47000 }, // ARS, precio total del traslado
    vianda: false,                  // true = el formulario muestra el botón de vianda
    campos: ['fecha', 'personas', 'equipaje', 'vuelo', 'hotel'],
  },
  // ...
];
```

### Servicios

Fuente: `assets/Copys de Traslados.md` (copys y precios del cliente, octubre 2026). Cada servicio tiene una imagen cuyo nombre empieza igual que el título del copy, en `assets/imagenes-mantenimiento-2026-10-01/`. Los `detalles` se toman de los ítems de cada copy, corrigiendo ortografía y abreviaturas ("aloj." → "alojamiento", "pax" → "pasajeros").

| # | id | Título | Destino | Recorrido | Precios x1 / x2 / x3 / x4 | Vianda | Destacado | campos |
|---|----|--------|---------|-----------|----------------------------|--------|-----------|--------|
| 1 | `punta-walichu` | Traslado a Punta Walichu | calafate | 8 km · 25 min | 48.000 / 57.000 / 66.000 / 80.000 | no | no | fecha, hora, personas, hotel |
| 2 | `estacion-bus` | Traslado a la Estación de Bus | calafate | — | 12.000 / 14.000 / 16.000 / 18.000 | no | no | fecha, hora, personas, equipaje, hotel |
| 3 | `aeropuerto-in` | Aeropuerto IN | calafate | 18 km · 30 min | 36.000 / 40.000 / 43.000 / 47.000 | no | sí | fecha, personas, equipaje, vuelo, hotel |
| 4 | `aeropuerto-out` | Aeropuerto OUT | calafate | 18 km · 30 min | 34.000 / 38.000 / 42.000 / 45.000 | no | no | fecha, hora, personas, equipaje, vuelo, hotel |
| 5 | `glaciar-pasarelas` | Traslado a Pasarelas Glaciar Perito Moreno | calafate | 80 km · 1 h 30 min | 148.000 / 165.000 / 179.000 / 192.000 | sí | sí | fecha, hora, personas, hotel |
| 6 | `puerto-punta-bandera` | Traslado a Puerto Punta Bandera | calafate | 47 km · 1 h | 125.000 / 136.000 / 150.000 / 163.000 | sí | no | fecha, hora, personas, hotel |
| 7 | `glaciar-pasarelas-navegacion` | Pasarelas + Navegación 1 h | calafate | — | 202.000 / 274.000 / 376.000 / 456.000 | sí | no | fecha, personas, hotel |
| 8 | `chalten-traslado` | Traslado hasta El Chaltén | chalten | 215 km · 2 h 40 min | 180.000 / 200.000 / 220.000 / 240.000 | no | no | fecha, hora, personas, equipaje, hotel |
| 9 | `chalten-full-day` | El Chaltén Full Day | chalten | 215 km · 3 h | 270.000 / 290.000 / 310.000 / 325.000 | sí | sí | fecha, personas, hotel |
| 10 | `chalten-rio-electrico` | El Chaltén + Río Eléctrico | chalten | 231 km · 3 h 10 min | 295.000 / 330.000 / 355.000 / 380.000 | sí | no | fecha, personas, hotel |
| 11 | `chalten-laguna-de-los-tres` | El Chaltén Laguna de los Tres | chalten | 215 km · 2 h 40 min | 310.000 / 340.000 / 365.000 / 390.000 | sí | no | fecha, personas, hotel |
| 12 | `chalten-cerro-torre` | El Chaltén Cerro Torre | chalten | 215 km · 2 h 40 min | 300.000 / 325.000 / 345.000 / 365.000 | sí | no | fecha, personas, hotel |

- `punta-walichu` lleva `nota: 'Entrada no incluida, solo traslado.'`
- Vianda: los servicios con "Si incluye vianda $27.500" en el copy tienen `vianda: true`. El precio es por persona y es igual para todos (`PRECIO_VIANDA`).
- Los `campos` y los `destacado` son una propuesta (el copy no los define): se cambian solo en este archivo.
- Ya no se ofrecen "Glaciar solo ida" ni "El Chaltén → Aeropuerto" del sitio anterior: no están en la lista del cliente.

### Imágenes

Una por servicio, nombrada con el `id`: `assets/servicios/<id>.webp` (con fallback JPG si hace falta). Origen en `assets/imagenes-mantenimiento-2026-10-01/`:

| id | Archivo original |
|----|------------------|
| `punta-walichu` | `Traslado a Punta Walichu (8km - 25 minutos).jpeg` |
| `estacion-bus` | `Traslado a ESTACIÓN DE BUS.jpeg` |
| `aeropuerto-in` | `Aeropuerto IN (18km 30 min.).jpeg` |
| `aeropuerto-out` | `Aeropuerto OUT (18km 30minutos).jpeg` |
| `glaciar-pasarelas` | `Traslado a Pasarelas Glaciar Perito Moreno (80km - 1h 30min.).jpeg` |
| `puerto-punta-bandera` | `Traslado a puerto punta bandera (47 km - 1h).jpeg` |
| `glaciar-pasarelas-navegacion` | `Pasarelas + Navegación 1h.jpeg` |
| `chalten-traslado` | `Traslado hasta El Chaltén (215km - 2h 40 min).jpeg` |
| `chalten-full-day` | `El Chaltén full day (215 km - 3h).jpeg` |
| `chalten-rio-electrico` | `El chalten + Rio eléctrico  (231km - 3h 10min).jpeg` |
| `chalten-laguna-de-los-tres` | `El Chaltén Laguna de los 3 (215km - 2h 40min).jpeg` |
| `chalten-cerro-torre` | `El Chaltén Cerro Torre (215km - 2h 40min).jpeg` |

## Catálogo de campos: `js/data/campos.js`

Cada campo se define una sola vez (`id`, `label`, `type`, opciones y si es requerido) y los formularios lo referencian por id:

- `fecha`: `<input type="date">` con `min` = hoy. Requerido.
- `hora`: `<input type="time">`. Opcional.
- `personas`: selector de 1 a 4, más una opción "5 o más". Requerido.
- `equipaje`: cantidad de valijas grandes (número de 0 a 10).
- `vuelo`: número de vuelo (texto, por ejemplo "AR1234"). Opcional.
- `hotel`: hotel u origen/destino (texto). Requerido.
- `vianda`: botón Sí/No (toggle con `aria-pressed`), con el valor por defecto en "No". Ayuda debajo: "$ 27.500 por persona. Te contamos las opciones por WhatsApp" (el monto sale de `PRECIO_VIANDA`).
- `nombre`: nombre y apellido. Requerido. Va en todos los formularios.

## Card de servicio

- Imagen, título, recorrido (si hay), lista de detalles, nota (si hay) y tabla de precios: 1, 2, 3 y 4 personas. Si el servicio tiene vianda, debajo de la tabla: "Vianda opcional: $ 27.500 por persona". Debajo, "¿5 o más? Consultanos", que abre WhatsApp con el mensaje genérico de grupos y además enlaza a `sos-tc.html`.
- Si un precio es `null`, se muestra "Consultar" en vez del número.
- Formato del precio: `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`.
- Badge "Más recomendado" si `destacado: true`.
- Botón "Reservar ahora" que abre el formulario.

## Formulario

- Se abre en un modal (`<dialog>` nativo) en mobile y en desktop. Archivo: `js/reserva.js`.
- Se arma con los `campos` del servicio, más `nombre` y `vianda` (si `vianda: true`).
- Si se elige "5 o más" personas, el formulario se reemplaza por un aviso con dos botones: "Consultanos por WhatsApp" y "Soy coordinador de grupo" (va a `sos-tc.html`).
- Debajo del selector de personas se muestra el precio total para esa cantidad (o "Consultar"). Si la vianda está en "Sí", el total suma `PRECIO_VIANDA × personas` y lo muestra desglosado.
- Validación HTML5 nativa. El botón "Reservar por WhatsApp" queda deshabilitado hasta que los campos requeridos estén completos.
- Al enviar, se arma el mensaje y se abre `wa.me/<WHATSAPP_RESERVAS>?text=...` en una pestaña nueva.

Mensaje (solo se incluyen los campos completados):

```
Hola! Quiero reservar: El Chaltén Full Day
• Nombre: Ana Pérez
• Fecha: 12/11/2026
• Personas: 3
• Hotel: Hotel X
• Vianda: Sí (3 × $ 27.500)
• Precio de referencia: $ 392.500
```

(310.000 del traslado para 3 personas + 82.500 de vianda.)

## Criterios de aceptación

- Agregar un servicio nuevo requiere tocar solo `js/data/servicios.js`.
- Cada servicio muestra exactamente sus campos, y la vianda aparece solo donde `vianda: true`.
- Con "5 o más" no se puede reservar como cliente común.
- El mensaje de WhatsApp sale bien codificado (con tildes, saltos de línea y "→").
- Se puede usar con teclado: el modal atrapa el foco y se cierra con ESC.
