import type { PrismaClient } from '@prisma/client'
import type { Priority, ProjectType } from '@repo/shared'

const PRIORITY_ORDER: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 }
const VALID_TYPES: ProjectType[] = ['MATERIA', 'CURSO_ONLINE', 'SIDE_PROJECT']
const VALID_PRIORITIES: Priority[] = ['BAJA', 'MEDIA', 'ALTA']

type ProjectInput = {
  name?: string
  description?: string
  type?: ProjectType
  priority?: Priority
}

export class ProjectService {
  constructor(private db: PrismaClient) {}

  async list() {
    try {
      const projects = await this.db.project.findMany({ orderBy: { createdAt: 'asc' } })
      projects.sort((a, b) => {
        const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (diff !== 0) return diff
        return a.createdAt.getTime() - b.createdAt.getTime()
      })
      return { ok: true as const, data: projects }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al obtener proyectos' }
    }
  }

  async getById(id: string) {
    try {
      const project = await this.db.project.findUnique({
        where: { id },
        include: { _count: { select: { tasks: true, sessions: true } } },
      })
      if (!project) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }
      return { ok: true as const, data: project }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al obtener proyecto' }
    }
  }

  async create(input: ProjectInput) {
    const { name, description, type, priority } = input
    if (!name || name.trim() === '') return { ok: false as const, status: 400 as const, message: 'El nombre es requerido' }
    if (!type || !VALID_TYPES.includes(type)) return { ok: false as const, status: 400 as const, message: 'Tipo de proyecto inválido' }
    if (!priority || !VALID_PRIORITIES.includes(priority)) return { ok: false as const, status: 400 as const, message: 'Prioridad inválida' }
    try {
      const project = await this.db.project.create({
        data: { name: name.trim(), description: description?.trim() || null, type, priority },
      })
      return { ok: true as const, data: project }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al crear proyecto' }
    }
  }

  async update(id: string, input: ProjectInput) {
    const { name, description, type, priority } = input
    if (name !== undefined && name.trim() === '') return { ok: false as const, status: 400 as const, message: 'El nombre no puede estar vacío' }
    if (type !== undefined && !VALID_TYPES.includes(type)) return { ok: false as const, status: 400 as const, message: 'Tipo de proyecto inválido' }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) return { ok: false as const, status: 400 as const, message: 'Prioridad inválida' }
    try {
      const existing = await this.db.project.findUnique({ where: { id } })
      if (!existing) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }
      const updated = await this.db.project.update({
        where: { id },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          ...(description !== undefined && { description: description.trim() || null }),
          ...(type !== undefined && { type }),
          ...(priority !== undefined && { priority }),
        },
      })
      return { ok: true as const, data: updated }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al actualizar proyecto' }
    }
  }

  async delete(id: string) {
    try {
      const existing = await this.db.project.findUnique({ where: { id } })
      if (!existing) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }
      await this.db.project.delete({ where: { id } })
      return { ok: true as const, data: undefined as void }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al eliminar proyecto' }
    }
  }
}
