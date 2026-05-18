# 002 — Crear y editar proyectos

## Parent PRD

`issues/prd.md`

## What to build

Permitir al usuario crear nuevos proyectos y editar los existentes mediante un modal reutilizable.

El modal (`ProjectFormModal`) recibe una prop `project` (o `null`). Si es `null`, el formulario aparece vacío con título "Nuevo proyecto". Si tiene datos, los pre-rellena con título "Editar proyecto". El mismo componente sirve para ambos casos.

Campos del formulario: nombre (requerido), descripción (opcional), tipo (MATERIA / CURSO_ONLINE / SIDE_PROJECT), prioridad (BAJA / MEDIA / ALTA).

Los errores de validación (campo nombre vacío) se muestran inline debajo del campo. Los éxitos y errores de red se notifican con toasts que desaparecen solos.

Endpoints nuevos: `POST /api/projects` y `PATCH /api/projects/:id`.

## Acceptance criteria

- [ ] `POST /api/projects` crea un proyecto y devuelve el objeto creado con status 201
- [ ] `PATCH /api/projects/:id` actualiza los campos enviados y devuelve el objeto actualizado
- [ ] Ambos endpoints validan que el campo `name` no esté vacío y devuelven 400 si lo está
- [ ] El botón "Crear tu primer proyecto" (estado vacío) y un botón "Nuevo proyecto" (cuando hay proyectos) abren el modal en modo creación
- [ ] El botón de editar en la tarjeta de cada proyecto abre el modal pre-rellenado con los datos actuales
- [ ] Al guardar exitosamente, el modal se cierra y la lista de proyectos se actualiza sin recargar la página
- [ ] El campo nombre muestra un error inline si se intenta guardar vacío
- [ ] Aparece un toast de éxito al crear o editar un proyecto
- [ ] Aparece un toast de error si la petición al servidor falla
- [ ] El modal puede cerrarse sin guardar (botón Cancelar o clic fuera)

## Blocked by

- Bloqueado por `issues/001-monorepo-listar-proyectos.md`

## User stories addressed

- User story 1 — Crear proyecto con nombre, tipo y prioridad
- User story 4 — Editar proyecto existente
- User story 8 — Formulario de creación/edición en modal
- User story 37 — Toast de confirmación al guardar
- User story 38 — Toast de error si falla la red
