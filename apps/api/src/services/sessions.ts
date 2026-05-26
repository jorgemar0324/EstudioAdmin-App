import type { PrismaClient } from '@prisma/client'

export class SessionService {
  constructor(private db: PrismaClient) {}

  async getActive() {
    try {
      const session = await this.db.studySession.findFirst({ where: { endedAt: null } })
      return { ok: true as const, data: session }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al obtener sesión activa' }
    }
  }

  async create(projectId: string) {
    try {
      const project = await this.db.project.findUnique({ where: { id: projectId } })
      if (!project) return { ok: false as const, status: 404 as const, message: 'Proyecto no encontrado' }

      const active = await this.db.studySession.findFirst({ where: { endedAt: null } })
      if (active) return { ok: false as const, status: 409 as const, message: 'Ya existe una sesión activa' }

      const session = await this.db.studySession.create({ data: { projectId } })
      return { ok: true as const, data: session }
    } catch {
      return { ok: false as const, status: 500 as const, message: 'Error al crear sesión' }
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
