import type { Project, Priority, ProjectType } from '@repo/shared'

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

export const api = {
  projects: {
    list: () => request<Project[]>('/api/projects'),
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
  },
}
