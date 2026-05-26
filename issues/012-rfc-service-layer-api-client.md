# RFC 012 — Service Layer (Backend) + API Client Pattern (Frontend)

## Problem

### Backend: `routes/projects.ts` mezcla cuatro responsabilidades

`apps/api/src/routes/projects.ts` (172 líneas) acumula en un solo archivo:

- **Validación inline** — `VALID_TYPES`, `VALID_PRIORITIES`, guardas de campo vacío (líneas 10–11, 40–53, 105–118)
- **Lógica de ordenamiento** — `PRIORITY_ORDER`, `STATUS_ORDER` definidos localmente, sort en JavaScript post-fetch en lugar de ORDER BY en base de datos (líneas 7–8, 19–23)
- **Acceso a Prisma** — `findMany`, `findUnique`, `create`, `update`, `delete` dispersos por el archivo
- **Respuestas HTTP** — `res.json`, `res.status`, manejo genérico de errores con un solo catch → 500

El riesgo concreto: las issues 005–011 añaden endpoints de tareas, sesiones y dashboard. Sin una frontera de capa, cada nuevo recurso replica este mismo patrón dentro del mismo archivo o crea un nuevo archivo con el mismo acoplamiento. Los tests requieren levantar un servidor Express y conectar a base de datos real — no hay forma de testear la lógica de sorting o validación de forma aislada.

### Frontend: `api.ts` no tiene convención para 12+ métodos nuevos

`apps/web/src/lib/api.ts` (52 líneas) expone solo endpoints de lectura para tareas. Las issues 005–011 necesitan ~12 métodos nuevos (crear/editar/eliminar tareas, iniciar/cerrar sesiones, dashboard). Sin un patrón establecido:

- Los desarrolladores no saben si añadir `api.tasks.create()` o `api.projects.createTask()`
- El caso `DELETE` (204 sin body) está implementado ad hoc por método
- No hay tipo de error — `catch` genérico en todo el cliente
- Los componentes repiten el mismo boilerplate de React Query (queryKey, invalidateQueries, toast) en cada pantalla

## Proposed Interface

### Backend — Servicios por dominio con `ServiceResult<T>`

Un archivo de servicio por recurso. Cada servicio recibe `PrismaClient` por constructor, posee toda la lógica de negocio, y devuelve un `ServiceResult<T>` tipado en lugar de lanzar excepciones.

```typescript
// apps/api/src/lib/serviceResult.ts
export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; status: 400 | 404 | 409 | 500; message: string }
```

```typescript
// apps/api/src/lib/sendResult.ts
import type { Response } from 'express'
import type { ServiceResult } from './serviceResult'

export function sendResult<T>(res: Response, result: ServiceResult<T>, successStatus = 200) {
  if (result.ok) return res.status(successStatus).json(result.data ?? null)
  return res.status(result.status).json({ error: result.message })
}
```

```typescript
// apps/api/src/services/projects.ts
import type { PrismaClient } from '@prisma/client'
import type { Project, Priority, ProjectType } from '@repo/shared'
import type { ServiceResult } from '../lib/serviceResult'

export interface ProjectWithCounts extends Project {
  taskCount: number
  sessionCount: number
}

export class ProjectService {
  constructor(private db: PrismaClient) {}

  list(): Promise<ServiceResult<Project[]>>
  getById(id: string): Promise<ServiceResult<ProjectWithCounts>>
  create(data: { name: string; type: ProjectType; priority: Priority; description?: string }): Promise<ServiceResult<Project>>
  update(id: string, data: Partial<{ name: string; type: ProjectType; priority: Priority; description: string }>): Promise<ServiceResult<Project>>
  delete(id: string): Promise<ServiceResult<void>>
}
```

