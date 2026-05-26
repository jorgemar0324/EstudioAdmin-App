import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SessionService } from '../../services/sessions'

const mockDb = {
  studySession: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  project: {
    findUnique: vi.fn(),
  },
}

describe('SessionService.create', () => {
  let service: SessionService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SessionService(mockDb as never)
  })

  it('devuelve 409 si ya existe una sesión activa', async () => {
    mockDb.project.findUnique.mockResolvedValue({ id: 'p1' })
    mockDb.studySession.findFirst.mockResolvedValue({ id: 'existing', endedAt: null })

    const result = await service.create('p1')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(409)
  })

  it('crea sesión si no hay ninguna activa', async () => {
    mockDb.project.findUnique.mockResolvedValue({ id: 'p1' })
    mockDb.studySession.findFirst.mockResolvedValue(null)
    const newSession = { id: 'new-session', projectId: 'p1', startedAt: new Date(), endedAt: null, durationMinutes: null }
    mockDb.studySession.create.mockResolvedValue(newSession)

    const result = await service.create('p1')

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.id).toBe('new-session')
  })
})

describe('SessionService.close', () => {
  let service: SessionService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SessionService(mockDb as never)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calcula durationMinutes correctamente', async () => {
    const startedAt = new Date('2024-01-01T10:00:00.000Z')
    const endedAt = new Date('2024-01-01T10:45:30.000Z') // 45.5 min → 46

    vi.useFakeTimers()
    vi.setSystemTime(endedAt)

    mockDb.studySession.findUnique.mockResolvedValue({
      id: 'session-1', projectId: 'p1', startedAt, endedAt: null, durationMinutes: null,
    })
    mockDb.studySession.update.mockResolvedValue({
      id: 'session-1', projectId: 'p1', startedAt, endedAt, durationMinutes: 46,
    })

    await service.close('session-1')

    expect(mockDb.studySession.update).toHaveBeenCalledWith({
      where: { id: 'session-1' },
      data: { endedAt: expect.any(Date), durationMinutes: 46 },
    })
  })

  it('devuelve 400 si la sesión ya estaba cerrada', async () => {
    mockDb.studySession.findUnique.mockResolvedValue({
      id: 'session-1', projectId: 'p1', startedAt: new Date(), endedAt: new Date(), durationMinutes: 30,
    })

    const result = await service.close('session-1')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(400)
  })
})
