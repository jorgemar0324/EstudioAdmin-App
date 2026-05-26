import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Priority, TaskStatus } from '@repo/shared'
import { api } from '@/lib/api'

export function useTasks(projectId: string, options?: { enabled?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => api.tasks.listByProject(projectId),
    enabled: !!projectId && (options?.enabled ?? true),
  })
  return { tasks: data ?? [], isLoading }
}

interface CreateTaskPayload {
  title: string
  description?: string
  priority: Priority
  status?: TaskStatus
  dueDate?: string | null
}

interface UpdateTaskPayload {
  title?: string
  description?: string
  priority?: Priority
  status?: TaskStatus
  dueDate?: string | null
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateTaskPayload }) =>
      api.tasks.create(projectId, data),
    onSuccess: (_task, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Tarea creada')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al crear tarea')
    },
  })
  return { create: mutateAsync, isPending }
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
      api.tasks.update(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Tarea actualizada')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar tarea')
    },
  })
  return { update: mutateAsync, isPending }
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) => api.tasks.delete(id),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Tarea eliminada')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar tarea')
    },
  })
  return { remove: mutateAsync, isPending }
}
