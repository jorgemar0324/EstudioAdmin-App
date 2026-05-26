import { NavLink } from 'react-router-dom'
import { Timer, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useActiveSession } from '@/contexts/ActiveSessionContext'
import { Button } from '@/components/ui/button'

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export function Navbar() {
  const { session, elapsedSeconds, stop } = useActiveSession()

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <span className="font-semibold tracking-tight">Administración Estudio</span>
        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-2 rounded-md border bg-secondary/50 px-3 py-1.5">
              <Timer className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm font-medium tabular-nums">
                {formatTime(elapsedSeconds)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={stop}
              >
                <Square className="mr-1 h-3 w-3 fill-current" />
                Terminar
              </Button>
            </div>
          )}
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              Proyectos
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
