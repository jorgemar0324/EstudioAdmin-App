import { LayoutDashboard, Clock, Flame, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { Progress } from '@/components/ui/progress'

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-5 shadow-sm">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { dashboard, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Cargando dashboard...
      </div>
    )
  }

  if (isError || !dashboard) {
    return (
      <div className="flex items-center justify-center py-24 text-destructive">
        Error al cargar el dashboard. ¿Está corriendo la API?
      </div>
    )
  }

  const streakLabel =
    dashboard.streak === 1 ? '1 día consecutivo' : `${dashboard.streak} días consecutivos`

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={<Clock className="h-8 w-8" />}
          value={`${dashboard.weeklyHours} h`}
          label="esta semana"
        />
        <StatCard
          icon={<Flame className="h-8 w-8" />}
          value={String(dashboard.streak)}
          label={streakLabel}
        />
      </div>

      <section>
        <h2 className="mb-4 text-base font-semibold">Progreso por proyecto</h2>
        {dashboard.projects.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <BookOpen className="mb-3 h-10 w-10" />
            <p>No hay proyectos aún.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.projects.map((project) => {
              const pct =
                project.totalTasks > 0
                  ? Math.round((project.completedTasks / project.totalTasks) * 100)
                  : 0
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project.completedTasks}/{project.totalTasks} tareas
                    </span>
                  </div>
                  <Progress value={pct} />
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
