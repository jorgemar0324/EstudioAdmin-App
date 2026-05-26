# 007 — Progreso de proyectos en tiempo real

## Parent PRD

`issues/prd.md`

## What to build

Mostrar en la tarjeta de cada proyecto una barra de progreso visual y el conteo exacto de tareas completadas sobre el total.

El endpoint `GET /api/projects` se extiende para incluir en cada proyecto el conteo de tareas agrupadas por status. El frontend usa esos datos para calcular y renderizar la barra de progreso de shadcn/ui (`Progress`) junto con el texto "X/Y tareas".

Cuando un proyecto no tiene tareas, la barra aparece en 0% y el texto muestra "0/0 tareas".

## Acceptance criteria

- [ ] `GET /api/projects` incluye en cada proyecto un campo con el conteo de tareas por status (completadas y total)
- [ ] La tarjeta de proyecto muestra la barra de progreso de shadcn/ui reflejando el porcentaje de tareas completadas
- [ ] La tarjeta muestra el texto "X/Y tareas" junto a la barra
- [ ] Al completar o cambiar el estado de una tarea, la barra de progreso en la lista de proyectos se actualiza (mediante revalidación de TanStack Query)
- [ ] Si el proyecto no tiene tareas, la barra aparece en 0% y el texto dice "0/0 tareas"
- [ ] Si todas las tareas están completadas, la barra aparece al 100%

## Blocked by

- Bloqueado por `issues/006-cambiar-estado-eliminar-tareas.md`

## User stories addressed

- User story 3 — Barra de progreso y conteo de tareas en tarjeta de proyecto
