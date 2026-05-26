# Reporte de Control Arquitectónico — Administracion_Estudio

**Fecha:** 26 mayo 2026
**Skill utilizada:** `/improve-codebase-architecture`
**Issues completados antes del checkpoint:** 001, 002, 003, 004

---

## 1. Diagnóstico Inicial

Claude exploró libremente el repositorio (61 tool uses · 58.4k tokens · 3m 40s) e identificó 5 oportunidades de profundización arquitectónica:

### Oportunidad 1 — Backend Service Layer
**Archivo:** `apps/api/src/routes/projects.ts` (172 líneas)
**Problema:** Validación, lógica de ordenamiento, acceso a base de datos y manejo de respuestas HTTP conviven en un solo archivo. A medida que se agreguen tareas y sesiones, este archivo crecerá sin control.
**Impacto en tests:** Los tests de ordenamiento y validación requerirían levantar un servidor real en lugar de ser tests unitarios.

### Oportunidad 2 — Constantes de Dominio Dispersas
**Archivos:** `PRIORITY_LABELS`, `PRIORITY_COLORS`, `TYPE_LABELS`, `STATUS_LABELS`, `PRIORITY_ORDER`, `STATUS_ORDER` duplicados en `ProjectsPage.tsx`, `TaskCard.tsx` y `projects.ts`.
**Problema:** Agregar una nueva prioridad requeriría editar 6 archivos y el sistema de tipos no detectaría un olvido.

### Oportunidad 3 — ProjectsPage.tsx Hace Demasiado
**Archivo:** `apps/web/src/pages/ProjectsPage.tsx` (215 líneas)
**Problema:** Gestiona 5 campos de estado de dialogs, 3 mutaciones, 2 sub-componentes, 3 lookup tables y data fetching — todo en un mismo componente.

### Oportunidad 4 — API Client sin Patrón para Mutaciones
**Archivo:** `apps/web/src/lib/api.ts` (52 líneas, solo endpoints de lectura)
**Problema:** Los issues 005–011 requieren ~12 métodos nuevos. Sin una convención clara, cada desarrollador inventará su propia estructura.

### Oportunidad 5 — Duplicación de Patrón de Formularios
**Archivo:** `ProjectFormModal.tsx` manejando 5 `useState` por campo
**Problema:** El mismo patrón deberá copiarse al construir `TaskFormModal` en el issue 005, generando divergencia de validación entre formularios.

---

## 2. Componente Seleccionado para Profundización

Se seleccionaron las **Oportunidades 1 y 4 en combinación** por ser las que mayor riesgo representan para los issues 005–011:

- Sin un Service Layer claro, `projects.ts` crecerá a 400+ líneas al agregar endpoints de tareas y sesiones
- Sin un patrón de API Client, cada issue inventará su propia convención de mutaciones

---

## 3. Simulación de 3 Sub-agentes en Paralelo

Claude simuló 3 sub-agentes con restricciones de diseño radicalmente distintas:

---

### Sub-agente 1 — Interfaz Mínima (Command/Dispatch)

**Backend:** Un único método `execute(cmd: ProjectCommand)` con `action: 'list' | 'create' | 'delete' | ...`. Toda la lógica colapsa en un `switch`.

**Frontend:** Dos primitivos — `query<T>(path)` + `mutate<T>(path, { method, body })`, más un objeto `paths` como fuente única de URLs.

**Fortalezas:**
- Superficie mínima de API
- Agregar un endpoint nuevo no requiere archivos nuevos

**Debilidades:**
- Autocompletado pobre en IDE sin overloads complejos
- `execute({ action: 'create', name: '' })` es menos descubrible que `createProject({...})`
- El objeto `paths` requiere disciplina del caller

---

### Sub-agente 2 — Máxima Flexibilidad (Repository + Clases)

**Backend:** Stack completo — `Repository interface → PrismaXxxRepository → XxxService interface → XxxServiceImpl → container.ts`. Cada capa es independientemente intercambiable.

**Frontend:** Clase `ApiClient` con sub-clientes por recurso (`ProjectsClient`, `TasksClient`), cada método acepta `AbortSignal`, `ApiError` tipado con `.status`.

