import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { StudySessionWithProject } from '@repo/shared'
import { api, ApiError } from '@/lib/api'

const SESSION_KEY = ['sessions', 'active'] as const

interface ActiveSessionContextValue {
  session: StudySessionWithProject | null
  elapsedSeconds: number
  isLoading: boolean
  showOrphanDialog: boolean
  dismissOrphanDialog: () => void
  start: (projectId: string) => Promise<void>
  stop: () => Promise<void>
  discard: () => Promise<void>
}

const ActiveSessionContext = createContext<ActiveSessionContextValue>({
  session: null,
  elapsedSeconds: 0,
  isLoading: false,
  showOrphanDialog: false,
  dismissOrphanDialog: () => {},
  start: async () => {},
  stop: async () => {},
  discard: async () => {},
})

export function ActiveSessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { data: session = null, isLoading } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: api.sessions.getActive,
    staleTime: Infinity,
  })

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showOrphanDialog, setShowOrphanDialog] = useState(false)
  const initialCheckDone = useRef(false)
  const startedLocally = useRef(false)

  // Detectar sesión huérfana en el primer load
  useEffect(() => {
    if (!isLoading && !initialCheckDone.current) {
      initialCheckDone.current = true
      if (session && !startedLocally.current) {
        setShowOrphanDialog(true)
      }
    }
  }, [isLoading, session])

  // Timer local
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
      startedLocally.current = true
      setShowOrphanDialog(false)
      queryClient.setQueryData(SESSION_KEY, newSession)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al iniciar sesión')
    }
  }

  async function stop() {
    if (!session) return
    try {
      await api.sessions.close(session.id)
      setShowOrphanDialog(false)
      startedLocally.current = false
      queryClient.setQueryData(SESSION_KEY, null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al terminar sesión')
    }
  }

  async function discard() {
    if (!session) return
    try {
      await api.sessions.discard(session.id)
      setShowOrphanDialog(false)
      startedLocally.current = false
      queryClient.setQueryData(SESSION_KEY, null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al descartar sesión')
    }
  }

  function dismissOrphanDialog() {
    setShowOrphanDialog(false)
  }

  return (
    <ActiveSessionContext.Provider
      value={{ session, elapsedSeconds, isLoading, showOrphanDialog, dismissOrphanDialog, start, stop, discard }}
    >
      {children}
    </ActiveSessionContext.Provider>
  )
}

export function useActiveSession() {
  return useContext(ActiveSessionContext)
}
