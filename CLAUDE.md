# Guía de Proyecto: Glacier Route - Turismo & Traslados Patagonia

## Resumen ejecutivo

Sitio web **single page** para empresa de traslados y turismo con base en El Calafate y El Chaltén. Orientado a viajeros que buscan servicios confiables en la Patagonia argentina. El canal de conversión principal es WhatsApp; la web es la vitrina que genera confianza y reduce la fricción para el primer contacto.

---

## Stack técnico

- **HTML5** semántico (sin frameworks)
- **CSS3 modular** con custom properties (`/css/variables.css`, `/css/reset.css`, `/css/components.css`, etc.)
- **JavaScript ES Modules** (`type="module"`) — sin bundler, sin dependencias externas
- **Sin backend** — sitio 100% estático, hosteable en GitHub Pages, Netlify o similar
- **Mobile first** — la mayoría de consultas vienen de móvil

---

## Estructura de archivos

```
/
├── index.html
├── css/
│   ├── variables.css       ← tokens de diseño (colores, fuentes, espaciado)
│   ├── reset.css
│   ├── layout.css          ← grid, secciones, contenedores
│   ├── hero.css
│   ├── services.css
│   ├── gallery.css
│   ├── contact.css
│   └── components.css      ← botones, tarjetas, nav, footer
├── js/
│   ├── main.js             ← entry point, inicialización
│   ├── nav.js              ← scroll spy, menú hamburguesa mobile
│   ├── gallery.js          ← lightbox simple para galería
│   └── whatsapp.js         ← construcción de mensajes pre-armados por servicio
├── assets/
│   ├── chalten/            ← imágenes del Chaltén (provistas por el cliente)
│   ├── perito-moreno/      ← imágenes del Glaciar (provistas por el cliente)
│   └── logo/               ← logo de la empresa
└── video/
    └── hero-video.mp4      ← video principal (provisto por el cliente, o placeholder)
```

---

## Identidad visual

### Paleta de colores

```css
:root {
  /* Primarios */
  --color-stone: #1c1c1a; /* Negro patagónico — textos principales */
  --color-glacier: #2a6b8a; /* Azul glaciar — acento primario */
  --color-sky: #e8f4f8; /* Celeste cielo — fondos claros */
  --color-terra: #8b5e3c; /* Tierra/roca — acento cálido */
  --color-cream: #f5f0e8; /* Crema — fondo secciones alternas */

  /* Funcionales */
  --color-text: #1c1c1a;
  --color-text-muted: #6b6b65;
  --color-surface: #ffffff;
  --color-cta: #2a6b8a; /* Botón principal */
  --color-cta-hover: #1e5272;
  --color-whatsapp: #25d366;

  /* Tipografía */
  --font-display: "Playfair Display", Georgia, serif; /* Títulos */
  --font-body: "DM Sans", -apple-system, sans-serif; /* Cuerpo */

  /* Espaciado base */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 8rem;

  /* Bordes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

### Tipografía

Importar desde Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

- `Playfair Display` — títulos de sección (H1, H2), citas, nombres de servicios
- `DM Sans` — cuerpo de texto, CTAs, microcopy, navegación

---

## Arquitectura de la página (secciones y anchors)

```
#inicio     → Hero con video
#nosotros   → Quiénes somos + Qué hacemos
#calafate   → Servicios El Calafate
#chalten    → Servicios El Chaltén
#galeria    → Galería de fotos
#contacto   → Footer + contacto
```

### Navegación

Barra fija en desktop. Menú hamburguesa en mobile. Logo a la izquierda. Links de ancla a la derecha. Fondo transparente que se vuelve sólido al hacer scroll. Scroll suave (`scroll-behavior: smooth`).

---

## Sección 1: Hero (`#inicio`)

### Comportamiento

- Video de fondo a pantalla completa (100vh). Autoplay, muted, loop, playsinline.
- Overlay oscuro semitransparente (rgba 0,0,0 entre 0.35 y 0.50) para legibilidad del texto.
- Si el video no carga → fallback a imagen estática (`images/perito-moreno/hero-fallback.jpg`).
- En mobile: pausar el video para ahorrar datos (detectar con `prefers-reduced-data` o viewport < 768px) y usar imagen estática.

### Contenido del hero

