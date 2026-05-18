# Handoff — Administracion_Estudio

**Fecha:** 2026-05-18

---

## 1. Proyecto

**Administracion_Estudio** — app web personal para gestión de proyectos de estudio, timer de sesiones y dashboard de progreso. Sin login, sin multi-usuario, solo para uso personal de Jorge (estudiante Ingeniería de Software, semestre 6).

---

## 2. Stack técnico

| Capa | Tecnología |
|------|------------|
| Monorepo | npm workspaces (`apps/web`, `apps/api`, `packages/shared`) |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + React Router v6 |
| Backend | Node.js + Express + TypeScript (`tsx watch`) |
| ORM | Prisma v5.22 |
| Base de datos | PostgreSQL en Supabase (conexión directa, sin SDK de Supabase) |
| Testing | Vitest (aún no configurado — se añade en issues 005, 008, 011) |

---

## 3. Lo que se construyó (issue 001 — COMPLETO)

### Archivos creados

**Raíz:**
- `package.json` — workspaces + script `npm run dev` con concurrently
- `.gitignore`
- `.env.example` — template sin credenciales reales

**`packages/shared/src/index.ts`** — tipos TypeScript compartidos: `Priority`, `ProjectType`, `TaskStatus`, `Project`, `Task`, `StudySession`

**`apps/api/`:**
- `package.json`, `tsconfig.json`
- `prisma/schema.prisma` — 3 modelos: `Project`, `Task`, `StudySession` con `onDelete: Cascade`
- `prisma/migrations/20260518153312_init/` — migración aplicada en Supabase
- `src/index.ts` — Express app, CORS para localhost:5173, ruta `/api/projects`
- `src/lib/prisma.ts` — singleton PrismaClient
- `src/routes/projects.ts` — `GET /api/projects` con ordenamiento por prioridad (aplicado en capa de aplicación)
- `apps/api/.env` — credenciales reales de Supabase (NO commitear)

**`apps/web/`:**
- `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts` — alias `@` → `src/`, proxy `/api` → `localhost:3001`
- `tailwind.config.js` — CSS variables de shadcn/ui configuradas
- `postcss.config.js`, `index.html`
- `src/index.css` — `@tailwind` + variables CSS del tema shadcn
- `src/main.tsx` — entry point
- `src/App.tsx` — `QueryClientProvider` + `BrowserRouter` + rutas
- `src/lib/utils.ts` — función `cn()` (clsx + tailwind-merge)
- `src/lib/queryClient.ts` — TanStack Query client (staleTime 30s)
- `src/lib/api.ts` — función `api.projects.list()` (fetch con error handling)
- `src/components/Navbar.tsx` — links "Proyectos" y "Dashboard" con `NavLink` activo
- `src/components/ui/button.tsx` — componente Button de shadcn/ui
- `src/pages/ProjectsPage.tsx` — lista de proyectos con `ProjectCard` + estado vacío + loading/error states
- `src/pages/ProjectPage.tsx` — placeholder (ruta `/projects/:id` registrada)
- `src/pages/DashboardPage.tsx` — placeholder (ruta `/dashboard` registrada)

---

## 4. Decisiones arquitectónicas clave

| Decisión | Detalle |
|----------|---------|
| Ordenamiento proyectos | En capa de aplicación (no en SQL): `{ ALTA: 0, MEDIA: 1, BAJA: 2 }` — el enum Prisma tiene ALTA primero pero se prefirió no depender del orden interno de PostgreSQL |
| Supabase + Prisma | Schema usa `url` (pgBouncer puerto 6543) + `directUrl` (puerto 5432) — necesario para que migraciones funcionen a través del pooler |
| Password Supabase | Contraseña real: `MartiJuli2018*+` — URL-encoded en `.env` como `MartiJuli2018%2A%2B` |
| shadcn/ui | Configurado manualmente (sin CLI) — Button en `src/components/ui/button.tsx`. Toasts (Sonner) aún NO instalados — se necesitan en issue 002 |
| Alias `@` | Configurado en `tsconfig.app.json` (paths) y `vite.config.ts` (resolve.alias) |
| TypeScript | Limpio en ambos apps (`tsc --noEmit` sin errores) |

