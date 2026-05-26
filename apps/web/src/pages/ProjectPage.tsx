import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ClipboardList, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/TaskCard'
import { cn } from '@/lib/utils'

type Tab = 'tareas' | 'sesiones'

export function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('tareas')

  const { data: project, isLoading: projectLoading, isError: projectError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.projects.getById(id!),
    enabled: !!id,
  })

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.tasks.listByProject(id!),
    enabled: !!id && activeTab === 'tareas',
  })

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Cargando proyecto...
      </div>
    )
  }

  if (projectError || !project) {
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

      <h1 className="mb-6 text-2xl font-bold">{project.name}</h1>

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

      {/* Tab content */}
      {activeTab === 'tareas' && (
        <TasksTab tasks={tasks ?? []} loading={tasksLoading} />
      )}
      {activeTab === 'sesiones' && (
        <div className="py-12 text-center text-muted-foreground">
          <p>Historial de sesiones disponible próximamente.</p>
        </div>
      )}
    </div>
  )
}

function TasksTab({
  tasks,
  loading,
}: {
  tasks: import('@repo/shared').Task[]
  loading: boolean
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
        <Button>
          <Plus className="mr-1.5 h-4 w-4" />
          Añadir tarea
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
