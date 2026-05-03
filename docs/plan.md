# Plan de Implementación — Glacier Route

**Fecha:** 2026-05-02  
**Stack:** HTML5 semántico · CSS3 modular · JS ES Modules · Sin framework · Sin backend

---

## Contexto

Sitio web single-page para empresa de traslados y turismo en El Calafate y El Chaltén, Patagonia argentina. Canal de conversión principal: WhatsApp. La web genera confianza y reduce la fricción para el primer contacto.

### Assets disponibles

| Recurso | Ubicación real |
|---|---|
| Logo | `assets/logo-glacier-route.jpeg` |
| Imágenes El Chaltén (9 fotos) | `assets/chalten/` |
| Imágenes Glaciar Perito Moreno (8 fotos) | `assets/glaciar perito moreno/` |
| Video hero | Pendiente (usar fallback imagen) |

> **Nota sobre rutas:** Los assets están en `assets/` (no en `images/` como especifica el CLAUDE.md). El código referenciará `assets/` directamente.

---

## Estructura de archivos a crear

```
/
├── index.html
├── css/
│   ├── variables.css     ← tokens de diseño (PRIMER PASO)
│   ├── reset.css         ← normalización CSS
│   ├── layout.css        ← grid global, secciones, contenedores
│   ├── hero.css          ← sección #inicio
│   ├── services.css      ← secciones #calafate y #chalten
│   ├── gallery.css       ← sección #galeria
│   ├── contact.css       ← franja CTA + footer #contacto
│   └── components.css    ← nav, botones, cards, badges, floating buttons
├── js/
│   ├── main.js           ← entry point, inicialización
│   ├── nav.js            ← scroll spy, menú hamburguesa
│   ├── gallery.js        ← lightbox
│   └── whatsapp.js       ← construcción de links y mensajes
├── assets/               ← (ya existe, no se toca)
│   ├── chalten/
│   ├── glaciar perito moreno/
│   └── logo-glacier-route.jpeg
├── docs/
│   ├── plan.md           ← este archivo
│   └── roadmap.md        ← checklist de progreso
└── CLAUDE.md
```

---

## Fases de implementación

### Fase 1 — Fundación (tokens + estructura HTML)

**Objetivo:** Tener el HTML completo y los tokens CSS listos. Sin estilos visuales aún.

**Archivos:**
- `css/variables.css` — paleta, tipografía, espaciado, radios, sombras, z-index
- `css/reset.css` — box-sizing, margin/padding reset, base tipográfica
- `index.html` — estructura HTML completa con todas las secciones, meta tags, imports

**Criterio de completitud:** El HTML renderiza en el navegador con estructura legible, sin estilos rotos.

---

### Fase 2 — Layout global + Navegación

**Objetivo:** Barra de navegación funcional, layout base de cada sección.

**Archivos:**
- `css/layout.css` — contenedores, grid system, secciones con fondo alterno
- `css/components.css` (nav) — barra fija, logo, links, hamburguesa mobile
- `js/nav.js` — scroll spy (highlight del link activo), toggle menú hamburguesa, fondo sólido al scroll

**Criterio de completitud:** Nav funciona en mobile y desktop. Scroll suave entre secciones.

---

### Fase 3 — Hero (`#inicio`)

**Objetivo:** Hero de pantalla completa con video/imagen de fondo, overlay y CTA.

**Archivos:**
- `css/hero.css` — layout 100vh, overlay, tipografía hero, scroll indicator
- `index.html` (hero section) — video con fallback, eyebrow, headline, subheadline, CTAs

**Detalles técnicos:**
- Video: `<video autoplay muted loop playsinline aria-hidden="true">` con `<source>` para mp4
- Fallback: background-image en CSS apuntando a primera imagen disponible de Perito Moreno
- Mobile: ocultar video, mostrar imagen estática (media query + `prefers-reduced-data`)
- Scroll indicator: flecha CSS con keyframe `bounce`, se oculta con IntersectionObserver al llegar a `#nosotros`

**Criterio de completitud:** Hero se ve correctamente en mobile y desktop. CTA de WhatsApp enlaza.

---

### Fase 4 — Sección Nosotros (`#nosotros`)

**Objetivo:** Dos columnas con texto + trust badges.

**Archivos:**
- `css/layout.css` (ajustes para columnas)
- `css/components.css` (trust badges)

**Detalles técnicos:**
- Layout: CSS Grid `1fr 1fr` en desktop, stack en mobile
- Trust badges: 3 íconos SVG inline + texto, fila flex centrada
- Fondo: `--color-cream`

---

### Fase 5 — Servicios El Calafate (`#calafate`)

**Objetivo:** 3 sub-secciones con cards de servicios enlazadas a WhatsApp.

**Archivos:**
- `css/services.css` — cards, pills de toggle, card destacada
- `js/whatsapp.js` — módulo completo de mensajes

