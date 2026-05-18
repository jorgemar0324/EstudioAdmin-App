# Administración Estudio

Aplicación web personal para gestionar proyectos de estudio, tareas y sesiones de trabajo. Desarrollada como proyecto integrador del curso de IA en generación de código, usando Claude Code como herramienta principal de desarrollo.

## ¿Qué hace?

- **Gestor de proyectos y tareas** — organiza materias, cursos online y side projects. Agrega tareas con estado, prioridad y fecha límite dentro de cada proyecto.
- **Timer de sesiones** — cronometra el tiempo dedicado a cada proyecto. Historial de sesiones con fecha y duración.
- **Dashboard de progreso** — horas totales de la semana, racha de días consecutivos y avance por proyecto (tareas completadas vs. total).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express (API REST) |
| Base de datos | PostgreSQL vía Supabase |
| ORM | Prisma |
| Estilos | Tailwind CSS |
| Testing | Vitest |

Monorepo con frontend en `/client` y backend en `/server`.

## Cómo correr el proyecto

```bash
# Clonar el repo
git clone https://github.com/jorgemar0324/administracion-estudio.git
cd administracion-estudio

# Instalar dependencias (raíz, client y server)
npm install
cd client && npm install
cd ../server && npm install

# Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con las credenciales de Supabase

# Correr migraciones de base de datos
cd server && npx prisma migrate dev

# Iniciar en desarrollo
npm run dev  # desde la raíz
```

La app estará disponible en `http://localhost:5173`.

## Variables de entorno

Crear `server/.env` con:

```env
DATABASE_URL=postgresql://...    # URL de conexión de Supabase
PORT=3000
```

## Flujo de trabajo con Claude Code

Este proyecto se desarrolla siguiendo el flujo del AI Engineer Workshop 2026. A continuación se muestra cómo se aplicó cada paso en este proyecto específico:

| Paso | Skill | Qué produjo en este proyecto |
|---|---|---|
| 1 | Brief | [`client-brief.md`](client-brief.md) — necesidad real de Jorge: centralizar tareas de estudio dispersas |
| 2 | `/grill-me` | Clarificó restricciones clave: sin login, sin Kanban, listas simples, stack definido por el estudiante |
| 3 | `/write-a-prd` | [`issues/prd.md`](issues/prd.md) — 38 user stories, decisiones de arquitectura y modelo de datos |
| 4 | `/prd-to-issues` | 11 issues ejecutables en [`issues/`](issues/) — uno por módulo funcional (ver tabla abajo) |
| 5 | Ralph loops | Cada issue se ejecuta con TDD: test rojo → implementación → test verde |
| 6 | `/handoff` | Resumen de contexto entre sesiones guardado en [`handoffs.md`](handoffs.md) |
| 7 | `/improve-codebase-architecture` | Revisión arquitectónica cada 2-3 issues para mantener módulos profundos y bajo acoplamiento |

### Issues generados por `/prd-to-issues`

| Issue | Módulo | Estado |
|---|---|---|
| [001](issues/001-monorepo-listar-proyectos.md) | Monorepo + listar proyectos | Pendiente |
| [002](issues/002-crear-editar-proyectos.md) | Crear y editar proyectos | Pendiente |
| [003](issues/003-eliminar-proyecto.md) | Eliminar proyecto | Pendiente |
| [004](issues/004-pagina-proyecto-listar-tareas.md) | Página de proyecto + listar tareas | Pendiente |
| [005](issues/005-crear-editar-tareas.md) | Crear y editar tareas | Pendiente |
| [006](issues/006-cambiar-estado-eliminar-tareas.md) | Cambiar estado y eliminar tareas | Pendiente |
| [007](issues/007-progreso-proyectos.md) | Progreso por proyecto | Pendiente |
| [008](issues/008-iniciar-terminar-sesion.md) | Iniciar y terminar sesión de estudio | Pendiente |
| [009](issues/009-recuperacion-sesion-huerfana.md) | Recuperación de sesión huérfana | Pendiente |
| [010](issues/010-historial-sesiones-proyecto.md) | Historial de sesiones por proyecto | Pendiente |
| [011](issues/011-dashboard.md) | Dashboard de progreso | Pendiente |

## Estructura del proyecto

```
administracion-estudio/
├── client/               # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.tsx
│   └── package.json
├── server/               # Backend Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── issues/               # Issues generados por /prd-to-issues
│   └── done/
├── client-brief.md       # Brief original del proyecto
├── handoffs.md           # Bitácora de transferencia de contexto
└── README.md
```

## Issues abiertos

Los issues del proyecto se gestionan como archivos Markdown en `/issues/` y como GitHub Issues. Ver el tablero en la pestaña **Issues** del repositorio.

## Autor

Jorge M. — Estudiante de Ingeniería de Software, semestre 6.
