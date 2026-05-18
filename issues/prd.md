# PRD — Administracion_Estudio

## Problem Statement

Jorge, estudiante de Ingeniería de Software en semestre 6, no tiene un lugar centralizado donde ver todos sus proyectos de estudio activos y lo que le falta en cada uno. Sus tareas están dispersas entre cuadernos, chats de grupo y notas mentales. Cuando se sienta a estudiar, pierde entre 15 y 20 minutos solo decidiendo qué hacer. Además, no sabe cuánto tiempo real le está dedicando a cada materia ni si está avanzando de forma consistente a lo largo de la semana.

## Solution

Una aplicación web personal llamada **Administracion_Estudio** que centraliza tres necesidades en una sola interfaz:

1. **Gestor de proyectos y tareas:** Crear proyectos de estudio (materias, cursos online, side projects técnicos) con tareas dentro de cada uno, cada tarea con estado, prioridad y fecha límite.
2. **Timer de sesiones de estudio:** Cronometrar el tiempo dedicado a cada proyecto, con historial persistido por sesión.
3. **Dashboard de progreso:** Vista resumida de horas semanales, racha de días consecutivos estudiando, y avance por proyecto.

La app es estrictamente personal (sin login ni multi-usuario), sin gamificación, y sin integraciones externas.

## User Stories

### Proyectos

1. Como estudiante, quiero crear un proyecto de estudio con nombre, descripción opcional, tipo (MATERIA / CURSO_ONLINE / SIDE_PROJECT) y prioridad (BAJA / MEDIA / ALTA), para organizar mis actividades de estudio en categorías claras.
2. Como estudiante, quiero ver la lista de todos mis proyectos activos ordenados por prioridad (primero ALTA, luego MEDIA, luego BAJA) y por fecha de creación dentro de cada prioridad, para saber qué es más urgente de un vistazo.
3. Como estudiante, quiero ver en la tarjeta de cada proyecto una barra de progreso y el conteo "X/Y tareas completadas", para evaluar rápidamente cuánto me falta en cada uno.
4. Como estudiante, quiero editar el nombre, descripción, tipo y prioridad de un proyecto existente, para corregir información o actualizar su relevancia.
5. Como estudiante, quiero eliminar un proyecto con un diálogo de confirmación que me indique cuántas tareas y sesiones serán borradas, para evitar eliminaciones accidentales con impacto irreversible.
6. Como estudiante, quiero que al eliminar un proyecto se borren automáticamente todas sus tareas y sesiones asociadas, para no acumular datos huérfanos en la base de datos.
7. Como estudiante, quiero ver un mensaje motivador y un botón prominente "Crear tu primer proyecto" cuando no tengo ningún proyecto aún, para saber cómo empezar sin confusión.
8. Como estudiante, quiero que el formulario de creación y edición de proyectos se abra en un modal, para no perder el contexto visual de la lista mientras creo o edito.

### Tareas

9. Como estudiante, quiero crear una tarea dentro de un proyecto con título, descripción opcional, estado (PENDIENTE / EN_PROGRESO / COMPLETADA), prioridad (BAJA / MEDIA / ALTA) y fecha límite opcional, para planificar el trabajo dentro de cada proyecto.
10. Como estudiante, quiero ver las tareas de un proyecto agrupadas por estado (primero EN_PROGRESO, luego PENDIENTE, luego COMPLETADA), y dentro de cada grupo ordenadas por prioridad (ALTA primero), para saber exactamente por dónde continuar.
11. Como estudiante, quiero cambiar el estado de una tarea mediante un dropdown directamente en su tarjeta, para actualizar el avance sin abrir un modal.
12. Como estudiante, quiero que el dropdown de estado permita cualquier transición (incluyendo volver de COMPLETADA a PENDIENTE), para corregir estados sin restricciones arbitrarias.
13. Como estudiante, quiero editar todos los campos de una tarea existente desde el mismo modal reutilizado que uso para crear, para mantener una interfaz consistente.
14. Como estudiante, quiero eliminar una tarea con un diálogo de confirmación, para evitar borrados accidentales.
15. Como estudiante, quiero que la fecha límite de una tarea se muestre en rojo cuando ya venció y la tarea no está completada, para identificar urgencias de inmediato.
16. Como estudiante, quiero ver un estado vacío claro cuando un proyecto no tiene tareas aún, con un botón para agregar la primera tarea.
17. Como estudiante, quiero que los errores de validación del formulario (campo requerido vacío, fecha inválida) aparezcan inline junto al campo correspondiente, para corregir el error sin perder el contexto.

