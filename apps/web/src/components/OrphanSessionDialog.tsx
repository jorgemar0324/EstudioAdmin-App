import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useActiveSession } from '@/contexts/ActiveSessionContext'

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m} min`
}

export function OrphanSessionDialog() {
  const { session, elapsedSeconds, showOrphanDialog, dismissOrphanDialog, stop, discard } =
    useActiveSession()
  const [loading, setLoading] = useState<'stop' | 'discard' | null>(null)

  async function handleStop() {
    setLoading('stop')
    await stop()
    setLoading(null)
  }

  async function handleDiscard() {
    setLoading('discard')
    await discard()
    setLoading(null)
  }

  if (!session) return null

  return (
    <Dialog open={showOrphanDialog} onOpenChange={(open) => { if (!open) dismissOrphanDialog() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Sesión sin cerrar detectada
          </DialogTitle>
          <DialogDescription>
            Hay una sesión de <strong>{session.projectName}</strong> que lleva{' '}
            <strong>{formatElapsed(elapsedSeconds)}</strong> abierta. ¿Qué quieres hacer?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={loading !== null}
            className="text-destructive hover:text-destructive"
          >
            {loading === 'discard' ? 'Descartando...' : 'Descartar sesión'}
          </Button>
          <Button onClick={handleStop} disabled={loading !== null}>
            {loading === 'stop' ? 'Terminando...' : 'Terminar ahora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
