# 03 · Servicios, cards y formulario de reserva (cliente común)

## Objetivo

Cada traslado tiene una card con imagen, detalles y precio por cantidad de personas, y un botón "Reservar ahora" que abre un formulario propio del servicio. Al completarlo, se abre WhatsApp al número de reservas con todo el pedido.

## Datos: `js/data/servicios.js`

Una sola fuente de verdad. Las cards y los formularios se generan desde acá.

```js
export const servicios = [
  {
    id: 'aeropuerto-llegada',
    destino: 'calafate',            // 'calafate' | 'chalten'
    titulo: 'Aeropuerto → Hotel',
    imagen: 'assets/aeropuerto/aeropuerto1.jpg',
    alt: '...',
    detalles: ['Recepción con cartel con tu nombre', '...'],
    destacado: false,               // true = aparece en "Más recomendados" del inicio
    precios: { 1: null, 2: null, 3: null, 4: null }, // TODO cliente: precios en ARS
    vianda: false,                  // true = el formulario muestra el botón de vianda
    campos: ['fecha', 'personas', 'equipaje', 'vuelo', 'hotel'],
  },
  // ...
];
```

Servicios iniciales (tomados del sitio actual; el cliente los confirma):

| id | Título | Destino | campos | vianda | destacado |
|----|--------|---------|--------|--------|-----------|
| `aeropuerto-llegada` | Aeropuerto → Hotel | calafate | fecha, personas, equipaje, vuelo, hotel | no | sí |
| `aeropuerto-salida` | Hotel → Aeropuerto | calafate | fecha, hora, personas, equipaje, vuelo, hotel | no | no |
| `glaciar-ida` | Glaciar Perito Moreno, solo ida | calafate | fecha, hora, personas, hotel | no | no |
| `glaciar-puertos` | Traslado a puertos del glaciar | calafate | fecha, hora, personas, hotel | sí | no |
| `glaciar-completo` | Glaciar: ida, vuelta y pasarelas | calafate | fecha, hora, personas, hotel | sí | sí |
| `chalten-ida` | El Calafate → El Chaltén | chalten | fecha, hora, personas, equipaje, hotel | sí | no |
| `chalten-aeropuerto` | El Chaltén → Aeropuerto | chalten | fecha, hora, personas, equipaje, vuelo, hotel | no | no |
| `chalten-fullday` | Chaltén Full Day | chalten | fecha, personas, hotel | sí | sí |

Qué servicios llevan vianda es una suposición: se confirma con el cliente y se cambia solo en este archivo.

## Catálogo de campos: `js/data/campos.js`

Cada campo se define una sola vez (`id`, `label`, `type`, opciones y si es requerido) y los formularios lo referencian por id:

- `fecha`: `<input type="date">` con `min` = hoy. Requerido.
- `hora`: `<input type="time">`. Opcional.
- `personas`: selector de 1 a 4, más una opción "5 o más". Requerido.
- `equipaje`: cantidad de valijas grandes (número de 0 a 10).
- `vuelo`: número de vuelo (texto, por ejemplo "AR1234"). Opcional.
- `hotel`: hotel u origen/destino (texto). Requerido.
- `vianda`: botón Sí/No (toggle con `aria-pressed`), con el valor por defecto en "No". Ayuda debajo: "Te contamos las opciones por WhatsApp".
- `nombre`: nombre y apellido. Requerido. Va en todos los formularios.

## Card de servicio

- Imagen, título, lista de detalles y tabla de precios: 1, 2, 3 y 4 personas. Debajo, "¿5 o más? Consultanos", que abre WhatsApp con el mensaje genérico de grupos y además enlaza a `sos-tc.html`.
- Si un precio es `null`, se muestra "Consultar" en vez del número.
- Formato del precio: `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`.
- Badge "Más recomendado" si `destacado: true`.
- Botón "Reservar ahora" que abre el formulario.

## Formulario

- Se abre en un modal (`<dialog>` nativo) en mobile y en desktop. Archivo: `js/reserva.js`.
- Se arma con los `campos` del servicio, más `nombre` y `vianda` (si `vianda: true`).
- Si se elige "5 o más" personas, el formulario se reemplaza por un aviso con dos botones: "Consultanos por WhatsApp" y "Soy coordinador de grupo" (va a `sos-tc.html`).
- Debajo del selector de personas se muestra el precio total para esa cantidad (o "Consultar").
- Validación HTML5 nativa. El botón "Reservar por WhatsApp" queda deshabilitado hasta que los campos requeridos estén completos.
- Al enviar, se arma el mensaje y se abre `wa.me/<WHATSAPP_RESERVAS>?text=...` en una pestaña nueva.

Mensaje (solo se incluyen los campos completados):

```
Hola! Quiero reservar: Chaltén Full Day
• Nombre: Ana Pérez
• Fecha: 12/11/2026
• Personas: 3
• Hotel: Hotel X
• Vianda: Sí
• Precio de referencia: $ 000.000
```

## Criterios de aceptación

- Agregar un servicio nuevo requiere tocar solo `js/data/servicios.js`.
- Cada servicio muestra exactamente sus campos, y la vianda aparece solo donde `vianda: true`.
- Con "5 o más" no se puede reservar como cliente común.
- El mensaje de WhatsApp sale bien codificado (con tildes, saltos de línea y "→").
- Se puede usar con teclado: el modal atrapa el foco y se cierra con ESC.