### Timer de sesiones

18. Como estudiante, quiero iniciar una sesión de estudio vinculada a un proyecto con un botón "Iniciar sesión", para registrar cuándo comienzo a trabajar.
19. Como estudiante, quiero ver un contador de tiempo transcurrido en la barra de navegación global mientras haya una sesión activa, para saber cuánto llevo estudiando sin importar en qué página esté.
20. Como estudiante, quiero terminar una sesión activa desde el timer en el nav, para registrar el fin de mi sesión de estudio.
21. Como estudiante, quiero que al terminar una sesión se calcule y guarde automáticamente la duración en minutos, para tener el historial preciso sin intervención manual.
22. Como estudiante, quiero que el contador del timer se calcule localmente en el frontend a partir de la hora de inicio guardada en el backend, para que el reloj funcione con precisión sin hacer peticiones constantes al servidor.
23. Como estudiante, quiero que si abro la app y hay una sesión que quedó abierta (sin terminar), se me muestre un diálogo preguntándome si quiero terminarla ahora o descartarla, para no acumular sesiones huérfanas con duraciones incorrectas.
24. Como estudiante, quiero ver el historial de sesiones de un proyecto en una pestaña "Sesiones" dentro de la página del proyecto, con fecha, hora de inicio y duración de cada sesión, para revisar mi historial de trabajo en esa materia o proyecto.
25. Como estudiante, quiero que solo pueda haber una sesión activa a la vez en toda la app, para evitar registros duplicados o inconsistentes.

### Dashboard

26. Como estudiante, quiero ver en el dashboard el total de horas estudiadas en la semana actual (lunes a domingo), para evaluar mi dedicación semanal.
27. Como estudiante, quiero ver en el dashboard mi racha actual de días consecutivos estudiando, para mantener el hábito visible.
28. Como estudiante, quiero que la racha cuente un día como estudiado solo si completé al menos una sesión de 10 minutos o más ese día calendario, para que la racha refleje estudio real.
29. Como estudiante, quiero que la racha use días calendario (medianoche como corte), para que el comportamiento sea predecible e intuitivo.
30. Como estudiante, quiero que la racha sea "tolerante": si hoy aún no estudié, la racha no se rompe — se rompe si ayer no cumplí el mínimo, para no castigar el día en curso.
31. Como estudiante, quiero ver en el dashboard el progreso de cada proyecto (tareas completadas vs. total), para tener una vista consolidada de todos mis avances sin entrar a cada proyecto.
32. Como estudiante, quiero que todos los cálculos del dashboard (horas semanales, racha, progreso por proyecto) se calculen en el backend y se entreguen en un solo endpoint, para mantener la lógica centralizada.

### Navegación y UX general

33. Como estudiante, quiero una barra de navegación con dos links: "Proyectos" y "Dashboard", para moverme entre las secciones principales de la app.
34. Como estudiante, quiero que la página de inicio (`/`) muestre la lista de proyectos, para llegar directo a lo que más uso sin pasos extra.
35. Como estudiante, quiero que al hacer clic en un proyecto se abra su página dedicada con sus tareas, para ver el detalle sin recargar toda la app.
36. Como estudiante, quiero que la página de un proyecto tenga dos pestañas — "Tareas" y "Sesiones" — para acceder a ambas vistas sin salir del contexto del proyecto.
37. Como estudiante, quiero que las confirmaciones de acciones exitosas (tarea creada, sesión terminada, proyecto borrado) aparezcan como toast notifications que desaparecen solas, para recibir feedback sin interrumpir el flujo.
38. Como estudiante, quiero que los errores de red (fallo al guardar, error del servidor) también aparezcan como toasts, para saber que algo salió mal sin que la app se congele.

