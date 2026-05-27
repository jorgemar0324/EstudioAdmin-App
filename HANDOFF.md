# Bitácora de Transferencia — Administracion_Estudio

Este archivo recopila los resúmenes de contexto generados con la skill `/handoff` de Claude Code a lo largo del desarrollo del proyecto. Cada entrada representa una transferencia limpia de contexto entre sesiones de trabajo.

---

## Handoff #1 — 18 mayo 2026

**Issues completados en esta sesión:** 001

---

### 1. Proyecto

**Administracion_Estudio** — app web personal para gestión de proyectos de estudio, timer de sesiones y dashboard de progreso. Sin login, sin multi-usuario, solo para uso personal de Jorge (estudiante Ingeniería de Software, semestre 6).

---

### 2. Stack técnico

| Capa | Tecnología |
|------|------------|
| Monorepo | npm workspaces (`apps/web`, `apps/api`, `packages/shared`) |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + React Router v6 |
| Backend | Node.js + Express + TypeScript (`tsx watch`) |
| ORM | Prisma v5.22 |
| Base de datos | PostgreSQL en Supabase (conexión directa, sin SDK de Supabase) |
| Testing | Vitest (aún no configurado — se añade en issues 005, 008, 011) |

---

### 3. Lo que se construyó (issue 001 — COMPLETO)

**`packages/shared/src/index.ts`** — tipos TypeScript compartidos: `Priority`, `ProjectType`, `TaskStatus`, `Project`, `Task`, `StudySession`

**`apps/api/`:**
- Schema Prisma con 3 modelos: `Project`, `Task`, `StudySession` con `onDelete: Cascade`
- Migración aplicada en Supabase
- Express app con CORS para localhost:5173
- `GET /api/projects` con ordenamiento por prioridad (aplicado en capa de aplicación)

**`apps/web/`:**
- Vite con alias `@` → `src/`, proxy `/api` → `localhost:3001`
- Tailwind CSS + variables CSS de shadcn/ui
- TanStack Query client (staleTime 30s)
- `ProjectsPage` con lista de proyectos, estado vacío motivador y loading/error states
- Navbar con links "Proyectos" y "Dashboard"

---

### 4. Decisiones arquitectónicas clave

| Decisión | Detalle |
|----------|---------|
| Ordenamiento proyectos | En capa de aplicación (no en SQL): `ALTA → MEDIA → BAJA` |
| Supabase + Prisma | `url` (pgBouncer puerto 6543) + `directUrl` (puerto 5432) para migraciones |
| shadcn/ui | Configurado manualmente sin CLI |
| TypeScript | Limpio en ambos apps (`tsc --noEmit` sin errores) |

### Decisiones de diseño UX (sesión /grill-me)

1. Navegación por rutas separadas con React Router
2. Home `/` = lista de proyectos, ordenados por prioridad ALTA→BAJA luego `createdAt`
3. Tareas ordenadas: EN_PROGRESO → PENDIENTE → COMPLETADA, luego prioridad
4. Sesión huérfana: dialog "¿Terminas ahora o descartas?"
5. Racha: mínimo 10 minutos de sesión por día calendario
6. Dashboard: semana = lunes a domingo (no rolling 7 días)
7. Borrado proyectos: cascada con dialog mostrando conteo exacto
8. Tareas vencidas: fecha en rojo, sin cambiar posición en lista
9. Progreso proyecto: barra de progreso + texto "X/Y tareas"
10. Timer activo visible en la barra de navegación global
11. Crear/editar: modal reutilizable (prop `project` o `null`)
12. Feedback: errores inline + éxitos/errores de red como toasts (Sonner)
13. Timer counter: `setInterval` local desde `startedAt` del backend
14. Cambio de estado de tarea: dropdown en la tarjeta

---

### 5. Issues completados

| Issue | Estado |
|-------|--------|
| `001-monorepo-listar-proyectos.md` | ✅ COMPLETO |

