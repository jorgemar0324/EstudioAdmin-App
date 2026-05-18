# 010 — Historial de sesiones por proyecto

## Parent PRD

`issues/prd.md`

## What to build

Completar la pestaña "Sesiones" en la página de un proyecto mostrando el historial de sesiones completadas, ordenadas de más reciente a más antigua.

Cada entrada del historial muestra: fecha de la sesión, hora de inicio y duración en formato legible (ej: "45 min" o "1h 20min"). Las sesiones activas (sin `endedAt`) no aparecen en el historial.

Endpoint nuevo: `GET /api/projects/:id/sessions` — devuelve solo sesiones con `endedAt` no nulo, ordenadas por `startedAt` descendente.

## Acceptance criteria

- [ ] `GET /api/projects/:id/sessions` devuelve solo sesiones cerradas (con `endedAt` no nulo)
- [ ] Las sesiones se devuelven ordenadas por `startedAt` descendente (más reciente primero)
- [ ] `GET /api/projects/:id/sessions` devuelve 404 si el proyecto no existe
- [ ] La pestaña "Sesiones" en la página del proyecto muestra la lista de sesiones del historial
- [ ] Cada entrada muestra: fecha (ej: "lunes 12 de mayo"), hora de inicio y duración formateada
- [ ] La duración se muestra en formato legible: "X min" si es menos de 60 minutos, "Xh Ymin" si es 60 o más
- [ ] Si el proyecto no tiene sesiones completadas, la pestaña muestra un mensaje vacío (ej: "Aún no hay sesiones registradas")
- [ ] La pestaña "Sesiones" solo muestra sesiones de ese proyecto, no de otros

## Blocked by

- Bloqueado por `issues/008-iniciar-terminar-sesion.md`

## User stories addressed

- User story 24 — Historial de sesiones en pestaña del proyecto con fecha, hora y duración
- User story 36 — Pestaña "Sesiones" completa dentro de la página del proyecto