```
[Eyebrow — DM Sans 500, tracking amplio, mayúsculas, color glacier]
EL CALAFATE · EL CHALTÉN

[Headline — Playfair Display 700, blanco, 3.5–5rem responsive]
Tu anfitrión en la Patagonia

[Subheadline — DM Sans 300, blanco 85%, max-width 520px]
Traslados y excursiones diseñados a tu medida.
Llegás, disfrutás — nosotros nos encargamos del resto.

[CTA principal — botón verde WhatsApp]
[ 󰖣 Consultar por WhatsApp ]

[CTA secundario — link outline blanco]
  Ver servicios ↓
```

### Scroll indicator

Flecha animada (CSS keyframes bounce) que desaparece al hacer scroll.

---

## Sección 2: Nosotros (`#nosotros`)

Fondo: `--color-cream`. Dos columnas en desktop, apiladas en mobile.

### Columna izquierda: "Quiénes somos"

**Eyebrow:** `Nuestra historia`
**Título:** `Tu anfitrión en la Patagonia` (Playfair Display, italic)
**Texto:**

> No solo somos una empresa de transporte; somos especialistas locales apasionados por nuestra tierra. Con base en El Calafate y El Chaltén, combinamos años de experiencia en el terreno con una organización meticulosa para que tu única preocupación sea disfrutar del paisaje. Conocemos cada rincón del camino y estamos aquí para asegurarnos de que tu llegada y estadía sean perfectas.

### Columna derecha: "Qué hacemos"

**Eyebrow:** `Nuestros servicios`
**Título:** `Conectando destinos, creando experiencias`
**Texto:**

> Facilitamos tu viaje por la Patagonia a través de un servicio de traslados diseñado a tu medida. Desde la recepción personalizada en el aeropuerto hasta las excursiones más emblemáticas en los glaciares y senderos de montaña, gestionamos cada trayecto con puntualidad y profesionalismo. Somos el nexo confiable entre vos y las maravillas de El Calafate y El Chaltén.

### Íconos de confianza (trust badges)

Fila de 3 íconos SVG inline con texto corto, debajo del texto principal:

| Ícono              | Texto                     |
| ------------------ | ------------------------- |
| Mapa / pin         | Base local en El Calafate |
| Reloj              | Puntualidad garantizada   |
| Persona con cartel | Recepción personalizada   |

---

## Sección 3: Servicios El Calafate (`#calafate`)

Fondo: blanco. Título de sección: `Servicios en El Calafate`.

### Sub-sección 3.1 — Traslado Aeropuerto

**Nombre:** Traslados al aeropuerto
**Descripción:**

> Terminá tu viaje sin estrés. Te buscamos puntualmente en tu hotel o te recibimos en el aeropuerto con cartel identificatorio. El primer y último contacto de tu estadía, en manos confiables.

**Dos tarjetas (cards) lado a lado:**

| Aeropuerto → Ciudad (In)           | Ciudad → Aeropuerto (Out)       |
| ---------------------------------- | ------------------------------- |
| Recepción con cartel con tu nombre | Búsqueda puntual en tu hotel    |
| Traslado directo a tu alojamiento  | Traslado a tiempo a la terminal |

**CTA:** `Reservar traslado`
→ WhatsApp con mensaje pre-armado: `"Hola! Quiero consultar sobre traslados al aeropuerto de El Calafate."`

---

### Sub-sección 3.2 — City Tour El Calafate

**Nombre:** City Tour — El corazón de Calafate
**Descripción:**

> Descubrí los rincones más icónicos de El Calafate con un guía local que conoce cada historia. Un recorrido por los puntos panorámicos e históricos de la ciudad, en el turno que mejor se adapte a tu itinerario.

**Dos opciones visibles como toggles o pills:**

- `Turno Mañana`
- `Turno Tarde`

**CTA:** `Elegir mi turno`
→ WhatsApp con mensaje: `"Hola! Me interesa el City Tour de El Calafate. ¿Podría consultarte disponibilidad?"`

---

### Sub-sección 3.3 — Glaciar Perito Moreno

**Nombre:** Glaciar Perito Moreno
**Descripción:**

> Una de las maravillas naturales más imponentes del planeta, a pocos kilómetros de El Calafate. Elegí el servicio que se adapta a tu plan.

**Tres opciones como tarjetas (cards) en fila:**

| Solo ida                            | Traslado a puertos                          | ⭐ Ida, vuelta y pasarelas                                           |
| ----------------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| Conexión directa al Parque Nacional | Especial para quienes realizan navegaciones | Nuestro servicio estrella                                            |
| —                                   | —                                           | Tiempo libre de espera para recorrer las pasarelas a tu propio ritmo |

**Nota de diseño:** La tarjeta "Ida, vuelta y pasarelas" debe destacar visualmente (borde de color glaciar, badge "Más elegido" o similar).