---

### 6. Próximo paso exacto

Implementar issue 002 — Crear y editar proyectos. Instalar Sonner, agregar `POST /api/projects` y `PATCH /api/projects/:id`, crear `ProjectFormModal.tsx`.

---

## Handoff #2 — 26 mayo 2026

**Issues completados en esta sesión:** 001, 002, 003, 004

---

### 1. Proyecto

App web personal para centralizar proyectos de estudio, gestión de tareas, timer de sesiones y dashboard de progreso semanal. Sin login, sin multi-usuario, para uso exclusivo de Jorge.

---

### 2. Lo que se construyó

**001 — Monorepo + listar proyectos**
- Estructura monorepo: `apps/api`, `apps/web`, `packages/shared`
- Schema Prisma con modelos Project, Task, StudySession
- `GET /api/projects` con orden por prioridad → fecha
- ProjectsPage con tarjetas, estado vacío motivador, Navbar

**002 — Crear y editar proyectos**
- `POST /api/projects` y `PATCH /api/projects/:id`
- `ProjectFormModal` reutilizable (prop `project | null`)
- Validación inline + toasts de éxito/error

**003 — Eliminar proyecto**
- `DELETE /api/projects/:id` con cascada en Prisma
- `DeleteConfirmDialog` genérico con conteo de tareas y sesiones a borrar
- Toast de confirmación al borrar

**004 — Página de proyecto con pestañas Tareas/Sesiones**
- Ruta `/projects/:id` → `ProjectPage`
- Dos pestañas: "Tareas" y "Sesiones" (Sesiones es placeholder aún)
- `GET /api/projects/:id/tasks` con orden EN_PROGRESO → PENDIENTE → COMPLETADA, luego prioridad ALTA → MEDIA → BAJA
- `TaskCard` con badge de status, badge de prioridad, fecha límite en rojo si vencida
- Botón "Añadir tarea" sin conectar aún

**chore — Vitest config**
- Scripts de test configurados con `--passWithNoTests`
- Sin archivos de test escritos aún

---

### 3. Decisiones arquitectónicas clave

| Decisión | Detalle |
|----------|---------|
| Sin versionado de API | `/api/...` (no `/api/v1/...`) |
| Ordenamiento tareas | En memoria tras `findMany` — debería estar en `TaskService` dedicado (deuda técnica) |
| `ProjectWithCount` | `GET /api/projects/:id` incluye `_count: { tasks, sessions }` |
| Cascada de borrado | `onDelete: Cascade` en Prisma para tareas y sesiones |
| Timer frontend | `setInterval` local con `Date.now() - startedAt` (no implementado aún — issue 008) |
| `packages/shared` | Tipos `Priority`, `ProjectType`, `TaskStatus`, `Project`, `Task`, `StudySession` |

---

### 4. Issues completados

| # | Título | Ubicación |
|---|--------|-----------|
| 001 | Monorepo + listar proyectos | `issues/done/` |
| 002 | Crear y editar proyectos | `issues/done/` |
| 003 | Eliminar proyecto | `issues/done/` |
| 004 | Página de proyecto + listar tareas | `issues/done/` |

---

### 5. Issues pendientes

| # | Título | Bloqueado por |
|---|--------|---------------|
| 005 | Crear y editar tareas (TaskFormModal) | 004 ✅ |
| 006 | Cambiar estado y eliminar tareas | 005 |
| 007 | Barra de progreso en tarjetas de proyecto | 006 |
| 008 | Iniciar y terminar sesión de estudio | 007 |
| 009 | Recuperación de sesión huérfana | 008 |
| 010 | Historial de sesiones por proyecto | 008 |
| 011 | Dashboard (horas semanales, racha, progreso) | 010 |

---

### 6. Bloqueantes

