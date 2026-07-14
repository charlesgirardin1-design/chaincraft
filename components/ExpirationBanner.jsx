'use client'

import { daysLeft, isExpiringSoon } from '../lib/projectTypes.js'
import ExportButton from './ExportButton.jsx'

// Bannière d'avertissement : les projets expirent exactement 30 jours après
// leur création. On alerte visuellement dans les 48h précédant la
// suppression, avec un rappel de l'option d'export.
export default function ExpirationBanner({ project }) {
  const left = daysLeft(project.expires_at)
  const soon = isExpiringSoon(project.expires_at)

  if (project.status !== 'active') {
    return (
      <div className="card p-4 bg-neutral-50 border-neutral-200 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Ce projet est {project.status === 'archived' ? 'archivé' : 'supprimé'}. Il n'accepte plus de nouvelles
          contributions.
        </p>
        <ExportButton projectId={project.id} />
      </div>
    )
  }

  if (!soon) return null

  return (
    <div className="card p-4 bg-spark-50 border-spark-200 flex items-center justify-between flex-wrap gap-3 animate-fadeIn">
      <p className="text-sm text-spark-800 flex items-center gap-2">
        <span className="animate-pulseSoft" aria-hidden>
          ⏳
        </span>
        Ce projet expire dans <span className="font-semibold">{left} jour{left > 1 ? 's' : ''}</span> — pensez à
        exporter votre travail avant la suppression automatique.
      </p>
      <ExportButton projectId={project.id} />
    </div>
  )
}
