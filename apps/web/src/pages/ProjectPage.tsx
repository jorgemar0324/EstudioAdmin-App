import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Plus, PlayCircle } from 'lucide-react'
import type { Task, TaskStatus } from '@repo/shared'
import { useProject } from '@/hooks/useProjects'
import { useTasks, useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { useActiveSession } from '@/contexts/ActiveSessionContext'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/TaskCard'
import { TaskFormModal } from '@/components/TaskFormModal'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { cn } from '@/lib/utils'

type Tab = 'tareas' | 'sesiones'

export function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('tareas')

  const { project, isLoading: projectLoading } = useProject(id)
  const { tasks, isLoading: tasksLoading } = useTasks(id!, { enabled: activeTab === 'tareas' })

  const { update } = useUpdateTask()
  const { remove, isPending: isDeleting } = useDeleteTask()
  const { session: activeSession, start: startSession } = useActiveSession()

  const [taskModal, setTaskModal] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  })

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  })

  function openCreateTask() {
    setTaskModal({ open: true, task: null })
  }

  function openEditTask(task: Task) {
    setTaskModal({ open: true, task })
  }

  function openDeleteTask(task: Task) {
    setDeleteDialog({ open: true, task })
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    await update({ id: task.id, data: { status: newStatus } })
  }

  async function handleConfirmDelete() {
    if (!deleteDialog.task) return
    await remove({ id: deleteDialog.task.id, projectId: id! })
    setDeleteDialog({ open: false, task: null })
  }

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Cargando proyecto...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-destructive">Proyecto no encontrado.</p>
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          Volver a proyectos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Proyectos
      </Link>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {!activeSession && (
          <Button variant="outline" size="sm" onClick={() => startSession(id!)}>
            <PlayCircle className="mr-1.5 h-4 w-4" />
            Iniciar sesión
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-0">
          {(['tareas', 'sesiones'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'tareas' ? 'Tareas' : 'Sesiones'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'tareas' && (
        <TasksTab
          tasks={tasks}
          loading={tasksLoading}
          onNew={openCreateTask}
          onEdit={openEditTask}
          onDelete={openDeleteTask}
          onStatusChange={handleStatusChange}
        />
      )}
      {activeTab === 'sesiones' && (
        <div className="py-12 text-center text-muted-foreground">
          <p>Historial de sesiones disponible próximamente.</p>
        </div>
      )}

      <TaskFormModal
        open={taskModal.open}
        onOpenChange={(open) => setTaskModal((m) => ({ ...m, open }))}
        projectId={id!}
        task={taskModal.task}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((d) => ({ ...d, open }))}
        title="Eliminar tarea"
        description={
          deleteDialog.task
            ? `¿Eliminar '${deleteDialog.task.title}'? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  )
}

function TasksTab({
  tasks,
  loading,
  onNew,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  tasks: Task[]
  loading: boolean
  onNew: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, newStatus: TaskStatus) => void
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Cargando tareas...
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-lg font-semibold">Aún no hay tareas</h2>
        <p className="mb-6 text-muted-foreground">Añade la primera tarea a este proyecto.</p>
        <Button onClick={onNew}>
          <Plus className="mr-1.5 h-4 w-4" />
          Añadir tarea
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={onNew} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Añadir tarea
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  )
}