- Issue 005: faltan endpoints `POST /api/projects/:id/tasks`, `PATCH /api/tasks/:id` y `DELETE /api/tasks/:id`
- Pestaña "Sesiones" en ProjectPage es placeholder hasta issues 008-010
- No hay tests escritos aún — config de Vitest lista pero sin archivos de test

---

### 7. Próximo paso exacto

Ejecutar issue 005 — Crear y editar tareas:
1. Backend: agregar `POST /api/projects/:id/tasks` y `PATCH /api/tasks/:id`
2. Frontend: agregar `tasks.create()` y `tasks.update()` en `api.ts`
3. Crear `TaskFormModal.tsx` reutilizable (prop `task | null`)
4. Conectar botón "Añadir tarea" en `ProjectPage.tsx`
5. Agregar tests Vitest para la función de ordenamiento

# Handoff — Sesión 3

## Proyecto
**Administración de Estudio** — App web para gestionar proyectos académicos (materias, cursos online, side projects), sus tareas y sesiones de estudio. Monorepo TypeScript.

## Stack técnico
- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui (Radix UI) + TanStack Query + React Router
- **Backend:** Node.js + Express + Prisma ORM
- **Base de datos:** PostgreSQL (Supabase)
- **Testing:** Vitest (configurado, sin tests escritos aún)
- **Shared types:** `packages/shared/src/index.ts` — `Project`, `Task`, `StudySession`, enums

## Lo que se construyó en esta sesión
**Ningún código de producción modificado.** Esta fue una sesión de arquitectura pura:

1. **Exploración de codebase** — análisis exhaustivo de friction points arquitectónicos
2. **3 propuestas de interfaz** (sub-agentes paralelos) para dos problemas:
   - Backend: separación del service layer (`routes/projects.ts` con 4 responsabilidades mezcladas)
   - Frontend: patrón para el API client (`api.ts` sin convención para 12+ métodos nuevos)
3. **`issues/012-rfc-service-layer-api-client.md`** — RFC completo con interfaz híbrida recomendada

## Decisiones arquitectónicas tomadas

### Backend — Service layer con `ServiceResult<T>`
- Un archivo de servicio por dominio: `services/projects.ts`, `services/tasks.ts`, `services/sessions.ts`, `services/dashboard.ts`
- Cada servicio recibe `PrismaClient` por **constructor injection**
- Devuelven `ServiceResult<T> = { ok: true; data: T } | { ok: false; status: 400|404|409|500; message: string }` — nunca lanzan excepciones por casos esperados
- Helper `sendResult(res, result, successStatus?)` de 6 líneas elimina toda la duplicación de try/catch en rutas
- Las rutas quedan de **1 línea por handler**
- **Sin capa Repository todavía** — upgrade path explícito en el RFC cuando los tests lo exijan
- Singletons en `services/index.ts` para producción; tests usan `new XxxService(testPrismaClient)`

### Frontend — Hooks por dominio sobre transporte plano
- `api.ts` queda como **capa de transporte pura** (sin cambio estructural, solo se añade `ApiError` con `.status`)
- Hooks pre-construidos en `hooks/useProjects.ts`, `hooks/useTasks.ts`, `hooks/useSessions.ts`
- Los hooks encapsulan: `queryKey`, `invalidateQueries`, `toast.success/error`, flag `enabled`
- Los componentes **nunca** importan `useQueryClient()` ni definen query keys directamente
- Fetches imperativos one-off (ej. conteo antes de dialog de borrado) siguen usando `api.*` directamente — esto es legítimo

### Por qué esta arquitectura (y no las otras)
- **Descartado Command/Dispatch** (Agente 1): pierde inferencia de tipos por acción sin overloads complejos
- **Descartado Repository layer completo** (Agente 2): 14 archivos de boilerplate antes de lógica real; se reserva como upgrade path
- **Descartado ProjectService monolítico** (Agente 3 backend): reproduce el problema de `projects.ts` en 6 semanas

