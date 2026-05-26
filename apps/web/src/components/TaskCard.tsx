import { Pencil } from 'lucide-react'
import type { Task, Priority, TaskStatus } from '@repo/shared'
import { cn } from '@/lib/utils'

const PRIORITY_LABELS: Record<Priority, string> = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  ALTA: 'bg-red-100 text-red-700',
  MEDIA: 'bg-yellow-100 text-yellow-700',
  BAJA: 'bg-green-100 text-green-700',
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  EN_PROGRESO: 'En progreso',
  PENDIENTE: 'Pendiente',
  COMPLETADA: 'Completada',
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  EN_PROGRESO: 'bg-blue-100 text-blue-700',
  PENDIENTE: 'bg-gray-100 text-gray-600',
  COMPLETADA: 'bg-green-100 text-green-700',
}

function isDueDateOverdue(dueDate: string | null, status: TaskStatus): boolean {
  if (!dueDate || status === 'COMPLETADA') return false
  return new Date(dueDate) < new Date()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function TaskCard({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const overdue = isDueDateOverdue(task.dueDate, task.status)

  return (
    <div className="group relative rounded-lg border bg-card p-4 shadow-sm">
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Editar tarea"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
        <div className="flex shrink-0 gap-1">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              STATUS_COLORS[task.status]
            )}
          >
            {STATUS_LABELS[task.status]}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              PRIORITY_COLORS[task.priority]
            )}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>
      {task.description && (
        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}
      {task.dueDate && (
        <p className={cn('text-xs', overdue ? 'font-medium text-red-600' : 'text-muted-foreground')}>
          Vence: {formatDate(task.dueDate)}
        </p>
      )}
    </div>
  )
}