**CTA de cada tarjeta:** `Consultar por WhatsApp`
→ Mensaje diferente por opción:

- Solo ida: `"Hola! Quiero consultar el traslado solo ida al Glaciar Perito Moreno."`
- Puertos: `"Hola! Quiero consultar el traslado a los puertos del Glaciar Perito Moreno."`
- Ida y vuelta: `"Hola! Quiero consultar el traslado ida y vuelta con espera en pasarelas al Glaciar Perito Moreno."`

---

## Sección 4: Servicios El Chaltén (`#chalten`)

Fondo: `--color-cream`. Título: `Servicios hacia El Chaltén`.

Subtítulo eyebrow: `Capital Nacional del Trekking`

**Tres opciones:**

| Solo ida                           | Chaltén → Aeropuerto                  | Chaltén Full Day                                                             |
| ---------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| Traslado directo desde El Calafate | Regreso eficiente hacia el aeropuerto | Experiencia de día completo                                                  |
| —                                  | —                                     | Ideal para quienes quieren conocer los hitos principales con tiempo limitado |

**CTA:** `Consultar disponibilidad`
→ Mensajes WhatsApp diferenciados por opción:

- Solo ida: `"Hola! Quiero consultar el traslado de El Calafate a El Chaltén (solo ida)."`
- Chaltén → Aeropuerto: `"Hola! Quiero consultar el traslado de El Chaltén al aeropuerto de Calafate."`
- Full Day: `"Hola! Quiero consultar el Chaltén Full Day. ¿Podés darme más información?"`

---

## Sección 5: Galería (`#galeria`)

Fondo: negro (`--color-stone`) para que las imágenes resalten.
Título en blanco: `Viví la experiencia`

### Layout

Grid responsive de imágenes:

- Desktop: grid de 3 columnas con algunas celdas que ocupan 2 columnas (efecto masonry o bento grid)
- Mobile: scroll horizontal (swiper) o grid de 2 columnas

### Fuentes de imágenes

Usar imágenes de las carpetas:

- `images/chalten/` — paisajes de El Chaltén, trekking, montaña
- `images/perito-moreno/` — glaciar, pasarelas, navegaciones

### Lightbox

Al hacer click en imagen → overlay a pantalla completa con la imagen ampliada. Cerrar con click fuera, tecla ESC, o botón ×. Navegación con flechas ← →.

### Imágenes clave a incluir (si están disponibles)

1. Foto del vehículo/flota con paisaje patagónico de fondo
2. Chofer con cartel de bienvenida en el aeropuerto
3. Glaciar Perito Moreno (panorámica)
4. Pasarelas del glaciar
5. Cerro Torre o Fitz Roy (El Chaltén)
6. Grupo de viajeros en excursión

---

## Sección 6: Contacto y Footer (`#contacto`)

### Franja de CTA antes del footer

Fondo: `--color-glacier`. Texto en blanco.

```
¿Listo para vivir la Patagonia?
Escribinos y armamos tu traslado a medida.

[ 󰖣 Escribir por WhatsApp ]   [ Ver en Instagram ]
```

### Footer

Tres columnas en desktop, apiladas en mobile:

**Col 1:** Logo + tagline corta + ciudad
**Col 2:** Links de navegación rápida (anchors)
**Col 3:** Código QR (imagen) con texto "Escaneame para agendar"

Línea inferior: copyright + "Hecho con amor en la Patagonia"

---

## Botones flotantes (sticky)

Presentes en toda la página, fijos en la esquina inferior derecha:

1. **WhatsApp** (verde, ícono) — siempre visible
2. **Instagram** (degradado, ícono) — visible debajo del WhatsApp

Animación de entrada: aparecen con fade-in + slide-up 1.5s después de cargar la página. En mobile, solo el botón de WhatsApp para no recargar visualmente.

Comportamiento del botón WhatsApp por sección activa (scroll spy):

- En `#calafate` → mensaje genérico sobre Calafate
- En `#chalten` → mensaje genérico sobre Chaltén
- En otras → mensaje genérico de contacto

---

## Módulo WhatsApp (`js/whatsapp.js`)

