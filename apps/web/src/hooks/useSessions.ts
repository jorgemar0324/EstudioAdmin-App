import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useSessions(projectId: string, options?: { enabled?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['sessions', projectId],
    queryFn: () => api.sessions.listByProject(projectId),
    enabled: !!projectId && (options?.enabled ?? true),
  })
  return { sessions: data ?? [], isLoading }
}
