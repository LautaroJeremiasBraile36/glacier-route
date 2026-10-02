# 02 · Sitio multipágina

## Objetivo

Separar el contenido en pantallas propias. Requiere la spec 01 terminada.

## Páginas

| Archivo | Contenido |
|---------|-----------|
| `index.html` | Hero, los "más recomendados" (3 servicios destacados), accesos a Servicios y SOS TC, una franja corta de Quiénes somos, galería resumida y CTA final. |
| `servicios.html` | Todos los traslados agrupados por destino (El Calafate / El Chaltén), con un filtro o pestañas por destino. Las cards y el formulario se definen en la spec 03. |
| `sos-tc.html` | Página para TC y coordinadores de grupos (spec 04). |
| `nosotros.html` | Quiénes somos completo, con los valores (puntualidad, flexibilidad, experiencia patagónica) y fotos del equipo cuando lleguen. |

No hay página de viandas.

## Navegación

- Nav: Inicio · Servicios · SOS TC · Quiénes somos · botón "Reservar ahora" (lleva a `servicios.html`).
- El nav y el footer se repiten como HTML estático en cada página. Es lo más simple, funciona sin JS y es mejor para SEO. Al cambiar uno, hay que actualizar todas las páginas. Agregar el comentario `<!-- NAV: mantener igual en todas las páginas -->`.
- `js/nav.js`: marcar como activo el link de la página actual (comparando con `location.pathname`) en vez del scroll spy por anclas. El scroll spy se puede mantener solo dentro de `index.html` si sigue teniendo sentido.
- `js/main.js`: cada inicializador tiene que tolerar que su elemento no exista en la página (la mayoría ya lo hace).

## SEO

- `<title>`, `meta description` y Open Graph propios en cada página, con las palabras clave traslados, El Calafate y El Chaltén.
- Actualizar `sitemap.xml` con las 4 URLs (dominio `glacierroute.com.ar`).
- JSON-LD solo en `index.html`.

## CSS

- Reutilizar los CSS actuales. Si hace falta, agregar `css/pages.css` para lo específico de cada página. Cada página carga solo los CSS que usa.

## Criterios de aceptación

- Las 4 páginas cargan sin errores y comparten el mismo nav y footer.
- El link de la página actual se ve activo en el nav.
- Desde cualquier página se llega a cualquier otra en un clic.
- El botón flotante de WhatsApp está en todas las páginas.
