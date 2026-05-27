import type { PrismaClient } from '@prisma/client'

export class SessionService {
  constructor(private db: PrismaClient) {}

  async getActive() {
    try {
      const raw = await this.db.studySession.findFirst({
        where: { endedAt: null },
        include: { project: { select: { name: true } } },
      })
      if (!raw) return { ok: true as const, data: null }
      const { project, ...fields } = raw
      return { ok: true as const, data: { ...fields, projectName: project.name } }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al obtener sesión activa' }
    }
  }

  async create(projectId: string) {
    try {
      const exists = await this.db.project.findUnique({ where: { id: projectId } })
      if (!exists) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }

      const active = await this.db.studySession.findFirst({ where: { endedAt: null } })
      if (active) return { ok: false as const, status: 409 as const, message: 'Ya existe una sesión activa' }

      const raw = await this.db.studySession.create({
        data: { projectId },
        include: { project: { select: { name: true } } },
      })
      const { project, ...fields } = raw
      return { ok: true as const, data: { ...fields, projectName: project.name } }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al crear sesión' }
    }
  }

  async discard(id: string) {
    try {
      const session = await this.db.studySession.findUnique({ where: { id } })
      if (!session) return { ok: false as const, status: 404 as const, message: 'Sesión no encontrada' }
      await this.db.studySession.delete({ where: { id } })
      return { ok: true as const, data: undefined as void }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al descartar sesión' }
    }
  }

  async listByProject(projectId: string) {
    try {
      const exists = await this.db.project.findUnique({ where: { id: projectId } })
      if (!exists) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }

      const sessions = await this.db.studySession.findMany({
        where: { projectId, endedAt: { not: null } },
        orderBy: { startedAt: 'desc' },
      })
      return { ok: true as const, data: sessions }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al obtener sesiones' }
    }
  }

  async close(id: string) {
    try {
      const session = await this.db.studySession.findUnique({ where: { id } })
      if (!session) return { ok: false as const, status: 404 as const, message: 'Sesión no encontrada' }
      if (session.endedAt !== null) return { ok: false as const, status: 400 as const, message: 'La sesión ya está cerrada' }

      const endedAt = new Date()
      const durationMinutes = Math.round((endedAt.getTime() - session.startedAt.getTime()) / 60000)
      const updated = await this.db.studySession.update({
        where: { id },
        data: { endedAt, durationMinutes },
      })
      return { ok: true as const, data: updated }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al cerrar sesión' }
    }
  }
}
