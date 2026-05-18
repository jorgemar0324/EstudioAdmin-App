---
name: project-admin-estudio
description: Decisiones técnicas acordadas para Administracion_Estudio, app personal de gestión de estudio
metadata:
  type: project
---

App web personal para gestión de proyectos de estudio con timer de sesiones y dashboard.

**Why:** Jorge no tiene un lugar centralizado para ver tareas pendientes por proyecto ni rastrear tiempo de estudio.

**Stack acordado:**
- Monorepo con npm workspaces: `apps/web`, `apps/api`, `packages/shared`
- TypeScript en frontend y backend
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + TanStack Query
- Backend: Node.js + Express + Prisma
- Base de datos: Postgres en Supabase (conexión directa vía DATABASE_URL, sin Supabase SDK)
- Testing: Vitest (unit tests de lógica backend + componentes React críticos, sin E2E, sin tests contra DB real)
- Deploy: solo local por ahora

**Modelo de datos:**
- `Project` { id, name, description, type (MATERIA|CURSO_ONLINE|SIDE_PROJECT), priority (BAJA|MEDIA|ALTA), createdAt }
- `Task` { id, projectId, title, description, status (PENDIENTE|EN_PROGRESO|COMPLETADA), priority (BAJA|MEDIA|ALTA), dueDate, createdAt }
- `StudySession` { id, projectId, startedAt, endedAt (null si activa), durationMinutes }
- Sin subtareas. Máximo 1 sesión activa a la vez.

**Decisiones clave:**
- Timer persistido en backend (POST al iniciar crea la sesión, PATCH al terminar la cierra)
- Racha: regla tolerante — se rompe si ayer no estudiaste (hoy aún tiene chance). Calculada en backend.
- Dashboard calculado en backend en `GET /api/dashboard`
- API sin versionado (`/api/...` no `/api/v1/...`)

**Fases de construcción:**
1. Core: monorepo + DB schema + API proyectos/tareas + frontend listado y gestión de tareas
2. Timer: endpoints de sesiones + UI con iniciar/detener + historial
3. Dashboard: endpoint + vista con horas semanales, racha, progreso por proyecto

**How to apply:** Usar estas decisiones como base al implementar cualquier parte de la app. No proponer alternativas ya descartadas.
