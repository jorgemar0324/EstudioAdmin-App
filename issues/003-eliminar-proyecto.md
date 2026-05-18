# 003 — Eliminar proyecto con confirmación

## Parent PRD

`issues/prd.md`

## What to build

Permitir al usuario eliminar un proyecto con un diálogo de confirmación que muestre el impacto exacto de la operación.

Antes de borrar, el sistema consulta cuántas tareas y sesiones tiene el proyecto y las muestra en el dialog: *"¿Eliminar 'Cálculo III'? Se borrarán 5 tareas y 3 sesiones. Esta acción no se puede deshacer."* Dos botones: Cancelar y Eliminar (en color destructivo).

El endpoint `DELETE /api/projects/:id` borra el proyecto y, por el `onDelete: Cascade` definido en Prisma, elimina automáticamente todas sus tareas y sesiones.

## Acceptance criteria

- [ ] `DELETE /api/projects/:id` elimina el proyecto y devuelve status 204
- [ ] La eliminación en cascada borra todas las tareas y sesiones del proyecto (verificable en DB)
- [ ] `DELETE /api/projects/:id` devuelve 404 si el proyecto no existe
- [ ] Al hacer clic en "Eliminar" en la tarjeta, se abre el `DeleteConfirmDialog` con el nombre del proyecto y el conteo exacto de tareas y sesiones afectadas
- [ ] El dialog obtiene el conteo desde el backend antes de mostrarse (no hardcodeado)
- [ ] Al confirmar, el proyecto desaparece de la lista sin recargar la página
- [ ] Al cancelar, el dialog se cierra sin hacer ningún cambio
- [ ] Aparece un toast de confirmación tras el borrado exitoso

## Blocked by

- Bloqueado por `issues/002-crear-editar-proyectos.md`

## User stories addressed

- User story 5 — Eliminar proyecto con dialog que muestra el impacto
- User story 6 — Borrado en cascada de tareas y sesiones
