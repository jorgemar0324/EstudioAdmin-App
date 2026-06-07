import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectService } from '../../services/projects'

const makeProject = (id: string, priority: 'ALTA' | 'MEDIA' | 'BAJA') => ({
  id,
  name: `Proyecto ${id}`,
  description: null,
  type: 'MATERIA' as const,
  priority,
  createdAt: new Date('2024-01-01'),
})

const mockDb = {
  project: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}

describe('ProjectService.delete', () => {
  let service: ProjectService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ProjectService(mockDb as never)
  })

  it('devuelve 404 si el proyecto no existe', async () => {
    mockDb.project.findUnique.mockResolvedValue(null)

    const result = await service.delete('id-inexistente')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(404)
  })

  it('elimina el proyecto y devuelve ok cuando existe', async () => {
    const project = { ...makeProject('p1', 'ALTA') }
    mockDb.project.findUnique.mockResolvedValue(project)
    mockDb.project.delete.mockResolvedValue(project)

    const result = await service.delete('p1')

    expect(result.ok).toBe(true)
    expect(mockDb.project.delete).toHaveBeenCalledWith({ where: { id: 'p1' } })
  })
})

describe('ProjectService.list', () => {
  let service: ProjectService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ProjectService(mockDb as never)
  })

  it('ordena proyectos ALTA → MEDIA → BAJA', async () => {
    mockDb.project.findMany.mockResolvedValue([
      { ...makeProject('p-baja', 'BAJA'), tasks: [] },
      { ...makeProject('p-media', 'MEDIA'), tasks: [] },
      { ...makeProject('p-alta', 'ALTA'), tasks: [] },
    ])

    const result = await service.list()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data[0].id).toBe('p-alta')
    expect(result.data[1].id).toBe('p-media')
    expect(result.data[2].id).toBe('p-baja')
  })

  it('incluye completedTasks y totalTasks en cada proyecto', async () => {
    mockDb.project.findMany.mockResolvedValue([
      {
        ...makeProject('p1', 'MEDIA'),
        tasks: [
          { status: 'COMPLETADA' },
          { status: 'COMPLETADA' },
          { status: 'PENDIENTE' },
        ],
      },
    ])

    const result = await service.list()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data[0].completedTasks).toBe(2)
    expect(result.data[0].totalTasks).toBe(3)
  })

  it('devuelve 0/0 cuando el proyecto no tiene tareas', async () => {
    mockDb.project.findMany.mockResolvedValue([
      { ...makeProject('p1', 'MEDIA'), tasks: [] },
    ])

    const result = await service.list()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data[0].completedTasks).toBe(0)
    expect(result.data[0].totalTasks).toBe(0)
  })

  it('no expone el array tasks en la respuesta', async () => {
    mockDb.project.findMany.mockResolvedValue([
      { ...makeProject('p1', 'BAJA'), tasks: [{ status: 'PENDIENTE' }] },
    ])

    const result = await service.list()

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data[0]).not.toHaveProperty('tasks')
  })
})