```js
// Número de WhatsApp (formato internacional sin + ni espacios)
const WHATSAPP_NUMBER = "549XXXXXXXXXX"; // ← REEMPLAZAR con el número real

const messages = {
  generic:
    "Hola! Quiero consultar sobre sus servicios en la Patagonia.",
  aeropuerto_in:
    "Hola! Quiero consultar sobre el traslado desde el aeropuerto de El Calafate.",
  aeropuerto_out:
    "Hola! Quiero consultar sobre el traslado al aeropuerto de El Calafate.",
  city_tour:
    "Hola! Me interesa el City Tour de El Calafate. ¿Podría consultarte disponibilidad?",
  glaciar_ida:
    "Hola! Quiero consultar el traslado solo ida al Glaciar Perito Moreno.",
  glaciar_puertos:
    "Hola! Quiero consultar el traslado a los puertos del Glaciar Perito Moreno.",
  glaciar_completo:
    "Hola! Quiero consultar el traslado ida y vuelta con espera en pasarelas al Glaciar Perito Moreno.",
  chalten_ida:
    "Hola! Quiero consultar el traslado de El Calafate a El Chaltén (solo ida).",
  chalten_aeropuerto:
    "Hola! Quiero consultar el traslado de El Chaltén al aeropuerto de Calafate.",
  chalten_fullday:
    "Hola! Quiero consultar el Chaltén Full Day. ¿Podés darme más información?",
};

export function getWhatsAppLink(key = "generic") {
  const msg = messages[key] ?? messages.generic;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
```

---

## Accesibilidad y SEO básico

### Meta tags (en `<head>`)

```html
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>
<title>Traslados Patagonia | El Calafate y El Chaltén</title>
<meta
  name="description"
  content="Traslados y excursiones en El Calafate y El Chaltén. Aeropuerto, City Tour, Glaciar Perito Moreno y Chaltén Full Day. Reservas por WhatsApp."
/>
<meta name="theme-color" content="#2A6B8A" />

<!-- Open Graph (para compartir en redes) -->
<meta
  property="og:title"
  content="Traslados Patagonia | El Calafate y El Chaltén"
/>
<meta
  property="og:description"
  content="Tu anfitrión en la Patagonia. Traslados y excursiones con especialistas locales."
/>
<meta
  property="og:image"
  content="images/perito-moreno/og-image.jpg"
/>
<meta property="og:type" content="website" />
```

### Accesibilidad

- Usar etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Todos los `<img>` deben tener `alt` descriptivo
- El video del hero debe tener `aria-hidden="true"` (es decorativo)
- Botones con `aria-label` cuando solo tienen ícono
- Contraste de texto ≥ 4.5:1 (WCAG AA)
- Focus visible en todos los elementos interactivos

---

## Animaciones y transiciones

- Secciones: fade-in + translate-up al entrar en viewport (IntersectionObserver)
- Cards de servicios: hover con sutil `transform: translateY(-4px)` + sombra
- Navegación: transición suave de transparente a sólido al hacer scroll
- Botones flotantes: entrada con delay
- Galería: efecto hover con overlay oscuro + ícono de lupa

Usar `prefers-reduced-motion: reduce` para usuarios con sensibilidad al movimiento.

---

## Checklist antes de entregar

- [ ] Reemplazar número de WhatsApp en `js/whatsapp.js`
- [ ] Reemplazar link de Instagram
- [ ] Insertar imágenes reales en `images/chalten/` y `images/perito-moreno/`
- [ ] Agregar video hero en `video/hero-video.mp4` o ajustar fallback
- [ ] Insertar logo real en `images/logo/`
- [ ] Actualizar nombre de la empresa en todos los textos (buscar "Traslados Patagonia")
- [ ] Agregar imagen del código QR real en el footer
- [ ] Verificar en mobile (iOS Safari y Android Chrome) antes de publicar
- [ ] Comprimir imágenes: WebP con fallback JPG, máx 200KB por imagen
- [ ] Subir a hosting y verificar Open Graph con Facebook Sharing Debugger

---

## Notas para Claude Code

1. **Empezar por `index.html` y `css/variables.css`** — el token system primero.
2. **Construir sección por sección**, en el orden del documento.
3. **Mobile first**: escribir media queries de base para mobile, agregar breakpoints para desktop (`min-width: 768px`, `min-width: 1200px`).
4. **El video del hero** puede ser un `<div>` con imagen de fondo como placeholder hasta que el cliente lo provea.
5. **Las imágenes** de galería pueden ser placeholders (usando `images/chalten/` y `images/perito-moreno/` como carpetas vacías con un README).
6. **No inventar precios** — los servicios no muestran precio, siempre redirigen a WhatsApp.
7. **No usar librerías externas** salvo Google Fonts. Todo el JS debe ser vanilla ES Modules.
8. **El nombre del negocio** (logo, título, meta tags) debe quedar como placeholder `[NOMBRE DE LA EMPRESA]` para que el cliente lo complete.
