import prisma from '../lib/prisma'
import { ProjectService } from './projects'
import { TaskService } from './tasks'

export const projectService = new ProjectService(prisma)
export const taskService = new TaskService(prisma)
