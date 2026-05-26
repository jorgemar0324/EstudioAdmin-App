import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { StudySession } from '@repo/shared'
import { api, ApiError } from '@/lib/api'

const SESSION_KEY = ['sessions', 'active'] as const

interface ActiveSessionContextValue {
  session: StudySession | null
  elapsedSeconds: number
  isLoading: boolean
  start: (projectId: string) => Promise<void>
  stop: () => Promise<void>
}

const ActiveSessionContext = createContext<ActiveSessionContextValue>({
  session: null,
  elapsedSeconds: 0,
  isLoading: false,
  start: async () => {},
  stop: async () => {},
})

export function ActiveSessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { data: session = null, isLoading } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: api.sessions.getActive,
    staleTime: Infinity,
  })

  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!session) {
      setElapsedSeconds(0)
      return
    }
    const startedAt = new Date(session.startedAt).getTime()
    const tick = () => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    tick()
    const intervalId = setInterval(tick, 1000)
    return () => clearInterval(intervalId)
  }, [session?.id])

  async function start(projectId: string) {
    try {
      const newSession = await api.sessions.create(projectId)
      queryClient.setQueryData(SESSION_KEY, newSession)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al iniciar sesión')
    }
  }

  async function stop() {
    if (!session) return
    try {
      await api.sessions.close(session.id)
      queryClient.setQueryData(SESSION_KEY, null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al terminar sesión')
    }
  }

  return (
    <ActiveSessionContext.Provider value={{ session, elapsedSeconds, isLoading, start, stop }}>
      {children}
    </ActiveSessionContext.Provider>
  )
}

export function useActiveSession() {
  return useContext(ActiveSessionContext)
}
