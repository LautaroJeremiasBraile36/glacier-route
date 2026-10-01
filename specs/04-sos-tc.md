# 04 · SOS TC: reserva de grupos con gestión de itinerario

## Objetivo

Una página (`sos-tc.html`) para TC (Tour Conductor) y coordinadores de grupos. Ahí completan un formulario con la cantidad de personas, los días, la vianda y los traslados, y arman la agenda día por día con "Gestión de Itinerario". Al terminar, se reserva por WhatsApp.

## Contenido de la página

- Título y bajada: **"Armá tu itinerario a medida, al gusto de tu grupo y con cotización al instante."**
- Bloque corto de beneficios (flexibilidad, puntualidad, vehículos para grupos).
- El formulario de reserva (ver abajo), directamente en la página, no en un modal.

## Formulario

1. **Datos del coordinador:** nombre, agencia u operador (opcional) y teléfono (opcional, porque igual escribe por WhatsApp).
2. **Tamaño del grupo:** selector con las opciones 5, 9, 12, 19 y 24 pasajeros. Son los tamaños de vehículo; el cliente los confirma. El texto de ayuda dice "Elegí el rango que cubra a tu grupo" (por ejemplo, un grupo de 7 elige 9).
3. **Días:** almanaque con fecha de inicio y fecha de fin (dos `<input type="date">`, `min` = hoy, y la fecha de fin tiene que ser mayor o igual a la de inicio). Debajo se muestra "X días".
4. **Vianda:** botón Sí/No, igual al de la spec 03.
5. **Botón "Gestión de Itinerario"** (se habilita cuando hay grupo y fechas).

## Gestión de Itinerario

Al tocar el botón, se despliega un panel debajo (no es otra página):

- Una fila por cada día del rango, con la fecha en formato largo (por ejemplo, "Mié 12/11").
- En cada día: "+ Agregar traslado", que abre un selector con los servicios de `js/data/servicios.js` agrupados por destino, más un campo opcional de hora y de observaciones.
- Se pueden poner varios traslados en un mismo día, y también dejar días sin traslado.
- Cada traslado agregado se puede quitar.
- Si se cambian las fechas, se conservan los traslados de los días que siguen en el rango y se avisa si se pierde alguno.

## Cotización al instante

- Precio por traslado según el tamaño del grupo: agregar a cada servicio de `js/data/servicios.js` el campo `preciosGrupo: { 5: null, 9: null, 12: null, 19: null, 24: null } // TODO cliente`.
- Al pie se muestra un resumen: la cantidad de traslados y el total estimado. Si algún precio es `null`, se muestra "Cotización final por WhatsApp" en lugar de un total parcial engañoso.

## Envío

Botón "Reservar ahora por WhatsApp" (requiere nombre, grupo, fechas y al menos un traslado). Mensaje:

```
Hola! Soy coordinador/a de grupo y quiero reservar un itinerario.
• Nombre: Juan López (Agencia X)
• Grupo: hasta 12 pasajeros
• Fechas: 12/11/2026 al 15/11/2026 (4 días)
• Vianda: Sí

Itinerario:
Mié 12/11
  - Aeropuerto → Hotel (10:30)
Jue 13/11
  - Glaciar: ida, vuelta y pasarelas
Vie 14/11
  - El Calafate → El Chaltén
Sáb 15/11
  - Sin traslados

Total estimado: $ 000.000
```

## Archivos

- `sos-tc.html`, `js/sos-tc.js` (estado del itinerario en memoria), estilos en `css/pages.css`.
- Opcional: guardar el borrador en `localStorage` (envuelto en try/catch) para que no se pierda si se recarga la página.

## Criterios de aceptación

- Un itinerario de 1 a 14 días se arma y se edita sin problemas en mobile a 375 px.
- El mensaje respeta el orden de los días y los traslados de cada día.
- No se puede enviar sin al menos un traslado.
- Sumar un servicio en `servicios.js` lo hace aparecer automáticamente en el selector de itinerario.
