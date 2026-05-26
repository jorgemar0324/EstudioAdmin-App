Handoff — Administracion_Estudio

1. Proyecto

App web personal para centralizar proyectos de estudio, gestión de tareas, timer de sesiones y dashboard de progreso semanal. Sin login, sin multi-usuario, para uso exclusivo de Jorge.

---
2. Stack técnico

┌───────────────────┬──────────────────────────────────────────────────────────┐
│       Capa        │                        Tecnología                        │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Monorepo          │ npm workspaces                                           │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Frontend          │ React + Vite + Tailwind CSS + shadcn/ui + TanStack Query │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Backend           │ Node.js + Express (API REST)                             │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ ORM               │ Prisma                                                   │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Base de datos     │ PostgreSQL en Supabase (solo DATABASE_URL, sin SDK)      │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Tipos compartidos │ packages/shared/src/index.ts                             │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Testing           │ Vitest                                                   │
└───────────────────┴──────────────────────────────────────────────────────────┘

---
3. Lo que se construyó (issues completados)

001 — Monorepo + listar proyectos (issues/done/001-monorepo-listar-proyectos.md)
- Estructura monorepo: apps/api, apps/web, packages/shared
- Schema Prisma con modelos Project, Task, StudySession
- GET /api/projects con orden por prioridad → fecha
- ProjectsPage con tarjetas, estado vacío motivador, Navbar con links

002 — Crear y editar proyectos (issues/done/002-crear-editar-proyectos.md)
- POST /api/projects y PATCH /api/projects/:id
- ProjectFormModal reutilizable (prop project | null)
- Validación inline + toasts de éxito/error

003 — Eliminar proyecto (issues/done/003-eliminar-proyecto.md)
- DELETE /api/projects/:id con cascada en Prisma
- DeleteConfirmDialog genérico con conteo de tareas y sesiones a borrar
- Toast de confirmación al borrar

004 — Página de proyecto con pestañas Tareas/Sesiones (issues/done/004-pagina-proyecto-listar-tareas.md)
- Ruta /projects/:id → ProjectPage
- Dos pestañas: "Tareas" y "Sesiones" (Sesiones aún es placeholder)
- GET /api/projects/:id/tasks con orden EN_PROGRESO → PENDIENTE → COMPLETADA, luego por prioridad ALTA → MEDIA → BAJA
- TaskCard con badge de status, badge de prioridad, fecha límite en rojo si vencida y no completada
- Estado vacío con botón "Añadir tarea" (botón sin conectar aún)

Vitest config (chore: add vitest config and test scripts) — scripts de test configurados, sin tests escritos aún.

---
4. Decisiones arquitectónicas clave

- Sin versionado de API: /api/... (no /api/v1/...)
- Orden de tareas en backend: La lógica de ordenamiento STATUS_ORDER y PRIORITY_ORDER vive en apps/api/src/routes/projects.ts — se aplica en memoria tras el findMany. El PRD especifica que debería estar en un TaskService dedicado, pero actualmente está inline en el router.
- ProjectWithCount: El endpoint GET /api/projects/:id ya incluye _count: { tasks, sessions } para mostrar datos del proyecto. El endpoint de lista (GET /api/projects) aún no incluye conteo de tareas (eso es el issue 007).
- Cascada de borrado: onDelete: Cascade en Prisma para tareas y sesiones al borrar un proyecto.
- Timer frontend: Calculado localmente con Date.now() - startedAt via setInterval (no implementado aún — issue 008).
- Racha tolerante: La lógica está definida en el PRD pero no implementada (issue 011/dashboard).
- packages/shared: Tipos Priority, ProjectType, TaskStatus, Project, Task, StudySession — usados tanto en frontend como backend.

---
5. Issues completados

┌─────┬────────────────────────────────────┬──────────────┐
│  #  │               Título               │  Ubicación   │
├─────┼────────────────────────────────────┼──────────────┤
│ 001 │ Monorepo + listar proyectos        │ issues/done/ │
├─────┼────────────────────────────────────┼──────────────┤
│ 002 │ Crear y editar proyectos           │ issues/done/ │
├─────┼────────────────────────────────────┼──────────────┤
│ 003 │ Eliminar proyecto                  │ issues/done/ │
├─────┼────────────────────────────────────┼──────────────┤
│ 004 │ Página de proyecto + listar tareas │ issues/done/ │
└─────┴────────────────────────────────────┴──────────────┘

---
6. Issues pendientes (en orden de prioridad)

┌─────┬──────────────────────────────────────────────┬───────────────┐
│  #  │                    Título                    │ Bloqueado por │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 005 │ Crear y editar tareas (TaskFormModal)        │ 004 ✅        │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 006 │ Cambiar estado y eliminar tareas             │ 005           │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 007 │ Barra de progreso en tarjetas de proyecto    │ 006           │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 008 │ Iniciar y terminar sesión de estudio         │ 007           │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 009 │ Recuperación de sesión huérfana              │ 008           │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 010 │ Historial de sesiones por proyecto           │ 008           │
├─────┼──────────────────────────────────────────────┼───────────────┤
│ 011 │ Dashboard (horas semanales, racha, progreso) │ 010           │
└─────┴──────────────────────────────────────────────┴───────────────┘

---
7. Bloqueantes

- Issue 005 no tiene endpoints de tareas en la API aún. El router apps/api/src/routes/projects.ts tiene GET /api/projects/:id/tasks pero no tiene POST /api/projects/:id/tasks ni PATCH /api/tasks/:id. El cliente apps/web/src/lib/api.ts solo tiene tasks.listByProject — faltan create, update, delete.
- La pestaña "Sesiones" en ProjectPage es un placeholder — muestra "próximamente" hasta que se implementen los issues 008–010.
- No hay ningún test escrito todavía — la config de Vitest está pero los archivos de test están vacíos o no existen.

---
8. Próximo paso exacto

Ejecutar issue 005 — Crear y editar tareas.

Pasos concretos al iniciar la sesión:

1. Backend: Agregar POST /api/projects/:id/tasks y PATCH /api/tasks/:id (y DELETE /api/tasks/:id si se quiere adelantar el 006) en apps/api/src/routes/projects.ts o extraerlos a un router apps/api/src/routes/tasks.ts separado.
2. Frontend api.ts: Agregar tasks.create(projectId, data) y tasks.update(id, data) en apps/web/src/lib/api.ts.
3. Frontend TaskFormModal: Crear apps/web/src/components/TaskFormModal.tsx — reutilizable para crear y editar (prop task | null). Campos: título (requerido), descripción, estado (Select), prioridad (Select), fecha límite (Input date).
4. Conectar botones: En ProjectPage.tsx (línea 113), el botón "Añadir tarea" debe abrir el modal. En TaskCard.tsx, agregar botón de editar que abra el modal pre-rellenado.
5. Tests Vitest: Función de ordenamiento de TaskService y renderizado de fecha vencida en TaskCard.