## Implementation Decisions

### Arquitectura general

- Monorepo con npm workspaces: `apps/web` (frontend), `apps/api` (backend), `packages/shared` (tipos TypeScript compartidos).
- TypeScript en frontend y backend.
- Deploy local por ahora — sin configuración de producción en esta fase.

### Stack tecnológico

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui + TanStack Query
- **Backend:** Node.js + Express (API REST)
- **ORM:** Prisma
- **Base de datos:** PostgreSQL alojado en Supabase (conexión directa vía `DATABASE_URL`, sin Supabase SDK)
- **Testing:** Vitest

### Modelo de datos

- `Project` — `{ id, name, description, type (MATERIA|CURSO_ONLINE|SIDE_PROJECT), priority (BAJA|MEDIA|ALTA), createdAt }`
- `Task` — `{ id, projectId, title, description, status (PENDIENTE|EN_PROGRESO|COMPLETADA), priority (BAJA|MEDIA|ALTA), dueDate, createdAt }`
- `StudySession` — `{ id, projectId, startedAt, endedAt (null si activa), durationMinutes (null si activa) }`
- Borrado en cascada: al eliminar un `Project`, se eliminan sus `Task`s y `StudySession`s automáticamente (`onDelete: Cascade` en Prisma).
- Sin subtareas. Sin modelo de usuario.

### API REST

- Sin versionado en la URL: `/api/...` (no `/api/v1/...`).
- Endpoints principales:
  - `GET/POST /api/projects`
  - `GET/PATCH/DELETE /api/projects/:id`
  - `GET/POST /api/projects/:id/tasks`
  - `PATCH/DELETE /api/tasks/:id`
  - `POST /api/projects/:id/sessions` — inicia sesión (crea con `startedAt`, `endedAt: null`)
  - `PATCH /api/sessions/:id` — cierra sesión (asigna `endedAt` y calcula `durationMinutes`)
  - `GET /api/sessions/active` — devuelve la sesión activa actual (si existe)
  - `GET /api/projects/:id/sessions` — historial de sesiones de un proyecto
  - `GET /api/dashboard` — devuelve horas semanales, racha, y progreso por proyecto

### Módulos backend

- **ProjectService:** CRUD de proyectos. Lógica de orden (prioridad → fecha de creación) se aplica en la query.
- **TaskService:** CRUD de tareas. Lógica de orden (status → prioridad) se aplica en la query.
- **SessionService:** Crear sesión, cerrar sesión (calcula `durationMinutes = endedAt - startedAt`), detectar sesión activa huérfana, validar que solo exista una sesión activa a la vez.
- **DashboardService:** Calcula horas de la semana actual (lun–dom), racha (tolerante, mínimo 10 min, días calendario), y progreso por proyecto. Lógica encapsulada, sin que el controlador conozca los detalles.

### Módulos frontend

- **Navbar:** Muestra links a Proyectos y Dashboard. Cuando hay sesión activa, muestra el timer con contador local (`setInterval` desde `startedAt`) y botón de terminar.
- **ProjectList:** Lista de proyectos con tarjetas que incluyen barra de progreso, tipo, prioridad, y botones de editar/borrar.
- **ProjectPage:** Página con dos pestañas: Tareas y Sesiones. Botón de "Iniciar sesión" cuando no hay sesión activa.
- **TaskCard:** Muestra título, prioridad, fecha límite (en rojo si vencida), y dropdown de estado.
- **ProjectFormModal:** Modal reutilizado para crear y editar proyectos (prop `project` o `null`).
- **TaskFormModal:** Modal reutilizado para crear y editar tareas.
- **DeleteConfirmDialog:** Dialog genérico de confirmación con mensaje personalizable (incluye conteo de elementos a borrar).
- **Dashboard:** Vista con horas semanales, racha, y lista de progreso por proyecto.

