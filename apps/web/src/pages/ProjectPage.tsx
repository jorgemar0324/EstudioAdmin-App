import { useParams } from 'react-router-dom'

export function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <p className="text-muted-foreground">Proyecto {id} — se implementa en issue 004</p>
    </div>
  )
}
