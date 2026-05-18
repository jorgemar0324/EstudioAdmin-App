import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

const PRIORITY_ORDER: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 }

router.get('/', async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'asc' },
    })

    projects.sort((a, b) => {
      const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (diff !== 0) return diff
      return a.createdAt.getTime() - b.createdAt.getTime()
    })

    res.json(projects)
  } catch {
    res.status(500).json({ error: 'Error al obtener proyectos' })
  }
})

export default router
