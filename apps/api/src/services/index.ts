import prisma from '../lib/prisma'
import { ProjectService } from './projects'
import { TaskService } from './tasks'
import { SessionService } from './sessions'

export const projectService = new ProjectService(prisma)
export const taskService = new TaskService(prisma)
export const sessionService = new SessionService(prisma)
