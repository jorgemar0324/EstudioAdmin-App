# Administración Estudio

Aplicación web personal para gestionar proyectos de estudio, tareas y sesiones de trabajo. Desarrollada como proyecto integrador del curso de IA en generación de código, usando Claude Code como herramienta principal de desarrollo.

## ¿Qué hace?

- **Gestor de proyectos y tareas** — organiza materias, cursos online y side projects. Cada proyecto tiene tareas con estado (pendiente / en progreso / completada), prioridad y fecha límite. Las tarjetas de proyecto muestran una barra de progreso con el avance de tareas.
- **Timer de sesiones** — cronometra el tiempo dedicado a cada proyecto desde un botón en la página del proyecto. El Navbar muestra el contador en tiempo real y permite terminar la sesión. Al recargar la app con una sesión abierta, aparece un diálogo de recuperación.
- **Dashboard de progreso** — horas totales de la semana (lun–dom), racha de días consecutivos estudiando y avance por proyecto.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + React Router |
| UI | Tailwind CSS + shadcn/ui (Radix UI) |
| Estado servidor | TanStack Query (React Query) |
| Backend | Node.js + Express (API REST) |
| Base de datos | PostgreSQL vía Supabase |
| ORM | Prisma |
| Testing | Vitest |
| Lenguaje | TypeScript (monorepo compartido) |

## Estructura del proyecto

```
administracion-estudio/
├── apps/
│   ├── web/              # Frontend React + Vite
│   │   └── src/
│   │       ├── components/   # UI components (TaskCard, Navbar, OrphanSessionDialog…)
│   │       ├── contexts/     # ActiveSessionContext (timer + detección huérfana)
│   │       ├── hooks/        # useProjects, useTasks
│   │       ├── lib/          # api.ts, queryClient.ts
│   │       └── pages/        # ProjectsPage, ProjectPage, DashboardPage
│   └── api/              # Backend Node.js + Express
│       ├── src/
│       │   ├── routes/       # projects.ts, tasks.ts, sessions.ts
│       │   ├── services/     # ProjectService, TaskService, SessionService
│       │   └── lib/          # sendResult, serviceResult, prisma
│       └── prisma/
│           └── schema.prisma
├── packages/
│   └── shared/           # Tipos TypeScript compartidos (Project, Task, StudySession…)
├── issues/               # Issues ejecutables generados por /prd-to-issues
│   └── done/             # Issues completados
└── HANDOFF.md            # Bitácora de transferencia de contexto entre sesiones
```

## Cómo correr el proyecto

```bash
# Clonar el repo
git clone https://github.com/jorgemar0324/EstudioAdmin-App.git
cd EstudioAdmin-App

# Instalar todas las dependencias (workspaces)
npm install

# Configurar variables de entorno del backend
cp apps/api/.env.example apps/api/.env
# Editar apps/api/.env con las credenciales de Supabase

# Generar el cliente de Prisma
cd apps/api && npx prisma generate

# Correr migraciones de base de datos
npx prisma migrate dev

# Iniciar en desarrollo (frontend + backend en paralelo)
cd ../.. && npm run dev
```

La app estará disponible en `http://localhost:5173` y la API en `http://localhost:3001`.

## Variables de entorno

Crear `apps/api/.env` con:

```env
DATABASE_URL=postgresql://...     # URL de conexión pooled de Supabase
DIRECT_URL=postgresql://...       # URL directa de Supabase (para migraciones)
PORT=3001
```

## Tests

```bash
npm run test        # Ejecuta todos los tests (backend: 13 tests)
npm run typecheck   # Verifica tipos en api y web
```

## Flujo de trabajo con Claude Code

Este proyecto se desarrolla siguiendo el flujo del AI Engineer Workshop 2026. Cada paso usa una skill específica de Claude Code:

| Paso | Skill | Qué produjo en este proyecto |
|---|---|---|
| 1 | Brief | `client-brief.md` — necesidad real: centralizar tareas de estudio dispersas |
| 2 | `/grill-me` | Clarificó restricciones: sin login, sin Kanban, listas simples, stack definido |
| 3 | `/write-a-prd` | [`issues/prd.md`](issues/prd.md) — 38 user stories, decisiones de arquitectura y modelo de datos |
| 4 | `/prd-to-issues` | 11 issues ejecutables en `issues/` — uno por módulo funcional |
| 5 | `bash ralph/once.sh` | Agente autónomo que elige el próximo issue, implementa con TDD y commitea |
| 6 | `/handoff` | Resumen de contexto entre sesiones guardado en `HANDOFF.md` |

### Estado de issues

| Issue | Módulo | Estado |
|---|---|---|
| [001](issues/done/001-monorepo-listar-proyectos.md) | Monorepo + listar proyectos | ✅ Completado |
| [002](issues/done/002-crear-editar-proyectos.md) | Crear y editar proyectos | ✅ Completado |
| [003](issues/done/003-eliminar-proyecto.md) | Eliminar proyecto | ✅ Completado |
| [004](issues/done/004-pagina-proyecto-listar-tareas.md) | Página de proyecto + listar tareas | ✅ Completado |
| [005](issues/done/005-crear-editar-tareas.md) | Crear y editar tareas | ✅ Completado |
| [006](issues/done/006-cambiar-estado-eliminar-tareas.md) | Cambiar estado y eliminar tareas | ✅ Completado |
| [007](issues/done/007-progreso-proyectos.md) | Barra de progreso por proyecto | ✅ Completado |
| [008](issues/done/008-iniciar-terminar-sesion.md) | Iniciar y terminar sesión de estudio | ✅ Completado |
| [009](issues/done/009-recuperacion-sesion-huerfana.md) | Recuperación de sesión huérfana | ✅ Completado |
| [010](issues/010-historial-sesiones-proyecto.md) | Historial de sesiones por proyecto | 🔄 En progreso |
| [011](issues/011-dashboard.md) | Dashboard de progreso | ⏳ Pendiente |

## Autor

Jorge M. — Estudiante de Ingeniería de Software, semestre 6.
