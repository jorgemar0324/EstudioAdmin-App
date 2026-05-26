# 001 — Monorepo + listar proyectos + pantalla de inicio

## Parent PRD

`issues/prd.md`

## What to build

Configurar el monorepo completo y entregar la primera pantalla funcional visible en el navegador: la lista de proyectos.

Esto incluye:
- Estructura de monorepo con npm workspaces (`apps/web`, `apps/api`, `packages/shared`)
- TypeScript configurado en ambas apps
- Schema de Prisma con los tres modelos (`Project`, `Task`, `StudySession`) y relaciones con borrado en cascada
- Conexión a la base de datos PostgreSQL en Supabase vía `DATABASE_URL`
- Endpoint `GET /api/projects` que devuelve los proyectos ordenados por prioridad (ALTA → MEDIA → BAJA) y luego por `createdAt`
- Frontend con React + Vite + Tailwind CSS + shadcn/ui configurados
- Navbar con links "Proyectos" y "Dashboard"
- Página de inicio `/` que muestra la lista de proyectos
- Estado vacío con mensaje motivador y botón "Crear tu primer proyecto" cuando no hay proyectos

Al terminar este issue, se puede abrir la app en el navegador, ver la lista vacía con el mensaje de bienvenida, y confirmar que el API responde correctamente.

## Acceptance criteria

- [ ] El monorepo arranca con un solo comando desde la raíz (`npm run dev`)
- [ ] `apps/api` conecta a Supabase y Prisma puede ejecutar migraciones sin errores
- [ ] `GET /api/projects` devuelve un array vacío `[]` cuando no hay proyectos
- [ ] `GET /api/projects` devuelve proyectos ordenados: primero ALTA, luego MEDIA, luego BAJA; dentro de cada prioridad, por `createdAt` ascendente
- [ ] La página `/` muestra el estado vacío con mensaje y botón "Crear tu primer proyecto" cuando no hay proyectos
- [ ] La página `/` muestra las tarjetas de proyectos cuando hay datos (verificable con seed o inserción manual en DB)
- [ ] El Navbar muestra los links "Proyectos" y "Dashboard" en todas las páginas
- [ ] No hay errores de TypeScript ni de consola al cargar la app
- [ ] El archivo `.env.example` documenta las variables necesarias (`DATABASE_URL`, `PORT`)

## Blocked by

Ninguno — puede iniciarse de inmediato.

## User stories addressed

- User story 2 — Lista de proyectos ordenada por prioridad
- User story 7 — Estado vacío con mensaje y botón prominente
- User story 33 — Navbar con links Proyectos y Dashboard
- User story 34 — Página de inicio muestra lista de proyectos
- User story 35 — Clic en proyecto abre su página (ruta configurada, aunque la página aún esté vacía)
