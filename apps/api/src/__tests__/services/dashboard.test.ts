import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DashboardService } from '../../services/dashboard'

const mockDb = {
  studySession: {
    findMany: vi.fn(),
  },
  project: {
    findMany: vi.fn(),
  },
}

// NOW = 2026-05-26T15:00:00.000Z (martes)
// yesterday = 2026-05-25, weekStart = 2026-05-25 (lunes), weekEnd = 2026-05-31
const NOW = new Date('2026-05-26T15:00:00.000Z')

function makeSession(dateStr: string, durationMinutes: number) {
  return {
    startedAt: new Date(`${dateStr}T10:00:00.000Z`),
    durationMinutes,
  }
}

describe('DashboardService — racha (streak)', () => {
  let service: DashboardService

  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.project.findMany.mockResolvedValue([])
    service = new DashboardService(mockDb as never)
  })

  it('racha = 0 cuando no hay sesiones', async () => {
    mockDb.studySession.findMany.mockResolvedValue([])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.streak).toBe(0)
  })

  it('racha = 0 cuando ayer no tuvo sesión válida aunque tenga sesiones más antiguas', async () => {
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-23', 60),
      makeSession('2026-05-24', 60),
      // 2026-05-25 (ayer) sin sesión
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.streak).toBe(0)
  })

  it('racha = N cuando los últimos N días tienen sesiones >= 10 min (sin contar hoy)', async () => {
    // Mayo 22 sin sesión → la racha se rompe ahí
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-23', 60),
      makeSession('2026-05-24', 60),
      makeSession('2026-05-25', 60), // ayer
      // hoy (26) sin sesión
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.streak).toBe(3)
  })

  it('racha = N+1 cuando los últimos N días tienen sesiones válidas y hoy también tiene una', async () => {
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-23', 60),
      makeSession('2026-05-24', 60),
      makeSession('2026-05-25', 60), // ayer
      makeSession('2026-05-26', 60), // hoy
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.streak).toBe(4)
  })

  it('una sesión de 9 minutos no suma al día ni a la racha', async () => {
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-25', 9), // ayer, inválida por ser < 10 min
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.streak).toBe(0)
  })

  it('solo cuenta días con sesión de exactamente 10 minutos o más', async () => {
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-25', 10), // ayer, exactamente el mínimo
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.streak).toBe(1)
  })
})

describe('DashboardService — horas semanales (weeklyHours)', () => {
  let service: DashboardService

  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.project.findMany.mockResolvedValue([])
    service = new DashboardService(mockDb as never)
  })

  it('weeklyHours = 0 si no hay sesiones esta semana', async () => {
    mockDb.studySession.findMany.mockResolvedValue([])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.weeklyHours).toBe(0)
  })

  it('weeklyHours solo incluye sesiones de la semana actual (lun–dom), no de la semana anterior', async () => {
    // Semana actual: lun 25 may – dom 31 may
    // Sesión del dom 24 may (semana anterior) NO debe contar
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-24', 120), // semana anterior → excluida
      makeSession('2026-05-25', 60),  // esta semana → incluida
      makeSession('2026-05-26', 30),  // esta semana → incluida
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    // 60 + 30 = 90 min = 1.5 h
    if (result.ok) expect(result.data.weeklyHours).toBe(1.5)
  })

  it('weeklyHours suma todos los minutos de la semana y los convierte a horas', async () => {
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-25', 45),
      makeSession('2026-05-26', 45),
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    // 90 min / 60 = 1.5 h
    if (result.ok) expect(result.data.weeklyHours).toBe(1.5)
  })

  it('weeklyHours redondea a un decimal', async () => {
    mockDb.studySession.findMany.mockResolvedValue([
      makeSession('2026-05-25', 100), // 100 min = 1.666... h → 1.7
    ])
    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.weeklyHours).toBe(1.7)
  })
})

describe('DashboardService — progreso por proyecto', () => {
  let service: DashboardService

  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.studySession.findMany.mockResolvedValue([])
    service = new DashboardService(mockDb as never)
  })

  it('calcula correctamente con distintas combinaciones de status', async () => {
    mockDb.project.findMany.mockResolvedValue([
      {
        id: 'p1', name: 'Matemáticas',
        tasks: [{ status: 'COMPLETADA' }, { status: 'COMPLETADA' }, { status: 'PENDIENTE' }],
      },
      {
        id: 'p2', name: 'Física',
        tasks: [{ status: 'EN_PROGRESO' }, { status: 'COMPLETADA' }],
      },
      {
        id: 'p3', name: 'Química',
        tasks: [],
      },
    ])

    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) {
      const { projects } = result.data
      expect(projects).toHaveLength(3)
      expect(projects[0]).toMatchObject({ id: 'p1', name: 'Matemáticas', completedTasks: 2, totalTasks: 3 })
      expect(projects[1]).toMatchObject({ id: 'p2', name: 'Física', completedTasks: 1, totalTasks: 2 })
      expect(projects[2]).toMatchObject({ id: 'p3', name: 'Química', completedTasks: 0, totalTasks: 0 })
    }
  })

  it('proyecto sin tareas tiene completedTasks = 0 y totalTasks = 0', async () => {
    mockDb.project.findMany.mockResolvedValue([
      { id: 'p1', name: 'Vacío', tasks: [] },
    ])

    const result = await service.get(NOW)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.projects[0]).toMatchObject({ completedTasks: 0, totalTasks: 0 })
    }
  })
})
