import { Router } from 'express'
import type { Priority, ProjectType } from '@repo/shared'
import prisma from '../lib/prisma'

const router = Router()

const PRIORITY_ORDER: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 }

const VALID_TYPES: ProjectType[] = ['MATERIA', 'CURSO_ONLINE', 'SIDE_PROJECT']
const VALID_PRIORITIES: Priority[] = ['BAJA', 'MEDIA', 'ALTA']

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

router.post('/', async (req, res) => {
  try {
    const { name, description, type, priority } = req.body as {
      name?: string
      description?: string
      type?: ProjectType
      priority?: Priority
    }

    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'El nombre es requerido' })
      return
    }

    if (!type || !VALID_TYPES.includes(type)) {
      res.status(400).json({ error: 'Tipo de proyecto inválido' })
      return
    }

    if (!priority || !VALID_PRIORITIES.includes(priority)) {
      res.status(400).json({ error: 'Prioridad inválida' })
      return
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type,
        priority,
      },
    })

    res.status(201).json(project)
  } catch {
    res.status(500).json({ error: 'Error al crear proyecto' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: { select: { tasks: true, sessions: true } },
      },
    })
    if (!project) {
      res.status(404).json({ error: 'Proyecto no encontrado' })
      return
    }
    res.json(project)
  } catch {
    res.status(500).json({ error: 'Error al obtener proyecto' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, type, priority } = req.body as {
      name?: string
      description?: string
      type?: ProjectType
      priority?: Priority
    }

    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Proyecto no encontrado' })
      return
    }

    if (name !== undefined && name.trim() === '') {
      res.status(400).json({ error: 'El nombre no puede estar vacío' })
      return
    }

    if (type !== undefined && !VALID_TYPES.includes(type)) {
      res.status(400).json({ error: 'Tipo de proyecto inválido' })
      return
    }

    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      res.status(400).json({ error: 'Prioridad inválida' })
      return
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() || null }),
        ...(type !== undefined && { type }),
        ...(priority !== undefined && { priority }),
      },
    })

    res.json(updated)
  } catch {
    res.status(500).json({ error: 'Error al actualizar proyecto' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Proyecto no encontrado' })
      return
    }
    await prisma.project.delete({ where: { id } })
    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Error al eliminar proyecto' })
  }
})

export default router
