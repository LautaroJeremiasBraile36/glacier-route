# 01 · Limpieza de contenido y config central

## Objetivo

Dejar el sitio actual (todavía en una sola página) hablando solo de traslados, y centralizar el número de reservas.

## Tareas

1. **Config central.** Crear `js/config.js`:
   ```js
   export const WHATSAPP_RESERVAS = '5491162806101'; // TODO cliente: reemplazar por el número nuevo de reservas
   export const INSTAGRAM_URL = '...'; // tomar el valor actual del footer
   ```
   `js/whatsapp.js` importa el número desde ahí. Los 3 links `https://wa.me/5491162806101...` hardcodeados en `index.html` (hero, franja de contacto y botón flotante) pasan a usar `class="js-whatsapp" data-whatsapp-key="generic"` y se completan por JS, con `href` de respaldo a `wa.me` para cuando no hay JS.
2. **Sacar City Tour completo:** el bloque `#city-tour` de `index.html` (con el itinerario), sus estilos huérfanos en `css/services.css` (`.city-tour-*`, `.pills`, `.pill` si no se usan en otro lado), la lógica de pills en `js/whatsapp.js`, el mensaje `city_tour` y la imagen `assets/itinerarioCityTour/` si queda sin uso.
3. **Sacar "excursiones" y "guía local"** de:
   - `<meta name="description">`, Open Graph, Twitter y el JSON-LD (además, quitar el servicio "City Tour" del JSON-LD).
   - Subtítulo del hero ("Traslados y excursiones…").
   - Texto de Nosotros.
4. **Quiénes somos.** Reemplazar el texto de Nosotros por uno basado en: *agencia de traslados con servicio a medida, personalizado y flexible en El Calafate y El Chaltén. Nuestro compromiso: puntualidad, flexibilidad y las ganas de vivir juntos una experiencia patagónica.*
5. **Botones.** Todos los CTA de servicio pasan a "Reservar ahora" (hoy dicen "Consultar por WhatsApp", "Consultar disponibilidad", "Reservar llegada", etc.).
6. **Mensajes de WhatsApp.** En `js/whatsapp.js`, reescribir los mensajes de "consultar" a "reservar" (ejemplo: "Hola! Quiero reservar el traslado ...").

## Criterios de aceptación

- `grep -rniE "city tour|excursi|guía local|guia local" --include=*.html --include=*.js .` → sin resultados.
- `grep -rn "5491162806101" .` → aparece solo en `js/config.js` (y opcionalmente en los `href` de respaldo).
- No hay CSS ni JS sin uso relacionado con City Tour.
- El sitio se ve igual que antes, salvo los cambios de texto y el bloque City Tour eliminado.