**Sub-secciones:**
1. **Traslado aeropuerto** — 2 cards lado a lado (In / Out)
2. **City Tour** — descripción + 2 pills (Mañana / Tarde)
3. **Glaciar Perito Moreno** — 3 cards (Solo ida / Puertos / ⭐ Ida+vuelta+pasarelas)

**Detalles técnicos:**
- Card destacada: borde `--color-glacier`, badge "Más elegido"
- Cada CTA construye link via `getWhatsAppLink(key)` de `whatsapp.js`
- Pills de City Tour: estado activo con clase JS, sin lógica de precio

---

### Fase 6 — Servicios El Chaltén (`#chalten`)

**Objetivo:** 3 cards de servicios hacia El Chaltén.

**Archivos:**
- `css/services.css` (extensión)

**3 opciones:** Solo ida · Chaltén → Aeropuerto · Full Day

---

### Fase 7 — Galería (`#galeria`)

**Objetivo:** Grid masonry/bento con lightbox vanilla JS.

**Archivos:**
- `css/gallery.css` — grid responsive, hover overlay
- `js/gallery.js` — lightbox: apertura, cierre (ESC/click/botón), navegación ← →

**Detalles técnicos:**
- Desktop: grid 3 columnas con `grid-column: span 2` en algunas celdas
- Mobile: grid 2 columnas o scroll horizontal
- Lightbox: overlay `position: fixed`, `z-index: 1000`, foco atrapado (a11y)
- Imágenes: todas las de `assets/chalten/` y `assets/glaciar perito moreno/`
- Atributos `alt` descriptivos para cada imagen

---

### Fase 8 — Contacto y Footer (`#contacto`)

**Objetivo:** Franja CTA glaciar + footer 3 columnas.

**Archivos:**
- `css/contact.css` — franja CTA, footer grid, copyright

**Contenido footer:**
- Col 1: Logo + tagline + ciudad
- Col 2: Links de navegación (anchors)
- Col 3: Placeholder para código QR

---

### Fase 9 — Botones flotantes + Scroll spy WhatsApp

**Objetivo:** FABs de WhatsApp e Instagram fijos en esquina inferior derecha.

**Archivos:**
- `css/components.css` (floating buttons)
- `js/main.js` — inicialización general + lógica FAB
- `js/nav.js` — extensión scroll spy para sección activa → mensaje WhatsApp contextual

**Detalles técnicos:**
- Animación entrada: `opacity: 0 → 1` + `translateY(20px → 0)` con 1.5s delay
- Mobile: solo botón WhatsApp visible
- Scroll spy: IntersectionObserver detecta sección activa, actualiza href del FAB

---

### Fase 10 — Animaciones y pulido

**Objetivo:** Fade-in de secciones, hover effects, accesibilidad, SEO final.

**Detalles técnicos:**
- `IntersectionObserver` en todas las secciones: clase `is-visible` dispara `opacity + translateY`
- `prefers-reduced-motion`: deshabilitar todas las animaciones
- Revisión de contraste WCAG AA (≥ 4.5:1)
- Focus visible en todos los interactivos
- Revisión final de `alt`, `aria-label`, roles semánticos

---

## Decisiones técnicas clave

| Decisión | Justificación |
|---|---|
| Sin framework ni bundler | Sitio simple, hosteable en GitHub Pages sin build step |
| ES Modules nativos | Soporte universal en browsers modernos, organización sin complejidad |
| CSS custom properties | Theming centralizado, fácil actualización por el cliente |
| IntersectionObserver | Nativo, sin dependencias, mejor performance que scroll event |
| WhatsApp como único canal de conversión | El cliente no tiene backend, WhatsApp es inmediato y familiar |
| Assets en `assets/` (no `images/`) | Es la estructura real en el proyecto, no modificar archivos del cliente |
| Placeholders para datos del cliente | Número WA, nombre empresa, Instagram — el cliente los completa |

---

## Constantes pendientes de completar por el cliente

```
WHATSAPP_NUMBER = "5491162806101"
INSTAGRAM_URL   = "https://www.instagram.com/traslados.elcalafate?igsh=dmVlcjQ0a2Q4OHNq"
NOMBRE_EMPRESA  = "Glacier Route"
QR_CODE_IMAGE   = "assets/qr-code.png"
VIDEO_HERO      = "assets/hero-video.mp4"
```

---

## Criterios de done del proyecto completo

- [ ] Abre correctamente en Chrome/Safari mobile (iOS) y desktop
- [ ] Todos los botones de WhatsApp generan links con mensajes pre-armados correctos
- [ ] La galería muestra las 17 fotos con lightbox funcional
- [ ] La navegación hace scroll suave entre secciones y marca el link activo
- [ ] El menú hamburguesa funciona en mobile
- [ ] Las animaciones respetan `prefers-reduced-motion`
- [ ] No hay errores en la consola del navegador
- [ ] El código es válido HTML5 (sin obligación de pasar validator, pero sin errores obvios)
