# 011 — Dashboard con racha y horas semanales

## Parent PRD

`issues/prd.md`

## What to build

Implementar el dashboard completo: página `/dashboard` con tres secciones — horas totales de la semana, racha de días consecutivos estudiando, y progreso por proyecto.

Toda la lógica de cálculo vive en `DashboardService` en el backend y se expone en un único endpoint `GET /api/dashboard`. El frontend solo renderiza los datos recibidos.

**Reglas de cálculo (implementadas en `DashboardService`):**

- **Horas semanales:** suma de `durationMinutes` de todas las sesiones cerradas cuyo `startedAt` cae dentro de la semana actual (lunes a domingo del calendario), convertida a horas con un decimal.
- **Racha:** número de días calendario consecutivos (hacia atrás desde ayer) en los que el usuario tuvo al menos una sesión cerrada con `durationMinutes >= 10`. Si hoy ya tiene una sesión válida, se suma +1. La racha no se rompe por hoy si aún no se ha estudiado — solo se rompe si ayer no se cumplió el mínimo.
- **Progreso por proyecto:** para cada proyecto, el conteo de tareas COMPLETADAS sobre el total de tareas.

Este issue incluye los tests de Vitest más exhaustivos del proyecto, cubriendo los distintos escenarios de la racha y el cálculo semanal.

## Acceptance criteria

- [ ] `GET /api/dashboard` devuelve: `{ weeklyHours, streak, projects: [{ id, name, completedTasks, totalTasks }] }`
- [ ] `weeklyHours` es la suma de minutos de sesiones de la semana actual (lun–dom) convertida a horas (número con un decimal)
- [ ] `streak` es 0 si ayer no hubo sesión con `durationMinutes >= 10`
- [ ] `streak` cuenta hacia atrás desde ayer hasta el primer día sin sesión válida, y suma 1 si hoy ya tiene sesión válida
- [ ] Una sesión de menos de 10 minutos no cuenta para la racha ni para el día
- [ ] La página `/dashboard` es accesible desde el link "Dashboard" del Navbar
- [ ] La página muestra las horas semanales con su etiqueta (ej: "4.5 h esta semana")
- [ ] La página muestra la racha con su etiqueta (ej: "3 días consecutivos")
- [ ] La página muestra el progreso de cada proyecto con barra de progreso y conteo "X/Y tareas"
- [ ] **Test Vitest:** racha = 0 cuando no hay sesiones en absoluto
- [ ] **Test Vitest:** racha = 0 cuando ayer no tuvo sesión válida (aunque tenga sesiones más antiguas)
- [ ] **Test Vitest:** racha = N cuando los últimos N días tienen sesiones de ≥ 10 min (sin contar hoy)
- [ ] **Test Vitest:** racha = N+1 cuando los últimos N días tienen sesiones válidas y hoy también tiene una
- [ ] **Test Vitest:** una sesión de 9 minutos no suma al día ni a la racha
- [ ] **Test Vitest:** `weeklyHours` solo incluye sesiones de la semana actual (lun–dom), no de la semana anterior
- [ ] **Test Vitest:** `weeklyHours` = 0 si no hay sesiones esta semana
- [ ] **Test Vitest:** progreso por proyecto calcula correctamente con distintas combinaciones de status

## Blocked by

- Bloqueado por `issues/007-progreso-proyectos.md`
- Bloqueado por `issues/010-historial-sesiones-proyecto.md`

## User stories addressed

- User story 26 — Horas totales de la semana (lun–dom) en el dashboard
- User story 27 — Racha de días consecutivos estudiando
- User story 28 — Racha requiere mínimo 10 minutos de sesión por día
- User story 29 — Racha usa días calendario (medianoche como corte)
- User story 30 — Racha tolerante: no se rompe por el día en curso
- User story 31 — Progreso por proyecto en el dashboard
- User story 32 — Todos los cálculos del dashboard en el backend