```typescript
// apps/api/src/services/tasks.ts
import type { PrismaClient } from '@prisma/client'
import type { Task, Priority, TaskStatus } from '@repo/shared'
import type { ServiceResult } from '../lib/serviceResult'

export class TaskService {
  constructor(private db: PrismaClient) {}

  listByProject(projectId: string): Promise<ServiceResult<Task[]>>
  create(projectId: string, data: { title: string; priority: Priority; status?: TaskStatus; description?: string; dueDate?: string | null }): Promise<ServiceResult<Task>>
  update(id: string, data: Partial<{ title: string; priority: Priority; status: TaskStatus; description: string; dueDate: string | null }>): Promise<ServiceResult<Task>>
  delete(id: string): Promise<ServiceResult<void>>
}
```

```typescript
// apps/api/src/services/sessions.ts
import type { PrismaClient } from '@prisma/client'
import type { StudySession } from '@repo/shared'
import type { ServiceResult } from '../lib/serviceResult'

export class SessionService {
  constructor(private db: PrismaClient) {}

  getActive(): Promise<ServiceResult<StudySession | null>>
  start(projectId: string): Promise<ServiceResult<StudySession>>   // { ok: false, status: 409 } si ya hay sesión activa
  close(id: string): Promise<ServiceResult<StudySession>>           // calcula durationMinutes internamente
  discard(id: string): Promise<ServiceResult<void>>
  listByProject(projectId: string): Promise<ServiceResult<StudySession[]>>
}
```

```typescript
// apps/api/src/services/index.ts — singletons para producción
import prisma from '../lib/prisma'
import { ProjectService } from './projects'
import { TaskService } from './tasks'
import { SessionService } from './sessions'
import { DashboardService } from './dashboard'

export const projectService = new ProjectService(prisma)
export const taskService = new TaskService(prisma)
export const sessionService = new SessionService(prisma)
export const dashboardService = new DashboardService(prisma)
```

**Cómo queda una ruta después del refactor:**

```typescript
// apps/api/src/routes/projects.ts — completo
import { Router } from 'express'
import { projectService } from '../services'
import { sendResult } from '../lib/sendResult'

const router = Router()

router.get('/',       async (_req, res) => sendResult(res, await projectService.list()))
router.get('/:id',    async (req,  res) => sendResult(res, await projectService.getById(req.params.id)))
router.post('/',      async (req,  res) => sendResult(res, await projectService.create(req.body), 201))
router.patch('/:id',  async (req,  res) => sendResult(res, await projectService.update(req.params.id, req.body)))
router.delete('/:id', async (req,  res) => sendResult(res, await projectService.delete(req.params.id), 204))

export default router
```

**Lo que el servicio oculta:**

- `PRIORITY_ORDER` / `STATUS_ORDER` — sort por dos claves, ejecutado antes de devolver resultados
- Guardas de existencia (`findUnique` antes de update/delete) deduplicadas en métodos privados
- Validación de enums (`VALID_TYPES`, `VALID_PRIORITIES`) como constantes privadas del módulo
- Cálculo de `durationMinutes` en `SessionService.close()`
- Guard de sesión activa en `SessionService.start()` → 409 sin lanzar excepción

---

### Frontend — Hooks por dominio sobre un cliente de transporte plano

El `api.ts` actual queda como capa de transporte pura. Se le añade `ApiError` con `.status` para distinguir 409 de 400. Los hooks encapsulan todo el ciclo React Query.

```typescript
// apps/web/src/lib/api.ts — adición mínima
export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
  }
}
// El resto del archivo permanece igual — solo se añade ApiError y se usa en el catch del request helper
```

```typescript
// apps/web/src/hooks/useProjects.ts
import type { Project } from '@repo/shared'

export function useProjects(): { projects: Project[]; isLoading: boolean; isError: boolean }

export function useProject(id: string): { project: ProjectWithCounts | undefined; isLoading: boolean }

export function useCreateProject(): { create: (data: CreateProjectPayload) => Promise<Project>; isPending: boolean }

export function useUpdateProject(): { update: (id: string, data: UpdateProjectPayload) => Promise<Project>; isPending: boolean }

export function useDeleteProject(): { remove: (id: string) => Promise<void>; isPending: boolean }
```

