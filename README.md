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

Este proyecto se desarrolla siguiendo el flujo del AI Engineer Workshop 2026:

1. **Client Brief** (`client-brief.md`) — punto de partida con la necesidad real
2. **`/grill-me`** — clarifica ambigüedades del brief antes de escribir código
3. **`/write-a-prd`** — genera `issues/prd.md` con los requerimientos estructurados
4. **`/prd-to-issues`** — parte el PRD en issues ejecutables (tracer bullets)
5. **Ralph loops** — el agente ejecuta issues con TDD (`./ralph/once.sh`)
6. **`/handoff`** — resumen de contexto entre sesiones (ver `handoffs.md`)
7. **`/improve-codebase-architecture`** — control arquitectónico cada 2-3 issues

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
