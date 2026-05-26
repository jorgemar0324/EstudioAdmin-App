# 008 — Iniciar y terminar sesión de estudio

## Parent PRD

`issues/prd.md`

## What to build

Implementar el flujo completo del timer de sesiones: iniciar desde la página de un proyecto, ver el contador corriendo en el navbar, y terminar la sesión.

**Backend:**
- `POST /api/projects/:id/sessions` — crea una sesión con `startedAt = now()` y `endedAt = null`. Devuelve 409 si ya existe una sesión activa en cualquier proyecto.
- `PATCH /api/sessions/:id` — cierra la sesión: asigna `endedAt = now()` y calcula `durationMinutes = round((endedAt - startedAt) / 60000)`. Devuelve 400 si la sesión ya estaba cerrada.
- `GET /api/sessions/active` — devuelve la sesión activa actual (con `endedAt = null`) o `null` si no hay ninguna.

**Frontend:**
- Botón "Iniciar sesión" en la página del proyecto, visible solo cuando no hay sesión activa.
- Hook `useActiveSession` que consulta `GET /api/sessions/active` al montar la app y expone: la sesión activa, el tiempo transcurrido (calculado localmente con `setInterval` de 1 segundo desde `startedAt`), y la función para terminar.
- Timer en el Navbar: cuando hay sesión activa, muestra el contador en formato `HH:MM:SS` y un botón "Terminar".

Este issue también incluye los tests de Vitest para `SessionService`.

## Acceptance criteria

- [ ] `POST /api/projects/:id/sessions` crea la sesión y devuelve status 201 con la sesión creada
- [ ] `POST /api/projects/:id/sessions` devuelve 409 si ya existe una sesión activa (en cualquier proyecto)
- [ ] `PATCH /api/sessions/:id` cierra la sesión, calcula `durationMinutes` correctamente y devuelve el objeto actualizado
- [ ] `PATCH /api/sessions/:id` devuelve 400 si la sesión ya tiene `endedAt` asignado
- [ ] `GET /api/sessions/active` devuelve la sesión activa o `null`
- [ ] El botón "Iniciar sesión" aparece en la página del proyecto solo cuando no hay sesión activa
- [ ] Al iniciar sesión, el Navbar muestra el timer con el contador corriendo y el botón "Terminar"
- [ ] El contador se incrementa cada segundo usando `setInterval` local (sin polling al backend)
- [ ] Al terminar la sesión desde el Navbar, el timer desaparece y la sesión queda registrada
- [ ] Si hay sesión activa al recargar la app, el timer se recupera correctamente calculando desde `startedAt`
- [ ] **Test Vitest:** `SessionService.create` — devuelve error si ya existe una sesión activa
- [ ] **Test Vitest:** `SessionService.close` — calcula `durationMinutes` correctamente dado un `startedAt` y `endedAt` específicos
- [ ] **Test Vitest:** `SessionService.close` — devuelve error si la sesión ya estaba cerrada

## Blocked by

- Bloqueado por `issues/004-pagina-proyecto-listar-tareas.md`

## User stories addressed

- User story 18 — Botón iniciar sesión en página de proyecto
- User story 19 — Timer en navbar global durante sesión activa
- User story 20 — Terminar sesión desde el timer en navbar
- User story 21 — Duración calculada y guardada automáticamente al terminar
- User story 22 — Contador calculado localmente desde `startedAt`
- User story 25 — Solo una sesión activa a la vez en toda la app