```typescript
// apps/web/src/hooks/useTasks.ts
export function useTasks(projectId: string, options?: { enabled?: boolean }): {
  tasks: Task[]
  isLoading: boolean
}

export function useCreateTask(): { create: (projectId: string, data: CreateTaskPayload) => Promise<Task>; isPending: boolean }

export function useUpdateTask(): { update: (id: string, data: UpdateTaskPayload) => Promise<Task>; isPending: boolean }

export function useDeleteTask(): { remove: (id: string) => Promise<void>; isPending: boolean }
```

```typescript
// apps/web/src/hooks/useSessions.ts
export function useSessions(projectId: string): { sessions: StudySession[]; isLoading: boolean }

export function useActiveSession(): { session: StudySession | null; isLoading: boolean }

export function useStartSession(): { start: (projectId: string) => Promise<StudySession>; isPending: boolean }

export function useCloseSession(): { close: (id: string) => Promise<StudySession>; isPending: boolean }
```

**Cómo queda un componente:**

```tsx
// ProjectsPage.tsx — antes: ~80 líneas de query/mutation/toast/invalidation
// Después:
const { projects, isLoading } = useProjects()
const { remove } = useDeleteProject()   // toast + invalidateQueries ocurren dentro del hook
```

```tsx
// ProjectPage.tsx — antes: useQuery + queryKey manual + api import directo
// Después:
const { project } = useProject(id!)
const { tasks } = useTasks(id!, { enabled: activeTab === 'tareas' })
```

**Lo que los hooks ocultan:**

- Arrays de `queryKey` — los componentes nunca construyen `['tasks', id]` manualmente
- Todas las llamadas a `invalidateQueries` tras mutaciones
- `toast.success` / `toast.error` para cada resultado de API — un único lugar, mensajes consistentes
- La flag `enabled` para queries dependientes de tab activo
- El `useQueryClient()` — los componentes nunca lo importan directamente

## Dependency Strategy

**Categoría: Local-substitutable (backend) + In-process (frontend)**

**Backend:** `PrismaClient` es la única dependencia de los servicios. En tests, se inyecta un `PrismaClient` apuntando a SQLite en memoria (`file::memory:?cache=shared`) o se usa `vi.fn()` para mockear el cliente. No se necesita una capa Repository separada hasta que los tests demuestren que el mock de PrismaClient es insuficiente.

```typescript
// Test — sin servidor, sin base de datos real
const testDb = new PrismaClient({ datasourceUrl: 'file::memory:' })
const svc = new TaskService(testDb)

it('ordena EN_PROGRESO antes de PENDIENTE', async () => {
  await testDb.task.createMany({ data: [
    { title: 'A', status: 'PENDIENTE',   priority: 'ALTA', projectId: 'p1' },
    { title: 'B', status: 'EN_PROGRESO', priority: 'BAJA', projectId: 'p1' },
  ]})
  const result = await svc.listByProject('p1')
  expect(result.ok).toBe(true)
  if (result.ok) expect(result.data[0].status).toBe('EN_PROGRESO')
})
```

**Frontend:** Los hooks son lógica in-process pura (React + TanStack Query). Se testean con `renderHook` y un `QueryClientProvider` de prueba. El `api.ts` se mockea con `vi.mock('@/lib/api')`.

## Testing Strategy

**Nuevos boundary tests a escribir:**

