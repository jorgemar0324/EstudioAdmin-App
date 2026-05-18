# 009 — Recuperación de sesión huérfana

## Parent PRD

`issues/prd.md`

## What to build

Detectar al iniciar la app si hay una sesión que quedó abierta (sin `endedAt`) y mostrar un diálogo de recuperación para que el usuario decida qué hacer con ella.

El hook `useActiveSession` (creado en `issues/008`) ya consulta `GET /api/sessions/active` al montar. Si detecta una sesión activa cuya duración supera un umbral razonable (por ejemplo, el usuario claramente no estuvo estudiando 8 horas), o simplemente siempre que hay una sesión activa al abrir la app, se muestra el `OrphanSessionDialog`.

El dialog muestra cuánto tiempo lleva abierta la sesión y presenta dos opciones:
- **Terminar ahora** — cierra la sesión usando el tiempo actual como `endedAt` (flujo normal de `PATCH /api/sessions/:id`)
- **Descartar** — elimina la sesión completamente (`DELETE /api/sessions/:id`) sin registrar duración

## Acceptance criteria

- [ ] `DELETE /api/sessions/:id` elimina la sesión y devuelve status 204
- [ ] Al abrir la app con una sesión activa previamente iniciada (simulable recargando la página), aparece el `OrphanSessionDialog`
- [ ] El dialog muestra el tiempo transcurrido desde `startedAt` de la sesión huérfana
- [ ] El dialog muestra el nombre del proyecto al que pertenece la sesión
- [ ] Al elegir "Terminar ahora", se llama `PATCH /api/sessions/:id` con el tiempo actual y la sesión queda registrada
- [ ] Al elegir "Descartar", se llama `DELETE /api/sessions/:id` y la sesión se elimina sin registrar duración
- [ ] Tras resolver el dialog, el timer en el Navbar desaparece (sesión terminada o descartada)
- [ ] El dialog no aparece si no hay sesión activa al cargar la app

## Blocked by

- Bloqueado por `issues/008-iniciar-terminar-sesion.md`

## User stories addressed

- User story 23 — Dialog al detectar sesión huérfana con opción de terminar o descartar
