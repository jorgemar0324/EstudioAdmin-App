import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'

const ACTIVE_SESSION_KEY = ['sessions', 'active'] as const

export function useSessions(projectId: string, options?: { enabled?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['sessions', projectId],
    queryFn: () => api.sessions.listByProject(projectId),
    enabled: !!projectId && (options?.enabled ?? true),
  })
  return { sessions: data ?? [], isLoading }
}

export function useActiveSession() {
  const { data, isLoading } = useQuery({
    queryKey: ACTIVE_SESSION_KEY,
    queryFn: api.sessions.getActive,
    staleTime: 30_000,
  })
  return { session: data ?? null, isLoading }
}

export function useStartSession() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (projectId: string) => api.sessions.create(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_KEY })
      queryClient.invalidateQueries({ queryKey: ['sessions', projectId] })
      toast.success('Sesión iniciada')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al iniciar sesión')
    },
  })
  return { start: mutateAsync, isPending }
}

export function useCloseSession() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => api.sessions.close(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_KEY })
      queryClient.invalidateQueries({ queryKey: ['sessions', data.projectId] })
      toast.success('Sesión cerrada')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error al cerrar sesión')
    },
  })
  return { close: mutateAsync, isPending }
}
