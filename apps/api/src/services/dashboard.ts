import type { PrismaClient } from '@prisma/client'
import type { DashboardData, DashboardProjectProgress } from '@repo/shared'
import type { ServiceResult } from '../lib/serviceResult'

function toUTCDateString(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addUTCDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function getWeekBounds(now: Date): { weekStart: Date; weekEnd: Date } {
  const day = now.getUTCDay() // 0=dom, 1=lun, ..., 6=sab
  const daysFromMonday = day === 0 ? 6 : day - 1

  const weekStart = new Date(now)
  weekStart.setUTCDate(now.getUTCDate() - daysFromMonday)
  weekStart.setUTCHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)
  weekEnd.setUTCHours(23, 59, 59, 999)

  return { weekStart, weekEnd }
}

type SessionRow = { startedAt: Date; durationMinutes: number | null }
type ProjectRow = { id: string; name: string; tasks: { status: string }[] }

function calcWeeklyHours(sessions: SessionRow[], now: Date): number {
  const { weekStart, weekEnd } = getWeekBounds(now)
  const totalMinutes = sessions
    .filter((s) => s.startedAt >= weekStart && s.startedAt <= weekEnd)
    .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0)
  return Math.round((totalMinutes / 60) * 10) / 10
}

function calcStreak(sessions: SessionRow[], now: Date): number {
  const validDays = new Set<string>()
  for (const s of sessions) {
    if ((s.durationMinutes ?? 0) >= 10) {
      validDays.add(toUTCDateString(s.startedAt))
    }
  }

  const todayStr = toUTCDateString(now)
  const yesterday = addUTCDays(now, -1)
  const yesterdayStr = toUTCDateString(yesterday)

  if (!validDays.has(yesterdayStr)) return 0

  let streak = 0
  let current = yesterday
  while (validDays.has(toUTCDateString(current))) {
    streak++
    current = addUTCDays(current, -1)
  }

  if (validDays.has(todayStr)) streak++

  return streak
}

function calcProjectProgress(projects: ProjectRow[]): DashboardProjectProgress[] {
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    completedTasks: p.tasks.filter((t) => t.status === 'COMPLETADA').length,
    totalTasks: p.tasks.length,
  }))
}

export class DashboardService {
  constructor(private db: PrismaClient) {}

  async get(now: Date = new Date()): Promise<ServiceResult<DashboardData>> {
    try {
      const [sessions, projects] = await Promise.all([
        this.db.studySession.findMany({
          where: { endedAt: { not: null } },
          select: { startedAt: true, durationMinutes: true },
        }),
        this.db.project.findMany({
          include: { tasks: { select: { status: true } } },
          orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        }),
      ])

      return {
        ok: true,
        data: {
          weeklyHours: calcWeeklyHours(sessions as SessionRow[], now),
          streak: calcStreak(sessions as SessionRow[], now),
          projects: calcProjectProgress(projects as ProjectRow[]),
        },
      }
    } catch {
      return { ok: false, status: 500, message: 'Error al obtener dashboard' }
    }
  }
}
