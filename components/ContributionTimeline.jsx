'use client'

import { useState } from 'react'
import { useAuth } from '../lib/AuthProvider.jsx'
import { initials, avatarStyle } from '../lib/avatar.js'
import FeedbackButtons from './FeedbackButtons.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function CommentBox({ contributionId, onAdded }) {
  const { apiFetch } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      await apiFetch(`/api/contributions/${contributionId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      setContent('')
      onAdded?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mt-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Commenter cette contribution..."
        className="input-field text-sm py-1.5"
      />
      <button type="submit" disabled={loading} className="btn-secondary text-xs px-3 py-1.5">
        Envoyer
      </button>
    </form>
  )
}

// Timeline des contributions d'un projet, versionnées automatiquement (V1, V2...),
// avec feedback qualitatif et commentaires par contribution.
export default function ContributionTimeline({ contributions, currentUserId, onChanged }) {
  if (!contributions?.length) {
    return (
      <div className="card p-6 text-center text-sm text-neutral-400">
        Aucune contribution pour le moment. Soyez le premier à lancer la chaîne !
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {contributions.map((c, i) => {
        const name = c.users?.pseudo || 'Membre'
        return (
          <div
            key={c.id}
            className="card p-4 animate-rise"
            style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge bg-gradient-to-br from-chain-500 to-chain-700 text-white font-semibold">
                  V{c.version}
                </span>
                <span className="avatar w-6 h-6 text-[10px]" style={avatarStyle(name)}>
                  {initials(name)}
                </span>
                <span className="text-sm font-medium text-neutral-800">{name}</span>
              </div>
              <span className="text-xs text-neutral-400">{formatDate(c.created_at)}</span>
            </div>

            {c.content?.startsWith('data:image') ? (
              <img
                src={c.content}
                alt={`Contribution V${c.version}`}
                className="mt-2 rounded-lg border border-neutral-200 max-w-full transition-transform duration-300 hover:scale-[1.01]"
              />
            ) : (
              <p className="text-sm text-neutral-700 mt-2 whitespace-pre-wrap leading-relaxed">{c.content}</p>
            )}

            <FeedbackButtons contribution={c} currentUserId={currentUserId} onChanged={onChanged} />

            {(c.comments || []).length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-2">
                {c.comments.map((cm) => (
                  <p key={cm.id} className="text-xs text-neutral-500">
                    <span className="font-medium text-neutral-700">{cm.users?.pseudo || 'Membre'} :</span> {cm.content}
                  </p>
                ))}
              </div>
            )}

            <CommentBox contributionId={c.id} onAdded={onChanged} />
          </div>
        )
      })}
    </div>
  )
}
