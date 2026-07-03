'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../components/Header.jsx'
import { useAuth } from '../../../lib/AuthProvider.jsx'
import { PROJECT_TYPES } from '../../../lib/projectTypes.js'

export default function NewProjectPage() {
  const { user, loading, apiFetch } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'brainstorm',
    objective: '',
    max_participants: 6,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(form) })
      router.push(`/projects/${data.project.id}`)
    } catch (err) {
      setError(err.message || 'Impossible de créer le projet.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-10 w-full animate-fadeIn">
        <h1 className="text-2xl font-bold text-neutral-900">Créer un projet</h1>
        <p className="text-sm text-neutral-500 mt-1">
          2 à 10 participants, durée de vie fixée à 30 jours. Une œuvre collective, pas un post individuel.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4 card p-6">
          <div>
            <label className="text-sm font-medium text-neutral-700">Titre</label>
            <input
              required
              value={form.title}
              onChange={update('title')}
              placeholder="Ex : Une nouvelle légende urbaine"
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <textarea
              value={form.description}
              onChange={update('description')}
              rows={3}
              placeholder="De quoi s'agit-il ?"
              className="input-field mt-1 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">Objectif</label>
            <input
              value={form.objective}
              onChange={update('objective')}
              placeholder="Ce que le groupe doit produire à la fin"
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Type de projet</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition ${
                    form.type === t.value
                      ? 'bg-chain-50 border-chain-400 text-chain-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-chain-300'
                  }`}
                >
                  <span aria-hidden>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">
              Participants max ({form.max_participants})
            </label>
            <input
              type="range"
              min={2}
              max={10}
              value={form.max_participants}
              onChange={update('max_participants')}
              className="w-full mt-1 accent-chain-600"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Création...' : 'Lancer le projet'}
          </button>
        </form>
      </main>
    </div>
  )
}
