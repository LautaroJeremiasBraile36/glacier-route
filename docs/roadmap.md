# Roadmap — Glacier Route

**Inicio:** 2026-05-02 | **Estado actual:** ✅ PROYECTO COMPLETO — Fases 1–12

---

## Leyenda
- `[ ]` Pendiente
- `[~]` En progreso
- `[x]` Completado

---

## Fase 1 — Fundación ✓

- [x] `css/variables.css` — tokens de diseño (colores, fuentes, espaciado, radios, z-index)
- [x] `css/reset.css` — normalización CSS base
- [x] `index.html` — estructura HTML completa (todas las secciones, meta tags, imports de CSS/JS/Fonts)

---

## Fase 2 — Layout + Navegación ✓

- [x] `css/layout.css` — contenedores, grid global, fondos de sección
- [x] `css/components.css` — barra de nav (desktop + mobile hamburguesa)
- [x] `js/nav.js` — scroll spy, toggle hamburguesa, fondo sólido al scroll

---

## Fase 3 — Hero (`#inicio`) ✓

- [x] `css/hero.css` — layout 100vh, overlay, tipografía, scroll indicator animado
- [x] Hero en `index.html` — video con fallback a imagen, eyebrow, headline, subheadline, CTAs
- [x] Fallback funciona si no hay video

---

## Fase 4 — Nosotros (`#nosotros`) ✓

- [x] Layout dos columnas en `index.html` y `css/layout.css`
- [x] Trust badges — 3 íconos SVG + texto en `css/components.css`

---

## Fase 5 — Servicios El Calafate (`#calafate`) ✓

- [x] `js/whatsapp.js` — módulo completo con todos los mensajes y `getWhatsAppLink()`
- [x] `css/services.css` — cards, pills, card destacada con badge
- [x] Sub-sección 3.1: Traslado aeropuerto (2 cards In/Out)
- [x] Sub-sección 3.2: City Tour (pills Mañana/Tarde + JS toggle)
- [x] Sub-sección 3.3: Glaciar Perito Moreno (3 cards, card estrella destacada)

---

## Fase 6 — Servicios El Chaltén (`#chalten`) ✓

- [x] 3 cards (Solo ida / Chaltén→Aeropuerto / Full Day)
- [x] Cada card enlaza a WhatsApp con mensaje correcto

---

## Fase 7 — Galería (`#galeria`) ✓

- [x] `css/gallery.css` — grid masonry/bento desktop, grid 2col mobile, hover overlay
- [x] `js/gallery.js` — lightbox: apertura, cierre (ESC/click/botón×), navegación ←→, swipe mobile
- [x] 17 imágenes cargadas (9 Chaltén + 8 Glaciar) con `alt` descriptivos

---

## Fase 8 — Contacto y Footer (`#contacto`) ✓

- [x] `css/contact.css` — franja CTA + footer 3 columnas
- [x] Franja CTA glaciar con botones WhatsApp e Instagram
- [x] Footer: logo + tagline, links nav, placeholder QR

---

## Fase 9 — Botones flotantes + Scroll spy WhatsApp ✓

- [x] FABs en `css/components.css` (posición fija, animación entrada 1.5s delay)
- [x] `js/main.js` — inicialización, lógica FAB, delay animación
- [x] Scroll spy WhatsApp: mensaje contextual según sección activa
- [x] Mobile: solo FAB de WhatsApp visible

---

## Fase 10 — Animaciones y pulido final ✓

- [x] IntersectionObserver para fade-in de secciones (`is-visible`)
- [x] `prefers-reduced-motion` aplicado a todas las animaciones
- [x] Focus visible en todos los elementos interactivos
- [x] `alt` y `aria-label` en todas las imágenes e íconos
- [x] Test en mobile (Chrome DevTools - iPhone/Android)
- [x] Sin errores en consola del navegador

---

---

## Fase 12 — Glassmorphism unificado en todas las secciones de servicio ✓

- [x] **#calafate con imagen de fondo**: Foto glaciar (`14.56.51 (2).jpeg`) con overlay oscuro (78→65%)
- [x] **Glassmorphism calafate global**: Todas las cards (transfer, city tour, glaciar), pills, service-block borders y texto en contexto oscuro
- [x] **Cards glaciar simplificadas**: Se removió `card--visual` (imágenes en cards) y el banner → la sección entera provee el contexto visual
- [x] **Flujo visual coherente**: Nosotros (crema) → Calafate (oscuro glaciar) → Chaltén (oscuro montaña) → Galería (negro) → CTA (azul glaciar)
- [x] **Galería**: 12 → 11 imágenes; 1 glaciar cedida al fondo de la sección Calafate
- [x] **Pills glassmorphism**: City Tour pills con estilo translúcido en contexto oscuro

---

## Fase 11 — Visual upgrade & Desktop ✓

- [x] **Imágenes en secciones de conversión**: Banner glaciar (1 foto) + cards con imagen (3 fotos) en sección Glaciar Perito Moreno
- [x] **Sección Chaltén**: Fondo con foto patagónica + overlay oscuro + cards con glassmorphism
- [x] **Galería actualizada**: 17 → 12 imágenes; las 5 usadas en secciones de servicio se retiran de la galería para no repetirlas
- [x] **Logo redondo**: Navbar y footer con `border-radius: 50%` + `object-fit: cover`
- [x] **Glassmorphism navbar**: Estado scrolled con `backdrop-filter: blur(16px)` + fondo rgba semi-opaco
- [x] **Glassmorphism menú mobile**: Dropdown con blur al abrir el hamburguesa
- [x] **Banner glassmorphism**: Label sobre la imagen del Glaciar con blur + borde translúcido
- [x] **Desktop breakpoints**: `1024px` para cards con imágenes más altas, descripciones más anchas, nosotros alineado; `1200px` para títulos de sección más grandes
- [x] **Galería desktop 1200px+**: Imágenes más altas (320px vs 280px)

---

## Pendientes del cliente (bloqueantes para producción)

- [ ] Número de WhatsApp real → reemplazar en `js/whatsapp.js`
- [ ] Handle de Instagram → reemplazar link en footer y FAB
- [ ] Nombre de la empresa → reemplazar `[NOMBRE DE LA EMPRESA]` en todo el sitio
- [ ] Video hero (`assets/hero-video.mp4`)
- [ ] Imagen código QR (`assets/qr-code.png`)

---

## Progreso general

```
Fase 1  ██████████  100%
Fase 2  ██████████  100%
Fase 3  ██████████  100%
Fase 4  ██████████  100%
Fase 5  ██████████  100%
Fase 6  ██████████  100%
Fase 7  ██████████  100%
Fase 8  ██████████  100%
Fase 9  ██████████  100%
Fase 10 ██████████  100%
```
