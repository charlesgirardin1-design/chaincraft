'use client'

import { useState } from 'react'
import { useAuth } from '../lib/AuthProvider.jsx'
import { FEEDBACK_TYPES } from '../lib/projectTypes.js'

// Feedback qualitatif SANS like public classique : chaque contribution ne
// montre que des étiquettes ("utile", "inspirant", "clair", "créatif") avec un
// compteur discret, pas un score compétitif.
export default function FeedbackButtons({ contribution, currentUserId, onChanged }) {
  const { apiFetch } = useAuth()
  const [pending, setPending] = useState(null)

  const counts = {}
  const mine = {}
  ;(contribution.feedback || []).forEach((f) => {
    counts[f.type] = (counts[f.type] || 0) + 1
    if (f.user_id === currentUserId) mine[f.type] = true
  })

  const handleClick = async (type) => {
    setPending(type)
    try {
      await apiFetch(`/api/contributions/${contribution.id}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ type }),
      })
      onChanged?.()
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {FEEDBACK_TYPES.map((f) => {
        const active = mine[f.value]
        const count = counts[f.value] || 0
        return (
          <button
            key={f.value}
            onClick={() => handleClick(f.value)}
            disabled={pending === f.value}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 active:scale-90 ${
              active
                ? 'bg-gradient-to-br from-chain-500 to-chain-700 border-chain-600 text-white shadow-sm scale-105'
                : 'border-neutral-200 text-neutral-500 hover:border-chain-300 hover:-translate-y-0.5'
            } ${pending === f.value ? 'animate-pulseSoft' : ''}`}
          >
            {f.icon} {f.label}
            {count > 0 && (
              <span key={count} className="ml-1 opacity-70 inline-block animate-popIn">
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
