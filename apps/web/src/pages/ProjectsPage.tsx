import { useQuery } from '@tanstack/react-query'
import { BookOpen, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project, Priority, ProjectType } from '@repo/shared'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
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

const TYPE_LABELS: Record<ProjectType, string> = {
  MATERIA: 'Materia',
  CURSO_ONLINE: 'Curso online',
  SIDE_PROJECT: 'Side project',
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-tight">{project.name}</h2>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
            PRIORITY_COLORS[project.priority]
          )}
        >
          {PRIORITY_LABELS[project.priority]}
        </span>
      </div>
      {project.description && (
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      )}
      <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
        {TYPE_LABELS[project.type]}
      </span>
    </Link>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="mb-2 text-xl font-semibold">Aún no tienes proyectos</h2>
      <p className="mb-6 text-muted-foreground">¿Por dónde empezamos?</p>
      <Button onClick={onNew}>Crear tu primer proyecto</Button>
    </div>
  )
}

export function ProjectsPage() {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.list,
  })

  const handleNew = () => {
    // Modal de creación — se implementa en issue 002
    alert('Próximamente: crear proyecto (issue 002)')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Cargando proyectos...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24 text-destructive">
        Error al cargar proyectos. ¿Está corriendo la API?
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          <h1 className="text-xl font-bold">Proyectos</h1>
        </div>
        {projects && projects.length > 0 && (
          <Button onClick={handleNew}>Nuevo proyecto</Button>
        )}
      </div>

      {projects && projects.length === 0 ? (
        <EmptyState onNew={handleNew} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