### Decisiones de diseño UX (de la sesión /grill-me — 20 decisiones)

1. Navegación por rutas separadas con React Router
2. Home `/` = lista de proyectos
3. Proyectos ordenados por prioridad ALTA→BAJA, luego `createdAt`
4. Tareas ordenadas: EN_PROGRESO → PENDIENTE → COMPLETADA, luego prioridad
5. Sesión huérfana: dialog pregunta "¿Terminas ahora o descartas?"
6. Racha: mínimo **10 minutos** de sesión por día calendario
7. "La semana" en dashboard = lunes a domingo (no rolling 7 días)
8. Borrado proyectos: cascada con dialog de confirmación mostrando conteo exacto
9. Tareas vencidas: fecha en **rojo**, sin cambiar posición en la lista
10. Progreso proyecto: barra de progreso (shadcn `Progress`) + texto "X/Y tareas"
11. Timer activo: en la **barra de navegación** global
12. Nav: solo "Proyectos" y "Dashboard" (historial de sesiones vive en pestaña del proyecto)
13. Historial sesiones: pestaña "Sesiones" dentro de `/projects/:id`
14. Crear/editar: modal reutilizable (prop `project` o `null`)
15. Modal reutilizado para crear y editar (mismo componente, pre-rellena si edita)
16. Feedback: errores de validación **inline** + éxitos/errores de red como **toasts**
17. Timer counter: `setInterval` local desde `startedAt` del backend (sin polling)
18. Cambio de estado de tarea: **dropdown** en la tarjeta
19. Estado vacío: mensaje motivador + botón "Crear tu primer proyecto"
20. Confirmación de borrado: dialog con conteo exacto de tareas y sesiones afectadas

---

## 5. Issues completados

| Issue | Estado |
|-------|--------|
| `001-monorepo-listar-proyectos.md` | ✅ COMPLETO |

---

## 6. Issues pendientes (en orden)

| Prioridad | Issue | Bloqueado por |
|-----------|-------|---------------|
| 1 | `002-crear-editar-proyectos.md` | 001 ✅ |
| 2 | `003-eliminar-proyecto.md` | 002 |
| 3 | `004-pagina-proyecto-listar-tareas.md` | 001 ✅ (paralelo a 002) |
| 4 | `005-crear-editar-tareas.md` | 004 |
| 5 | `006-cambiar-estado-eliminar-tareas.md` | 005 |
| 6 | `007-progreso-proyectos.md` | 006 |
| 7 | `008-iniciar-terminar-sesion.md` | 004 (paralelo a 002/003) |
| 8 | `009-recuperacion-sesion-huerfana.md` | 008 |
| 9 | `010-historial-sesiones-proyecto.md` | 008 |
| 10 | `011-dashboard.md` | 007 + 010 |

---

## 7. Bloqueantes

- **Ninguno activo.** Todo lo necesario para continuar con el issue 002 está listo.
- Recordar: antes de implementar issue 002, instalar **Sonner** (toasts) en `apps/web`: `npm install sonner --workspace=apps/web` y configurarlo en `App.tsx` (`<Toaster />`).

---

## 8. Próximo paso exacto

**Implementar issue 002: `issues/002-crear-editar-proyectos.md`**

Acciones concretas:
1. Instalar `sonner` en `apps/web` y agregar `<Toaster />` en `App.tsx`
2. Agregar `POST /api/projects` y `PATCH /api/projects/:id` en `apps/api/src/routes/projects.ts`
3. Crear `apps/web/src/components/ProjectFormModal.tsx` — modal reutilizable con `shadcn Dialog` que recibe `project: Project | null`
4. Actualizar `apps/web/src/lib/api.ts` con `api.projects.create()` y `api.projects.update()`
5. Conectar el botón "Crear tu primer proyecto" y el botón "Nuevo proyecto" en `ProjectsPage.tsx` para abrir el modal
6. Agregar botón de editar en `ProjectCard` que abre el modal pre-rellenado
7. Invalidar query `['projects']` tras guardar para refrescar la lista

**Para arrancar los servidores:**
```bash
# Desde la raíz del proyecto
npm run dev
# API en localhost:3001, frontend en localhost:5173
```
