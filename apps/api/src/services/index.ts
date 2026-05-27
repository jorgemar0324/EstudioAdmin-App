import prisma from '../lib/prisma'
import { ProjectService } from './projects'
import { TaskService } from './tasks'
import { SessionService } from './sessions'
import { DashboardService } from './dashboard'

export const projectService = new ProjectService(prisma)
export const taskService = new TaskService(prisma)
export const sessionService = new SessionService(prisma)
export const dashboardService = new DashboardService(prisma)
