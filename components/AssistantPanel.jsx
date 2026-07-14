'use client'

import { useState } from 'react'
import { useAuth } from '../lib/AuthProvider.jsx'

const ACTIONS = [
  { value: 'idea', icon: '💡', label: 'Proposer des idées', bg: 'bg-gradient-to-br from-amber-400 to-spark-600' },
  { value: 'structure', icon: '🧱', label: 'Structurer le projet', bg: 'bg-gradient-to-br from-sky-400 to-sky-600' },
  { value: 'unblock', icon: '🔓', label: 'Débloquer la situation', bg: 'bg-gradient-to-br from-rose-400 to-rose-600' },
  { value: 'summarize', icon: '📝', label: 'Résumer', bg: 'bg-gradient-to-br from-teal-400 to-teal-600' },
]

function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5 text-chain-600" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  )
}

// Assistant IA latéral : propose des idées, structure le projet, débloque une
// situation ou résume les contributions, à la demande (jamais automatique).
export default function AssistantPanel({ projectId }) {
  const { apiFetch } = useAuth()
  const [loading, setLoading] = useState(null)
  const [suggestion, setSuggestion] = useState('')
  const [error, setError] = useState('')

  const run = async (action) => {
    setLoading(action)
    setError('')
    setSuggestion('')
    try {
      const data = await apiFetch(`/api/projects/${projectId}/assistant`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      })
      setSuggestion(data.suggestion)
    } catch (err) {
      setError(err.message || 'Assistant indisponible.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-neutral-900 text-sm mb-3 flex items-center gap-1.5">
        <span aria-hidden>🤖</span> Assistant du projet
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.value}
            onClick={() => run(a.value)}
            disabled={loading === a.value}
            className="flex items-center gap-2.5 text-left text-sm px-3 py-2 rounded-lg border border-neutral-200
              transition-all duration-200 hover:border-chain-300 hover:bg-chain-50 hover:-translate-y-0.5
              disabled:opacity-70 disabled:translate-y-0"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${a.bg}`}
              aria-hidden
            >
              {a.icon}
            </span>
            <span className="flex items-center gap-1.5">
              {loading === a.value && <Spinner />}
              {loading === a.value ? 'Réflexion...' : a.label}
            </span>
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      {suggestion && (
        <div className="mt-4 bg-chain-50 border border-chain-100 rounded-lg p-3 text-sm text-neutral-700 leading-relaxed animate-rise">
          {suggestion}
        </div>
      )}
    </div>
  )
}
