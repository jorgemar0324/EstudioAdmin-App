# 006 — Cambiar estado y eliminar tareas

## Parent PRD

`issues/prd.md`

## What to build

Dos interacciones directas sobre la `TaskCard` sin abrir el modal de edición completo:

1. **Dropdown de estado:** Un selector en la tarjeta que permite cambiar el status de la tarea (PENDIENTE / EN_PROGRESO / COMPLETADA) en cualquier dirección, incluyendo hacia atrás. Al seleccionar un nuevo estado, se envía `PATCH /api/tasks/:id` inmediatamente y la lista se reordena para reflejar el nuevo estado.

2. **Eliminar tarea:** Un botón de eliminar en la tarjeta que abre el `DeleteConfirmDialog` genérico con el mensaje "¿Eliminar '[título de la tarea]'? Esta acción no se puede deshacer." Al confirmar, se envía `DELETE /api/tasks/:id` y la tarea desaparece de la lista.

## Acceptance criteria

- [ ] La `TaskCard` muestra un dropdown con los tres estados posibles, marcando el estado actual
- [ ] Al seleccionar un estado diferente en el dropdown, se envía `PATCH /api/tasks/:id` con el nuevo status
- [ ] Tras el cambio de estado, la tarea se mueve al grupo correcto en la lista (ej: pasar a COMPLETADA la lleva al fondo)
- [ ] El dropdown permite cualquier transición, incluyendo de COMPLETADA a PENDIENTE
- [ ] La `TaskCard` muestra un botón de eliminar
- [ ] Al hacer clic en eliminar, se abre el `DeleteConfirmDialog` con el título de la tarea
- [ ] `DELETE /api/tasks/:id` elimina la tarea y devuelve status 204
- [ ] `DELETE /api/tasks/:id` devuelve 404 si la tarea no existe
- [ ] Al confirmar el borrado, la tarea desaparece de la lista sin recargar
- [ ] Al cancelar el dialog, no ocurre ningún cambio
- [ ] Aparece toast de éxito al eliminar

## Blocked by

- Bloqueado por `issues/005-crear-editar-tareas.md`

## User stories addressed

- User story 11 — Dropdown en tarjeta para cambiar estado
- User story 12 — Cualquier transición de estado permitida
- User story 14 — Eliminar tarea con confirmación
