'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header.jsx'
import { useAuth } from '../../lib/AuthProvider.jsx'
import { getSupabaseBrowserClient } from '../../lib/supabaseClient.js'

const SKILL_SUGGESTIONS = ['texte', 'musique', 'design', 'brainstorm', 'edition', 'illustration']

export default function ProfilePage() {
  const { user, loading, apiFetch } = useAuth()
  const router = useRouter()
  const [pseudo, setPseudo] = useState('')
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
      return
    }
    if (!user) return

    const supabase = getSupabaseBrowserClient()
    supabase
      .from('users')
      .select('pseudo, skills')
      .eq('id', user.id)
      .single()
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message)
        } else if (data) {
          setPseudo(data.pseudo || '')
          setSkills(data.skills || [])
        }
        setFetching(false)
      })
  }, [loading, user, router])

  const addSkill = (s) => {
    const v = (s || skillInput).trim().toLowerCase()
    if (!v || skills.includes(v)) return
    setSkills((prev) => [...prev, v])
    setSkillInput('')
  }

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: err } = await supabase
        .from('users')
        .update({ pseudo, skills })
        .eq('id', user.id)
      if (err) throw err
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Impossible d\'enregistrer le profil.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto px-4 py-10 w-full animate-fadeIn">
        <h1 className="text-2xl font-bold text-neutral-900">Profil</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Vos compétences aident Crafyro à vous suggérer des projets pertinents. Pas de score public, pas de
          fil de posts : juste ce qu'il faut pour bien matcher.
        </p>

        {fetching ? (
          <p className="text-sm text-neutral-400 mt-6">Chargement...</p>
        ) : (
          <form onSubmit={save} className="mt-6 space-y-4 card p-6">
            <div>
              <label className="text-sm font-medium text-neutral-700">Pseudo</label>
              <input
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Votre pseudo"
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">Compétences / centres d'intérêt</label>
              <div className="flex gap-2 mt-1">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="Ajouter une compétence..."
                  className="input-field"
                />
                <button type="button" onClick={() => addSkill()} className="btn-secondary shrink-0">
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => addSkill(s)}
                    className="text-xs px-2 py-1 rounded-full border border-neutral-200 text-neutral-500 hover:border-chain-300 hover:text-chain-600"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skills.map((s) => (
                    <span key={s} className="badge badge-chain flex items-center gap-1">
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-chain-500 hover:text-chain-800"
                        aria-label={`Retirer ${s}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {saved && <p className="text-sm text-chain-600">Profil enregistré.</p>}

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
