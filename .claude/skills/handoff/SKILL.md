---
name: handoff
description: Generate a compact context summary of the current session to preserve continuity across Claude Code sessions. Use when the user wants to save progress before closing, or when context window is getting large.
---

Generate an ultra-compact handoff summary of this session so the next Claude session can pick up exactly where we left off.

The summary must include:

1. **Proyecto** — nombre y descripción en una línea
2. **Stack técnico** — tecnologías confirmadas
3. **Lo que se construyó** — lista de componentes, archivos y módulos creados o modificados en esta sesión
4. **Decisiones arquitectónicas** — decisiones técnicas importantes que se tomaron y por qué
5. **Issues completados** — qué issues están en `issues/done/` o marcados como terminados
6. **Issues pendientes** — qué issues quedan por ejecutar, en orden de prioridad
7. **Bloqueantes** — cualquier problema sin resolver o dependencia pendiente
8. **Próximo paso exacto** — la acción concreta que debe ejecutarse al iniciar la siguiente sesión

Format the summary as a markdown document, concise but complete. The goal is that a fresh Claude session reading only this summary can continue working without asking clarifying questions.

Responde y comunícate en español en todo momento. El resumen debe estar escrito en español.
