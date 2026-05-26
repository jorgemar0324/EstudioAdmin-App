export type Priority = 'BAJA' | 'MEDIA' | 'ALTA'
export type ProjectType = 'MATERIA' | 'CURSO_ONLINE' | 'SIDE_PROJECT'
export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA'

export interface Project {
  id: string
  name: string
  description: string | null
  type: ProjectType
  priority: Priority
  createdAt: string
}

export interface ProjectWithProgress extends Project {
  completedTasks: number
  totalTasks: number
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  createdAt: string
}

export interface StudySession {
  id: string
  projectId: string
  startedAt: string
  endedAt: string | null
  durationMinutes: number | null
}
