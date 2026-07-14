'use client'

import { ROLES } from '../lib/roles.js'
import { initials, avatarStyle } from '../lib/avatar.js'

export default function MembersList({ members, maxParticipants }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-900 text-sm">Membres</h3>
        <span className="text-xs text-neutral-400">
          {members.length} / {maxParticipants}
        </span>
      </div>
      <div className="space-y-2.5">
        {members.map((m) => {
          const roleMeta = ROLES[m.role] || ROLES.contributeur_idee
          const name = m.users?.pseudo || 'Membre'
          return (
            <div key={m.id} className="flex items-center justify-between text-sm gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="avatar w-6 h-6 text-[10px]" style={avatarStyle(name)}>
                  {initials(name)}
                </span>
                <span className="text-neutral-700 truncate">{name}</span>
              </div>
              <span className={`badge ${roleMeta.color} shrink-0`}>{roleMeta.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