## Issues completados (en `issues/done/`)
| Issue | Descripción |
|-------|-------------|
| 001 | Monorepo + listar proyectos |
| 002 | Crear y editar proyectos |
| 003 | Eliminar proyecto con confirmación |
| 004 | Página de proyecto con pestañas Tareas/Sesiones |

## Issues pendientes (en orden de prioridad)
| Issue | Descripción | Notas |
|-------|-------------|-------|
| **012** | RFC service layer + API client | ⚠️ **Implementar ANTES que 005** — establece el patrón |
| 005 | Crear y editar tareas | Necesita `TaskService` + `useCreateTask` |
| 006 | Cambiar estado y eliminar tareas | Necesita `useUpdateTask`, `useDeleteTask` |
| 007 | Progreso de proyectos | Necesita `ProjectService.list()` con conteos |
| 008 | Iniciar y terminar sesión de estudio | Necesita `SessionService.start/close` con guard de sesión activa |
| 009 | Recuperación de sesión huérfana | Depende de 008 |
| 010 | Historial de sesiones por proyecto | Depende de 008 |
| 011 | Dashboard | Necesita `DashboardService` con algoritmo de streak |

## Bloqueantes
- **Ninguno técnico.** El RFC 012 está listo para implementarse.
- Los tests requieren configurar Prisma con SQLite en memoria (`file::memory:`) — no hay setup de test todavía en ninguna app.

## Próximo paso exacto

**Implementar el RFC 012** siguiendo este orden:

1. Crear `apps/api/src/lib/serviceResult.ts` y `apps/api/src/lib/sendResult.ts`
2. Crear `apps/api/src/services/projects.ts` — extraer lógica de `routes/projects.ts`
3. Reemplazar `apps/api/src/routes/projects.ts` con handlers de 1 línea
4. Verificar que los endpoints existentes siguen funcionando (`GET /api/projects`, `POST`, `PATCH`, `DELETE`)
5. Añadir `ApiError` a `apps/web/src/lib/api.ts`
6. Crear `apps/web/src/hooks/useProjects.ts`
7. Migrar `ProjectsPage.tsx` y `ProjectPage.tsx` a los nuevos hooks
8. Sólo entonces, continuar con issue 005 (tareas) usando el patrón establecido

El RFC completo con firmas TypeScript, tests boundary, y estrategia de migración está en `issues/012-rfc-service-layer-api-client.md`.

---

# Handoff — Sesión 4 (2026-05-26)

## Proyecto
**Administración de Estudio** — App web para gestionar proyectos académicos (materias, cursos online, side projects), tareas y sesiones de estudio cronometradas. Monorepo TypeScript.

## Stack técnico
- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui + TanStack Query + React Router + Sonner (toasts)
- **Backend:** Node.js + Express + Prisma ORM + PostgreSQL (Supabase)
- **Testing:** Vitest — 13 tests pasando (3 archivos: projects, tasks, sessions)
- **Shared types:** `packages/shared/src/index.ts` — `Project`, `ProjectWithProgress`, `Task`, `StudySession`, enums

## Lo que se construyó en esta sesión

### Issue 007 — Barra de progreso en tarjetas de proyecto
| Archivo | Cambio |
|---------|--------|
| `apps/api/src/services/projects.ts` | `list()` usa `include: { tasks: { select: { status } } }` y calcula `completedTasks`/`totalTasks` en JS; strip del array `tasks` del response |
| `apps/api/src/__tests__/services/projects.test.ts` | **NUEVO** — 3 tests: conteos correctos, 0/0 sin tareas, ausencia del campo `tasks` |
| `packages/shared/src/index.ts` | Añade `ProjectWithProgress extends Project { completedTasks, totalTasks }` |
| `apps/web/src/lib/api.ts` | `api.projects.list()` tipado como `ProjectWithProgress[]` |
| `apps/web/src/components/ui/progress.tsx` | **NUEVO** — componente Progress sin dependencia Radix (solo div + CSS) |
| `apps/web/src/pages/ProjectsPage.tsx` | `ProjectCard` muestra `<Progress>` + texto "X/Y tareas" + porcentaje |
| `apps/web/src/hooks/useTasks.ts` | `useCreateTask`, `useUpdateTask`, `useDeleteTask` invalidan `['projects']` en `onSuccess` |

