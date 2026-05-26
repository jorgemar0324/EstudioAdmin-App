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