- `ProjectService.list()` — devuelve proyectos ordenados por prioridad (ALTA → MEDIA → BAJA), luego por `createdAt`
- `TaskService.listByProject()` — devuelve tareas ordenadas (EN_PROGRESO > PENDIENTE > COMPLETADA), luego por prioridad
- `TaskService.create()` — falla con `{ ok: false, status: 404 }` si `projectId` no existe
- `SessionService.start()` — falla con `{ ok: false, status: 409 }` si ya hay sesión activa
- `SessionService.close()` — calcula `durationMinutes` correctamente; falla con 400 si ya estaba cerrada
- `ProjectService.delete()` — falla con 404 si proyecto no existe; devuelve `{ ok: true }` en caso válido

**Tests de hooks:**

- `useDeleteProject` — llama `invalidateQueries(['projects'])` al resolver; muestra `toast.error` con el mensaje del servidor en error 404

**Tests a eliminar cuando existan boundary tests:**

- No hay tests existentes (test suite vacía), así que no se elimina nada. Esta es la primera capa de tests reales.

**Entorno de test necesario:**

- Backend: SQLite en memoria vía Prisma (`datasourceUrl: env("DATABASE_URL")` apuntando a `file::memory:`) — requiere correr `prisma migrate deploy` antes de los tests
- Frontend: `@testing-library/react` + `renderHook` ya disponible con Vitest

## Implementation Recommendations

### Lo que cada módulo debe poseer

**`ProjectService` / `TaskService` / `SessionService`:**
- Toda constante de ordenamiento (`PRIORITY_ORDER`, `STATUS_ORDER`) como constante privada del módulo
- Toda validación de enums — el servicio es la única fuente de verdad sobre qué valores son válidos
- Toda lógica de negocio: guard de sesión activa, cálculo de duración, conteos de progreso

**Hooks (`useProjects`, `useTasks`, `useSessions`):**
- Definición de `queryKey` para su dominio — ningún componente define query keys manualmente
- Llamadas a `invalidateQueries` post-mutación
- Mensajes de `toast.success` / `toast.error` para outcomes de API
- Flag `enabled` para queries dependientes

### Lo que cada módulo debe ocultar

**Servicios:** Toda llamada a Prisma (incluyendo `include`, `_count`, `select` shapes); el detalle de si un 409 viene de "sesión activa" o "nombre duplicado".

**Hooks:** `useQueryClient()`, estructura interna de `queryKey`, detalle de qué keys invalidar tras cada mutación.

### Lo que cada módulo debe exponer

**Servicios:** Solo `ServiceResult<T>` — nunca lanzar excepciones por casos esperados (no encontrado, conflicto, validación). Excepciones solo para errores de infraestructura genuinamente inesperados.

**Hooks:** Exactamente lo que el componente necesita renderizar: `{ data, isLoading, isError }` para queries; `{ action, isPending }` para mutaciones. Sin exponer el objeto `UseMutationResult` completo.

### Cómo migrar los callers actuales

1. Crear `apps/api/src/lib/sendResult.ts` y `serviceResult.ts` — sin tocar nada existente
2. Crear `apps/api/src/services/projects.ts` extrayendo la lógica del route handler actual
3. Reemplazar el cuerpo de `apps/api/src/routes/projects.ts` con handlers de 1 línea
4. Verificar que los tests de integración manuales (Postman / curl) siguen pasando
5. Añadir `apps/web/src/hooks/useProjects.ts` con los hooks — sin tocar los componentes todavía
6. Migrar `ProjectsPage.tsx` y `ProjectPage.tsx` a los nuevos hooks (los `api.*` calls directos quedan como fallback legítimo para fetches imperativos one-off como el conteo antes del dialog de borrado)
7. Repetir el patrón para `TaskService` + `useTasks` antes de implementar issue 005

### Path de upgrade (cuando sea necesario)

Si los tests exigen mockear Prisma a nivel de interface (sin SQLite real), extraer:
```
apps/api/src/repositories/
  ProjectRepository.ts    ← interface
  PrismaProjectRepository.ts ← implementación
```
y hacer que `ProjectService` dependa de `ProjectRepository` en lugar de `PrismaClient`. Este cambio es aditivo — no modifica la interfaz pública del servicio.
