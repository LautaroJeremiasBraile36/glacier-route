# 00 · Contexto y convenciones

## El negocio

Glacier Route es una agencia de **traslados** en El Calafate y El Chaltén. La web genera mucha demanda y toda la conversión va por WhatsApp. Palabras clave para textos y SEO: traslados, El Calafate, El Chaltén.

Dos públicos:
- **Cliente común** (1 a 4 personas): elige un traslado, ve el precio según cantidad de personas, completa un formulario corto y reserva por WhatsApp. De 5 personas en adelante, "Consultanos".
- **TC / Tour Conductor / coordinador de grupos** (5+ personas): arma un itinerario de varios días con varios traslados y reserva por WhatsApp.

## Stack (no cambiar)

- HTML5 semántico, CSS modular con custom properties, JavaScript ES Modules (`type="module"`).
- Sin frameworks, sin bundler, sin dependencias npm, sin backend.
- Mobile first. La mayoría del tráfico es mobile.
- Probar localmente con `python3 -m http.server 8000` desde la raíz del repo y abrir `http://localhost:8000` (en WSL se abre igual desde el navegador de Windows). Los ES Modules no funcionan abriendo el HTML con doble clic.

## Convenciones

- Textos en español rioplatense ("reservá", "consultanos"), tono cercano y profesional.
- Colores, tipografías y espaciados solo mediante tokens de `css/variables.css`. Nada de colores hardcodeados en otros CSS.
- Datos de negocio (número de WhatsApp, servicios, precios, campos de formulario) viven en JS de datos (`js/config.js`, `js/data/*.js`), nunca repetidos en el HTML.
- Los valores que todavía no tenemos van como `null` o con el comentario `// TODO cliente:` para encontrarlos con `grep -rn "TODO cliente"`.
- Botón principal de reserva: siempre con el texto **"Reservar ahora"**.
- Accesibilidad: labels en todos los campos, `aria-*` en toggles, foco visible, `prefers-reduced-motion` respetado (ya existe en el CSS actual).
- Commits chicos en español, una rama por spec, PR a `main`.

## Verificación mínima antes de cada commit

1. Sin errores en la consola del navegador en todas las páginas.
2. Probado a 375 px y a 1280 px de ancho.
3. Todos los links internos funcionan, y los botones de WhatsApp abren `wa.me` con el mensaje esperado.
4. `grep -rniE "city tour|excursi|guía local" --include=*.html --include=*.js .` no devuelve nada.
