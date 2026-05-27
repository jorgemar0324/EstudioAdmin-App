import { useQuery } from '@tanstack/react-query'
import type { DashboardData } from '@repo/shared'
import { api } from '@/lib/api'

export function useDashboard() {
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard.get(),
    staleTime: 30_000,
  })
  return { dashboard: data, isLoading, isError }
}
