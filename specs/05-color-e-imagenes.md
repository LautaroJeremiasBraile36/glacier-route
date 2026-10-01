# 05 · Identidad de color, hero e imágenes

**Bloqueada hasta que el cliente mande la paleta y las imágenes.** Se puede adelantar el punto 2 con los colores actuales.

## 1. Paleta

- Base azul y blanco. El naranja va solo en acentos: badges "Más recomendado", precio destacado, hover y foco de "Reservar ahora" o el ícono del itinerario. Nunca en fondos grandes.
- Cargar la paleta en `css/variables.css` con nombres por función (`--color-primary`, `--color-primary-dark`, `--color-surface`, `--color-surface-alt`, `--color-accent`, `--color-accent-hover`, `--color-text`, `--color-text-muted`), y mapear los tokens viejos (`--color-glacier`, `--color-terra`, etc.) a los nuevos para no romper nada.
- Contraste mínimo AA (4.5:1 en texto normal), sobre todo con el naranja.

## 2. Base clara

- Hoy casi todas las secciones son oscuras (fotos con overlay, galería negra). Pasar a fondos blancos y celestes claros, y dejar el azul oscuro solo para el nav con scroll, el footer y una franja de CTA.
- Las cards dejan el glassmorphism oscuro y pasan a tarjetas blancas con sombra suave.

## 3. Hero (index)

- Carrusel de 2 o 3 imágenes (fade automático cada 6 s, se pausa con hover o foco, flechas y puntos accesibles, y respeta `prefers-reduced-motion`).
- Cada slide tiene un título y dos frases, y todos comparten un botón directo: "Reservar ahora" (a `servicios.html`) y la pregunta "¿Llegás a El Calafate? Reservá tu traslado desde el aeropuerto" (abre el formulario de `aeropuerto-llegada`).
- El video de 28 MB deja de cargarse en el hero. Como mucho, puede quedar en otra sección con `preload="none"`.
- Imágenes en WebP con fallback JPG, `width` y `height` declarados, y la primera con `fetchpriority="high"`.

## 4. Imágenes y galería

- Imágenes nuevas del cliente (con personas y un estilo uniforme) en `assets/`, con nombres descriptivos en kebab-case.
- Una imagen por card de servicio (`imagen` en `servicios.js`).
- Galería moderna: **carrusel horizontal que se desliza solo** (cinta continua, sin saltos), con proporciones uniformes, bordes redondeados, hover sutil y el lightbox actual al hacer clic. Máximo 12 imágenes, en WebP y con `loading="lazy"`.
  - Se pausa con hover, con foco de teclado y mientras el lightbox está abierto, y deja de animarse fuera de pantalla.
  - Botón visible de pausa/reproducir (`aria-label`, `aria-pressed`): el movimiento automático necesita un control para detenerlo.
  - Con `prefers-reduced-motion: reduce` no se anima: queda como fila con scroll horizontal manual (scroll-snap).
  - Animación solo con `transform` (CSS keyframes o `requestAnimationFrame`), sin librerías. Las imágenes duplicadas para el loop llevan `aria-hidden="true"` y `tabindex="-1"`.

## Criterios de aceptación

- No quedan colores hardcodeados fuera de `variables.css`.
- Lighthouse mobile: Performance ≥ 85 y Accessibility ≥ 95 en `index.html`.
