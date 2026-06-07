import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskService } from '../../services/tasks'

const mockDb = {
  task: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  project: {
    findUnique: vi.fn(),
  },
}

describe('TaskService.listByProject', () => {
  let service: TaskService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new TaskService(mockDb as never)
  })

  it('devuelve 404 si el proyecto no existe', async () => {
    mockDb.project.findUnique.mockResolvedValue(null)

    const result = await service.listByProject('p-inexistente')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(404)
  })

  it('ordena EN_PROGRESO > PENDIENTE > COMPLETADA', async () => {
    mockDb.project.findUnique.mockResolvedValue({ id: 'p1' })
    mockDb.task.findMany.mockResolvedValue([
      { id: 't1', title: 'A', status: 'COMPLETADA', priority: 'ALTA', projectId: 'p1', createdAt: new Date() },
      { id: 't2', title: 'B', status: 'EN_PROGRESO', priority: 'BAJA', projectId: 'p1', createdAt: new Date() },
      { id: 't3', title: 'C', status: 'PENDIENTE',   priority: 'MEDIA', projectId: 'p1', createdAt: new Date() },
    ])

    const result = await service.listByProject('p1')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data[0].status).toBe('EN_PROGRESO')
    expect(result.data[1].status).toBe('PENDIENTE')
    expect(result.data[2].status).toBe('COMPLETADA')
  })
})

describe('TaskService.create', () => {
  let service: TaskService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new TaskService(mockDb as never)
  })

  it('devuelve 404 si el proyecto no existe', async () => {
    mockDb.project.findUnique.mockResolvedValue(null)

    const result = await service.create('p-inexistente', { title: 'Tarea', priority: 'MEDIA' })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(404)
  })

  it('crea la tarea cuando el proyecto existe', async () => {
    const created = {
      id: 't-new', title: 'Tarea', status: 'PENDIENTE', priority: 'MEDIA',
      projectId: 'p1', description: null, dueDate: null, createdAt: new Date(),
    }
    mockDb.project.findUnique.mockResolvedValue({ id: 'p1' })
    mockDb.task.create.mockResolvedValue(created)

    const result = await service.create('p1', { title: 'Tarea', priority: 'MEDIA' })

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.id).toBe('t-new')
  })
})

describe('TaskService.delete', () => {
  let service: TaskService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new TaskService(mockDb as never)
  })

  it('devuelve 404 si la tarea no existe', async () => {
    mockDb.task.findUnique.mockResolvedValue(null)

    const result = await service.delete('id-inexistente')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(404)
  })

  it('elimina la tarea y devuelve ok cuando existe', async () => {
    const task = {
      id: 'task-1',
      title: 'Tarea de prueba',
      projectId: 'p1',
      status: 'PENDIENTE',
      priority: 'MEDIA',
      description: null,
      dueDate: null,
      createdAt: new Date(),
    }
    mockDb.task.findUnique.mockResolvedValue(task)
    mockDb.task.delete.mockResolvedValue(task)

    const result = await service.delete('task-1')

    expect(result.ok).toBe(true)
    expect(mockDb.task.delete).toHaveBeenCalledWith({ where: { id: 'task-1' } })
  })
})
