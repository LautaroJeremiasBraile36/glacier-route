# Specs GlacierRoute (etapa 2: rediseño por secciones)

Specs para implementar con Claude Code. Están versionadas en `specs/`, en la raíz del repo.

## Orden de trabajo

| # | Spec | Depende del cliente | Rama sugerida |
|---|------|---------------------|---------------|
| 00 | [Contexto y convenciones](00-contexto-y-convenciones.md) | No | (no se implementa, se lee siempre) |
| 01 | [Limpieza de contenido y config central](01-limpieza-y-config.md) | No | `feat/01-limpieza` |
| 02 | [Sitio multipágina](02-multipagina.md) | No | `feat/02-multipagina` |
| 03 | [Servicios, cards y reserva](03-servicios-y-reserva.md) | Solo el número nuevo (precios cargados) | `feat/03-servicios` |
| 04 | [SOS TC: formulario e itinerario](04-sos-tc.md) | Precios por grupo (usa marcadores) | `feat/04-sos-tc` |
| 05 | [Color, hero e imágenes](05-color-e-imagenes.md) | Sí: paleta (imágenes ya recibidas) | `feat/05-identidad` |

## Cómo pedírselo a Claude Code

Una spec por sesión y por rama. Prompt sugerido:

```
Leé specs/00-contexto-y-convenciones.md y specs/0X-....md.
Antes de tocar código, mostrame un plan corto con los archivos que vas a crear o cambiar.
Después implementalo, verificá los criterios de aceptación y hacé commit en la rama feat/0X-...
```

Usá el modo plan (Shift+Tab) para que primero proponga y después ejecute.

## Decisiones ya tomadas (no reabrir)

- Solo "traslados": nada de City Tour, excursiones ni guía local.
- No hay sección de viandas. La vianda es un botón Sí/No dentro de los formularios de reserva (cliente común y TC). Se termina de gestionar por WhatsApp.
- La reserva siempre termina abriendo WhatsApp al número de reservas con un mensaje armado. No hay backend.
- Sitio estático, sin frameworks ni bundler.