**Fortalezas:**
- Máxima testabilidad — se puede mockear Prisma sin servidor real
- Arquitectura que escala a equipos de 5+ desarrolladores

**Debilidades:**
- ~14 archivos nuevos antes de escribir una línea de lógica de negocio
- Overhead injustificado para un proyecto personal de un desarrollador

---

### Sub-agente 3 — Optimizado para el Caller Actual (Hooks)

**Backend:** Una clase `ProjectService` que agrupa todos los recursos. `ServiceResult<T>` como envelope. Helper `sendResult` que reduce cada ruta a 1 línea.

**Frontend:** Hooks pre-construidos (`useProjects`, `useCreateProject`, `useDeleteProject`) que encapsulan React Query, `invalidateQueries` y toasts en un solo lugar.

**Fortalezas:**
- Impacto inmediato máximo — componentes pasan de 50 líneas de boilerplate a 2
- El helper `sendResult` elimina todo el `try/catch` duplicado en rutas

**Debilidades:**
- Agrupar todos los recursos en un `ProjectService` replica el problema de `projects.ts` en 6 semanas
- Los hooks son opinados sobre mensajes de toast

---

## 4. Recomendación Híbrida Implementada

**Backend → estructura de Sub-agente 2 simplificada + `ServiceResult` de Sub-agente 3**

Separar por dominio (un archivo de servicio por recurso) pero sin la capa Repository todavía — los servicios llaman Prisma directamente. La capa Repository es el upgrade path cuando los tests lo exijan, no el punto de partida.

```
apps/api/src/
  lib/
    sendResult.ts        ← helper de 6 líneas, elimina try/catch duplicado
  services/
    projects.ts          ← ProjectService, solo proyectos
    tasks.ts             ← TaskService, solo tareas
    sessions.ts          ← SessionService, solo sesiones
    dashboard.ts         ← DashboardService
    index.ts             ← singletons exportados
  routes/
    projects.ts          ← 1 línea por handler
    tasks.ts
    sessions.ts
    dashboard.ts
```

**Frontend → hooks de Sub-agente 3 + `ApiError` de Sub-agente 2**

Los hooks pre-construidos son la decisión correcta para TanStack Query. `api.ts` queda como capa de transporte pura. Se agrega `ApiError` (con `.status`) para distinguir 409 de 400 sin parsear strings.

```
apps/web/src/
  lib/
    api.ts               ← transporte puro + clase ApiError
  hooks/
    useProjects.ts       ← useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject
    useTasks.ts          ← useTasks, useCreateTask, useUpdateTask, useDeleteTask
    useSessions.ts       ← useSessions, useStartSession, useEndSession
```

---

## 5. Justificación de la Solución Híbrida

| Alternativa descartada | Razón |
|---|---|
| Sub-agente 1 completo | `execute(cmd)` pierde descubribilidad en IDE. `taskService.createTask(id, data)` supera siempre a `execute({ action: 'create', ... })` |
| Sub-agente 2 completo | 14 archivos de boilerplate antes de lógica real. La capa Repository se justifica cuando los tests demuestran que necesitas mockear Prisma — no antes |
| Sub-agente 3 completo | Un `ProjectService` que agrupa proyectos + tareas + sesiones replica en 6 semanas el mismo problema que tiene `projects.ts` hoy |

---

## 6. RFC Generado

Claude generó el RFC completo en `issues/012-rfc-service-layer-api-client.md` con:

- Problema concreto con referencias a líneas exactas del código
- Firmas TypeScript completas para `ProjectService`, `TaskService`, `SessionService`, hooks de React y helpers `sendResult`/`ServiceResult`
- Estrategia de dependencias con constructor injection para tests
- 7 tests de frontera específicos a verificar tras la implementación
- Plan de migración de 7 pasos sin romper funcionalidad existente
- Path de upgrade hacia capa Repository cuando los tests lo exijan

---

## 7. Estado Post-Checkpoint

Todos los tests pasan (`vitest run --passWithNoTests`) antes y después del análisis. El RFC está listo para ejecutarse como issue 012 en el próximo ciclo de Ralph, **después** de completar los issues 005–011 que dependen de la arquitectura actual.
