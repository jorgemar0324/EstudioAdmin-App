# 005 — Crear y editar tareas

## Parent PRD

`issues/prd.md`

## What to build

Permitir al usuario crear y editar tareas dentro de un proyecto mediante un modal reutilizable (`TaskFormModal`).

El modal recibe una prop `task` (o `null`). Si es `null`, el formulario aparece vacío. Si tiene datos, los pre-rellena. Campos: título (requerido), descripción (opcional), estado (PENDIENTE / EN_PROGRESO / COMPLETADA), prioridad (BAJA / MEDIA / ALTA), fecha límite (opcional).

La fecha límite de una tarea se muestra en rojo en la `TaskCard` cuando la fecha ya pasó y el estado no es COMPLETADA.

Este issue también incluye los tests de Vitest para la lógica de ordenamiento de tareas (`TaskService`) y el renderizado correcto de la `TaskCard` cuando la tarea está vencida.

## Acceptance criteria

- [ ] `POST /api/projects/:id/tasks` crea una tarea y devuelve el objeto con status 201
- [ ] `PATCH /api/tasks/:id` actualiza los campos enviados y devuelve el objeto actualizado
- [ ] Ambos endpoints validan que `title` no esté vacío y devuelven 400 si lo está
- [ ] El botón "Añadir tarea" (estado vacío y botón permanente en la página) abre el `TaskFormModal` en modo creación
- [ ] El botón de editar en cada `TaskCard` abre el modal pre-rellenado con los datos actuales
- [ ] Al guardar, el modal se cierra y la lista de tareas se actualiza sin recargar
- [ ] El campo título muestra un error inline si se intenta guardar vacío
- [ ] La fecha límite se muestra en rojo en la `TaskCard` cuando la fecha ya pasó y la tarea no está COMPLETADA
- [ ] La fecha límite vencida de una tarea COMPLETADA NO se muestra en rojo
- [ ] Aparece toast de éxito al crear o editar
- [ ] Aparece toast de error si falla la petición
- [ ] **Test Vitest:** `TaskService` — dado un array de tareas con distintos status y prioridades, la función de orden devuelve EN_PROGRESO antes que PENDIENTE, PENDIENTE antes que COMPLETADA, y dentro de cada grupo ALTA antes que MEDIA antes que BAJA
- [ ] **Test Vitest:** `TaskCard` — cuando `dueDate` es anterior a hoy y `status !== COMPLETADA`, la fecha se renderiza con la clase de color rojo; cuando `status === COMPLETADA`, no aparece la clase roja

## Blocked by

- Bloqueado por `issues/004-pagina-proyecto-listar-tareas.md`

## User stories addressed

- User story 9 — Crear tarea con todos sus campos
- User story 13 — Editar tarea desde modal reutilizado
- User story 15 — Fecha límite vencida en rojo
- User story 17 — Validación inline en el formulario
- User story 37 — Toast de éxito
- User story 38 — Toast de error
