import type { Project, Task, Priority, ProjectType } from '@repo/shared'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

interface ProjectPayload {
  name: string
  description?: string
  type: ProjectType
  priority: Priority
}

export interface ProjectWithCount extends Project {
  _count: { tasks: number; sessions: number }
}

export const api = {
  projects: {
    list: () => request<Project[]>('/api/projects'),
    getById: (id: string) => request<ProjectWithCount>(`/api/projects/${id}`),
    create: (data: ProjectPayload) =>
      request<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ProjectPayload>) =>
      request<Project>(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `Error ${res.status}`)
      }
    },
  },
  tasks: {
    listByProject: (projectId: string) =>
      request<Task[]>(`/api/projects/${projectId}/tasks`),
  },
}
