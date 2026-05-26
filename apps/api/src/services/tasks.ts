import type { PrismaClient } from '@prisma/client'
import type { Priority, TaskStatus } from '@repo/shared'

const PRIORITY_ORDER: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 }
const STATUS_ORDER: Record<string, number> = { EN_PROGRESO: 0, PENDIENTE: 1, COMPLETADA: 2 }
const VALID_PRIORITIES: Priority[] = ['BAJA', 'MEDIA', 'ALTA']
const VALID_STATUSES: TaskStatus[] = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA']

type CreateTaskInput = {
  title?: string
  description?: string
  priority?: Priority
  status?: TaskStatus
  dueDate?: string | null
}

type UpdateTaskInput = {
  title?: string
  description?: string
  priority?: Priority
  status?: TaskStatus
  dueDate?: string | null
}

export class TaskService {
  constructor(private db: PrismaClient) {}

  async listByProject(projectId: string) {
    try {
      const project = await this.db.project.findUnique({ where: { id: projectId } })
      if (!project) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }
      const tasks = await this.db.task.findMany({ where: { projectId } })
      tasks.sort((a, b) => {
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        if (statusDiff !== 0) return statusDiff
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      })
      return { ok: true as const, data: tasks }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al obtener tareas' }
    }
  }

  async create(projectId: string, input: CreateTaskInput) {
    const { title, description, priority, status, dueDate } = input
    if (!title || title.trim() === '') return { ok: false as const, status: 400 as const, message: 'El título es requerido' }
    if (!priority || !VALID_PRIORITIES.includes(priority)) return { ok: false as const, status: 400 as const, message: 'Prioridad inválida' }
    if (status !== undefined && !VALID_STATUSES.includes(status)) return { ok: false as const, status: 400 as const, message: 'Estado inválido' }
    try {
      const project = await this.db.project.findUnique({ where: { id: projectId } })
      if (!project) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }
      const task = await this.db.task.create({
        data: {
          projectId,
          title: title.trim(),
          description: description?.trim() || null,
          priority,
          status: status ?? 'PENDIENTE',
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      })
      return { ok: true as const, data: task }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al crear tarea' }
    }
  }

  async delete(id: string) {
    try {
      const existing = await this.db.task.findUnique({ where: { id } })
      if (!existing) return { ok: false as const, status: 404 as const, message: 'Tarea no encontrada' }
      await this.db.task.delete({ where: { id } })
      return { ok: true as const, data: undefined }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al eliminar tarea' }
    }
  }

  async update(id: string, input: UpdateTaskInput) {
    const { title, description, priority, status, dueDate } = input
    if (title !== undefined && title.trim() === '') return { ok: false as const, status: 400 as const, message: 'El título no puede estar vacío' }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) return { ok: false as const, status: 400 as const, message: 'Prioridad inválida' }
    if (status !== undefined && !VALID_STATUSES.includes(status)) return { ok: false as const, status: 400 as const, message: 'Estado inválido' }
    try {
      const existing = await this.db.task.findUnique({ where: { id } })
      if (!existing) return { ok: false as const, status: 404 as const, message: 'Tarea no encontrada' }
      const updated = await this.db.task.update({
        where: { id },
        data: {
          ...(title !== undefined && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() || null }),
          ...(priority !== undefined && { priority }),
          ...(status !== undefined && { status }),
          ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        },
      })
      return { ok: true as const, data: updated }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al actualizar tarea' }
    }
  }
}