### Issue 008 — Timer de sesión de estudio
| Archivo | Cambio |
|---------|--------|
| `apps/api/src/services/sessions.ts` | **NUEVO** — `SessionService`: `getActive()`, `create(projectId)` con guard 409, `close(id)` con `Math.round` para `durationMinutes` y guard 400 |
| `apps/api/src/__tests__/services/sessions.test.ts` | **NUEVO** — 4 tests: 409 si sesión activa, crea si no hay ninguna, `durationMinutes` correcto, 400 si ya cerrada |
| `apps/api/src/routes/sessions.ts` | **NUEVO** — `GET /api/sessions/active`, `PATCH /api/sessions/:id` |
| `apps/api/src/routes/projects.ts` | Añade `POST /:id/sessions` |
| `apps/api/src/services/index.ts` | Exporta `sessionService` singleton |
| `apps/api/src/index.ts` | Registra `sessionsRouter` en `/api/sessions` |
| `apps/web/src/lib/api.ts` | Añade `api.sessions.{ getActive, create, close }` |
| `apps/web/src/contexts/ActiveSessionContext.tsx` | **NUEVO** — React Context con `useQuery` (staleTime: Infinity) + `setInterval` único para elapsed time; expone `{ session, elapsedSeconds, start, stop }` |
| `apps/web/src/App.tsx` | Envuelve app con `<ActiveSessionProvider>` (dentro de `QueryClientProvider`) |
| `apps/web/src/components/Navbar.tsx` | Timer `HH:MM:SS` con ícono + botón "Terminar" cuando `session !== null` |
| `apps/web/src/pages/ProjectPage.tsx` | Botón "Iniciar sesión" junto al título, solo visible cuando `!activeSession` |

## Decisiones arquitectónicas

### `ActiveSessionProvider` como Context (no hook puro)
- El timer (`setInterval` de 1s) debe correr **una sola vez** aunque Navbar y ProjectPage ambos consuman el estado de sesión.
- Si fuera un hook puro con `useEffect`, cada componente ejecutaría su propio intervalo.
- Solución: Context Provider que corre el intervalo único; el hook `useActiveSession()` solo expone el contexto.

### `staleTime: Infinity` en `useActiveSession`
- `GET /api/sessions/active` no debe hacer refetch automático en background (sería polling).
- El estado se actualiza manualmente vía `queryClient.setQueryData` cuando `start()` y `stop()` tienen éxito.
- Esto asegura que al recargar la app el timer se recupera correctamente desde `startedAt`.

### `Progress` sin Radix
- `@radix-ui/react-progress` no estaba instalado. El componente Progress es tan simple (div + width%) que agregar la dependencia sería sobrediseño.

### Invalidación cruzada de queries en `useTasks`
- Al crear/actualizar/eliminar una tarea, se invalida tanto `['tasks', projectId]` como `['projects']` para que las barras de progreso se refresquen automáticamente.

## Issues completados (`issues/done/`)
001, 002, 003, 004, 005, 006, 007, 008 — todos en `issues/done/`

## Issues pendientes (en orden de prioridad)
| Issue | Descripción | Desbloqueado por |
|-------|-------------|-----------------|
| **009** | Recuperación de sesión huérfana — `DELETE /api/sessions/:id` + `OrphanSessionDialog` | 008 ✓ |
| **010** | Historial de sesiones por proyecto — `GET /api/projects/:id/sessions` + pestaña Sesiones | 008 ✓ |
| **011** | Dashboard — `DashboardService` con `weeklyHours`, `streak` (algoritmo), progreso por proyecto | 007 ✓ + 010 |

