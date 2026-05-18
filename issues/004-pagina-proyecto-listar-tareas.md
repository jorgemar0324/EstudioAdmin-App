# 004 — Página de proyecto + listar tareas

## Parent PRD

`issues/prd.md`

## What to build

Implementar la página individual de un proyecto en la ruta `/projects/:id`, con dos pestañas ("Tareas" y "Sesiones") y la lista de tareas funcional en la pestaña activa.

La pestaña "Sesiones" queda vacía en este issue (se completa en `issues/010`). La pestaña "Tareas" muestra las tareas del proyecto ordenadas por status (EN_PROGRESO → PENDIENTE → COMPLETADA) y dentro de cada grupo por prioridad (ALTA → MEDIA → BAJA).

Cuando el proyecto no tiene tareas, se muestra un estado vacío con un botón "Añadir tarea".

El endpoint `GET /api/projects/:id/tasks` devuelve las tareas ya ordenadas desde el backend.

## Acceptance criteria

- [ ] `GET /api/projects/:id/tasks` devuelve las tareas del proyecto ordenadas: primero EN_PROGRESO, luego PENDIENTE, luego COMPLETADA; dentro de cada grupo por prioridad ALTA → MEDIA → BAJA
- [ ] `GET /api/projects/:id/tasks` devuelve 404 si el proyecto no existe
- [ ] Hacer clic en una tarjeta de proyecto en `/` navega a `/projects/:id`
- [ ] La página muestra el nombre del proyecto como título
- [ ] La página tiene dos pestañas: "Tareas" y "Sesiones"
- [ ] La pestaña "Tareas" muestra la lista de tareas con su título, prioridad, estado y fecha límite
- [ ] La pestaña "Tareas" muestra un estado vacío con mensaje y botón "Añadir tarea" cuando no hay tareas
- [ ] La pestaña "Sesiones" existe pero puede mostrar un placeholder vacío
- [ ] Navegar entre pestañas no recarga la página

## Blocked by

- Bloqueado por `issues/001-monorepo-listar-proyectos.md`

## User stories addressed

- User story 10 — Tareas ordenadas por status luego prioridad
- User story 16 — Estado vacío en pestaña de tareas
- User story 35 — Clic en proyecto navega a su página
- User story 36 — Página de proyecto con pestañas Tareas y Sesiones
