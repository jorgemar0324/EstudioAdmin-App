import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Priority, ProjectType } from '@repo/shared'
import { api } from '@/lib/api'

const PROJECTS_KEY = ['projects'] as const

export function useProjects() {
  const { data, isLoading, isError } = useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: api.projects.list,
  })
  return { projects: data ?? [], isLoading, isError }
}

export function useProject(id: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.projects.getById(id!),
    enabled: !!id,
  })
  return { project: data, isLoading }
}

interface ProjectPayload {
  name: string
  description?: string
  type: ProjectType
  priority: Priority
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProjectPayload) => api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
      toast.success('Proyecto creado')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al crear proyecto')
    },
  })
  return { create: mutateAsync, isPending }
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectPayload> }) =>
      api.projects.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
      toast.success('Proyecto actualizado')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar proyecto')
    },
  })
  return { update: mutateAsync, isPending }
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
      toast.success('Proyecto eliminado')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar proyecto')
    },
  })
  return { remove: mutateAsync, isPending }
}
