'use client'

import Link from 'next/link'
import { getProjectTypeMeta, daysLeft } from '../lib/projectTypes.js'

export default function ProjectCard({ project }) {
  const meta = getProjectTypeMeta(project.type)
  const left = daysLeft(project.expires_at)
  const memberCount = project.member_count ?? project.project_members?.length ?? 0
  const fillPct = Math.min(100, Math.round((memberCount / (project.max_participants || 1)) * 100))

  return (
    <Link href={`/projects/${project.id}`} className="card card-interactive p-5 block group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6 ${meta.iconBg}`}
            aria-hidden
          >
            {meta.icon}
          </span>
          <div>
            <h3 className="font-semibold text-neutral-900 leading-tight">{project.title}</h3>
            <span className={`badge ${meta.badgeBg} mt-1`}>{meta.label}</span>
          </div>
        </div>
        <span className={`badge ${left <= 2 ? 'badge-spark' : 'badge-neutral'} shrink-0`}>
          {left} j restant{left > 1 ? 's' : ''}
        </span>
      </div>

      <p className="text-sm text-neutral-500 mt-3 line-clamp-2">{project.description}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
          <span>
            {memberCount} / {project.max_participants} participants
          </span>
          <span>{project.contribution_count ?? 0} contributions</span>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${meta.iconBg} transition-all duration-500 ease-out`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
