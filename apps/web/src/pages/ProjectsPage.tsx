import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, FolderOpen, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project, Priority, ProjectType } from '@repo/shared'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ProjectFormModal } from '@/components/ProjectFormModal'
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

function ProjectCard({
  project,
  onEdit,
}: {
  project: Project
  onEdit: (project: Project) => void
}) {
  return (
    <div className="relative rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/projects/${project.id}`} className="block p-5">
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
      <button
        onClick={(e) => {
          e.preventDefault()
          onEdit(project)
        }}
        className="absolute right-3 top-3 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100 [.rounded-lg:hover_&]:opacity-100"
        aria-label="Editar proyecto"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
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

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  function openCreate() {
    setEditingProject(null)
    setModalOpen(true)
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setModalOpen(true)
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
          <Button onClick={openCreate}>Nuevo proyecto</Button>
        )}
      </div>

      {projects && projects.length === 0 ? (
        <EmptyState onNew={openCreate} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={openEdit} />
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        project={editingProject}
      />
    </div>
  )
}