El issue 012 es solo documentación RFC, ya implementado.

## Bloqueantes
- Ninguno. Issues 009 y 010 están desbloqueados. Ambos pueden ejecutarse en paralelo.

## Estado actual de tests
```
apps/api/__tests__/services/projects.test.ts  — 3 tests ✓
apps/api/__tests__/services/sessions.test.ts  — 4 tests ✓
apps/api/__tests__/services/tasks.test.ts     — 2 tests ✓
Total: 9 tests en backend, 0 en frontend
```

## Próximo paso exacto (para `bash ralph/once.sh`)

Implementar **issue 009 — Recuperación de sesión huérfana**:

1. **Backend:** `DELETE /api/sessions/:id` → `SessionService.discard(id)` — elimina sin calcular duración, devuelve 204. Añadir ruta en `sessions.ts`.
2. **Frontend:** `api.sessions.discard(id)` en `api.ts`. Añadir `discard()` en `ActiveSessionContext`.
3. **Frontend:** Componente `OrphanSessionDialog.tsx` — se muestra al montar si hay sesión activa (siempre, o después de umbral de tiempo). Muestra: tiempo transcurrido, nombre del proyecto. Botones: "Terminar ahora" (llama `stop()`) y "Descartar" (llama `discard()`).
4. **Necesita:** el nombre del proyecto en la sesión activa → `GET /api/sessions/active` debe incluir `project.name`. Extender `SessionService.getActive()` con `include: { project: { select: { name: true } } }`.
5. **Shared types:** Añadir `StudySessionWithProject extends StudySession { projectName: string }`.
6. **Tests:** `SessionService.discard` — 404 si no existe, ok:true si existe.
7. Mover `issues/009-recuperacion-sesion-huerfana.md` a `issues/done/`.

Issue 010 puede seguir inmediatamente después (solo agrega `GET /api/projects/:id/sessions` con filtro `endedAt != null` y la pestaña Sesiones en ProjectPage).

---

# Handoff — Sesión 5 (2026-05-26)

## Proyecto
**Administración de Estudio** — App web para gestionar proyectos académicos (materias, cursos online, side projects), tareas y sesiones de estudio cronometradas. Monorepo TypeScript.

## Stack técnico
- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui + TanStack Query + React Router + Sonner
- **Backend:** Node.js + Express + Prisma ORM + PostgreSQL (Supabase)
- **Testing:** Vitest — 13 tests pasando (3 archivos de backend: projects, tasks, sessions)
- **Shared types:** `packages/shared/src/index.ts` — `Project`, `ProjectWithProgress`, `Task`, `StudySession`, `StudySessionWithProject`, enums

## Lo que se construyó en esta sesión

### Issue 009 — Recuperación de sesión huérfana
| Archivo | Cambio |
|---------|--------|
| `apps/api/src/services/sessions.ts` | `discard(id)` — elimina sin calcular duración (404 si no existe). `getActive()` y `create()` ahora incluyen `project.name` via Prisma `include`, mapeado a `projectName` flat. |
| `apps/api/src/routes/sessions.ts` | Añade `DELETE /:id` → `sessionService.discard()` con status 204 |
| `apps/api/src/__tests__/services/sessions.test.ts` | 3 tests nuevos: `discard` 404, `discard` ok (verifica que no llama `update`), `getActive` incluye `projectName`. Mock de `create` actualizado con `project.name`. |
| `packages/shared/src/index.ts` | Añade `StudySessionWithProject extends StudySession { projectName: string }` |
| `apps/web/src/lib/api.ts` | `api.sessions.getActive/create/close` tipados como `StudySessionWithProject`. Añade `api.sessions.discard(id)`. |
| `apps/web/src/contexts/ActiveSessionContext.tsx` | Añade `discard()`, `showOrphanDialog`, `dismissOrphanDialog`. Detecta sesión huérfana en primer load con dos refs (`initialCheckDone`, `startedLocally`). |
| `apps/web/src/components/OrphanSessionDialog.tsx` | **NUEVO** — Dialog con nombre de proyecto, tiempo transcurrido formateado, botones "Terminar ahora" y "Descartar sesión". |
| `apps/web/src/App.tsx` | Renderiza `<OrphanSessionDialog />` junto al Navbar (dentro de `ActiveSessionProvider`). |