### Lógica del timer en frontend

- Al iniciar la app, se consulta `GET /api/sessions/active`.
- Si hay sesión activa, el Navbar muestra el timer calculando `Date.now() - startedAt` en un `setInterval` de 1 segundo.
- Si la sesión activa tiene más de N minutos sin interacción detectada (sesión huérfana reconocida por el usuario), se muestra el dialog de recuperación.
- La lógica del timer vive en un custom hook `useActiveSession`.

### Racha — regla exacta

- Se calcula en backend al servir `GET /api/dashboard`.
- Un día cuenta si tiene al menos una sesión con `durationMinutes >= 10`.
- La racha se evalúa hacia atrás desde ayer: si ayer no cumplió → racha = 0. Si ayer cumplió, se cuenta hacia atrás hasta encontrar el primer día sin sesión válida.
- Si hoy ya tiene sesión válida, se suma +1 al resultado.

## Testing Decisions

### Qué hace un buen test en este proyecto

- Testea comportamiento externo observable (lo que devuelve una función o un endpoint), no detalles de implementación internos.
- No requiere una base de datos real — la lógica de negocio se prueba en aislamiento con datos en memoria o mocks mínimos de Prisma.
- No prueba que Prisma guarda en la DB (eso es responsabilidad de Prisma) — prueba que la lógica de negocio produce el resultado correcto dados ciertos datos de entrada.

### Módulos a testear con Vitest

- **DashboardService** — el más crítico. Testear: cálculo de horas semanales con sesiones en distintos días, cálculo de racha con distintos escenarios (racha activa, racha rota, racha con hoy cumplido, racha con huérfanas cortas), progreso por proyecto con distintos estados de tareas.
- **SessionService** — testear: validación de sesión única activa (error si ya existe una), cálculo correcto de `durationMinutes` al cerrar, detección de sesión huérfana.
- **TaskService** — testear: orden de tareas (status → prioridad) producido por la lógica de ordenamiento.
- **Componente TaskCard (React)** — testear que la fecha límite vencida se renderiza con clase de color rojo, y que el dropdown de estado dispara el callback correcto.

### Lo que no se testea

- Tests E2E (sin Playwright ni Cypress en esta fase).
- Tests contra la base de datos real de Supabase.
- Tests de componentes de formulario (demasiado acoplados a shadcn/ui internals).

## Out of Scope

- Login, autenticación o múltiples usuarios.
- Gamificación (badges, puntos, logros).
- Integraciones externas (Google Calendar, Notion, GitHub, etc.).
- Tablero Kanban — solo listas.
- Subtareas (las tareas son atómicas).
- Modo offline o sincronización.
- Notificaciones push o recordatorios.
- Modo mobile / responsive (diseñado para desktop).
- Deploy a producción en esta fase.
- Historial global de sesiones (solo por proyecto).
- Exportación de datos.

## Further Notes

- El orden de construcción recomendado es: (1) monorepo + schema + API de proyectos y tareas + frontend de lista y gestión de tareas, (2) timer de sesiones + historial por proyecto, (3) dashboard.
- La conexión a Supabase es directa vía `DATABASE_URL` — no se usa el SDK de Supabase ni sus APIs de auth/realtime.
- El campo `durationMinutes` se calcula y persiste en el backend al cerrar la sesión (no se recalcula en cada lectura), para que el historial sea inmutable.
- La sesión activa se detecta buscando registros con `endedAt IS NULL`. Al iniciar una nueva sesión, el backend valida que no exista otra activa y devuelve error 409 si la hay.
