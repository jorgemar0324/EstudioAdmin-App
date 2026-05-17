# Mensaje de  Jorge M. (estudiante de Ingeniería de Software, semestre 6)


Llevo semanas hablando de "organizarme mejor" pero la verdad es que **no sé qué tengo pendiente ni por dónde empezar**. Tengo tareas en el cuaderno, otras en el chat del grupo, otras en mi cabeza. Cuando me siento a estudiar pierdo 20 minutos solo decidiendo qué hacer.

El problema real es que **no tengo un solo lugar donde ver todos los proyectos de estudio que tengo y lo que me falta de cada proyecto**. Y encima no sé cuánto tiempo le estoy dedicando ni si realmente estoy avanzando.

Lo que necesito es una app para mí mismo (y quizás para otros interesados despues) con esto:

**Lo principal — gestor de tareas por proyecto:**
- Crear proyectos de estudio (una materia, un curso online, un side project técnico, algo que quiera aprender).
- Dentro de cada proyecto, agregar tareas con título, descripción opcional, estado (pendiente / en progreso / completada) y fecha límite.
- Ver fácilmente qué tareas siguen, cuáles están en progreso y cuáles ya terminé.
- Poder priorizar proyectos y  tareas dentro de un proyecto.

**Lo secundario — registro de tiempo:**
- Cronometrar sesiones de estudio vinculadas a un proyecto: presionar "iniciar" cuando me siento, "terminar" cuando paro.
- Que quede el historial de sesiones con fecha, duración y proyecto asociado.

**Lo complementario — visibilidad general:**
- Un dashboard simple: horas totales de la semana, racha de días consecutivos estudiando, y progreso por proyecto (tareas completadas vs. total).
- Poder tener en un mismo lugar mis materias del semestre, cursos online que tomo por mi cuenta, y side projects técnicos.

**Lo que NO quiero:**
- Sin gamificación ni badges.
- Sin login ni múltiples usuarios por ahora — es solo para mí.
- Sin integraciones externas (calendarios, Notion, etc.).
- Sin tableros Kanban complicados — quiero listas simples que funcionen bien.

La app debe ser web, para abrir desde el computador mientras estudio.

> **Contexto técnico**
> Esta app se llamará **Administracion_Estudio**. Stack definido:
> - Frontend: React + Vite
> - Backend: Node.js + Express (API REST)
> - Base de datos: prostgres sql , va estar alojada en supabase (usar ORM)
> - Estilos: Tailwind CSS 
> - Testing: Vitest
>
> Monorepo con frontend y backend separados (buenas practicas de arquitectura). El gestor de tareas por proyecto es el módulo central — el resto de features (timer de sesiones, dashboard, rachas) se construyen encima de él. Arquitectura limpia pensada para escalar .