## Decisiones arquitectónicas

### Detección huérfana con dos refs
- `initialCheckDone`: evita mostrar el dialog más de una vez por carga
- `startedLocally`: evita falso positivo cuando el usuario inicia una sesión en esta misma pestaña (el query se actualiza con `setQueryData` y sin el ref dispararía el diálogo al refrescar el `isLoading`)
- El diálogo se muestra si: `!isLoading && session && !startedLocally.current` en el primer ciclo

### `projectName` plano en lugar de `project.name` anidado
- `getActive()` y `create()` hacen `include: { project: { select: { name: true } } }` y luego desestructuran: `const { project, ...fields } = raw` → `{ ...fields, projectName: project.name }`
- Mantiene la forma del DTO plana, coherente con el resto de los tipos de shared

## Issues completados (`issues/done/`)
001, 002, 003, 004, 005, 006, 007, 008, **009** — todos en `issues/done/`

## Issues pendientes (en orden de prioridad)
| Issue | Descripción | Desbloqueado por |
|-------|-------------|-----------------|
| **010** | Historial de sesiones por proyecto — `GET /api/projects/:id/sessions` + pestaña Sesiones en `ProjectPage` | 008 ✓ |
| **011** | Dashboard — `DashboardService` con `weeklyHours`, `streak` (algoritmo de racha), progreso por proyecto | 007 ✓ + 010 |

El issue 012 es solo documentación RFC, ya implementado desde la sesión 4.

## Bloqueantes
- Ninguno. Issue 010 está totalmente desbloqueado.
- Issue 011 depende de 010 (para tener sesiones cerradas con `durationMinutes`).

## Estado actual de tests
```
apps/api/__tests__/services/projects.test.ts  — 3 tests ✓
apps/api/__tests__/services/sessions.test.ts  — 8 tests ✓
apps/api/__tests__/services/tasks.test.ts     — 2 tests ✓
Total: 13 tests backend, 0 frontend
```

## Próximo paso exacto (para `bash ralph/once.sh`)

Implementar **issue 010 — Historial de sesiones por proyecto**:

### Backend
1. `SessionService.listByProject(projectId)` — devuelve sesiones con `endedAt != null`, ordenadas por `startedAt` DESC. Devuelve 404 si el proyecto no existe.
2. `GET /api/projects/:id/sessions` en `routes/projects.ts` → `sendResult(res, await sessionService.listByProject(req.params.id))`
3. Tests: lista solo sesiones cerradas, orden descendente, 404 si proyecto no existe, lista vacía si no hay sesiones cerradas.

### Frontend
4. `api.sessions.listByProject(projectId)` en `api.ts` → `request<StudySession[]>(...)`
5. Hook `useSessions(projectId)` en `hooks/useSessions.ts` (o en `useTasks.ts` si se prefiere mismo archivo)
6. Función `formatDuration(minutes: number): string` — "X min" si < 60, "Xh Ymin" si ≥ 60
7. Función `formatSessionDate(dateStr: string): string` — "lunes 12 de mayo" (usar `Intl.DateTimeFormat`)
8. Reemplazar el placeholder en la pestaña "Sesiones" de `ProjectPage.tsx` con la lista real
9. Cada entrada: fecha, hora de inicio, duración formateada. Estado vacío: "Aún no hay sesiones registradas"

La pestaña ya existe en `ProjectPage.tsx` (línea ~118) con un placeholder de texto. Solo hay que reemplazarlo.
