'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { useAuth } from '../lib/AuthProvider.jsx'

export default function HomePage() {
  const { user, loading, apiFetch } = useAuth()
  const router = useRouter()
  const [data, setData] = useState({ active: [], suggested: [] })
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const result = await apiFetch('/api/projects')
      setData(result)
    } catch (err) {
      setError(err.message || 'Impossible de charger les projets.')
    } finally {
      setFetching(false)
    }
  }, [apiFetch])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
      return
    }
    if (user) load()
  }, [loading, user, router, load])

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Créer ensemble. <span className="text-chain-600">En chaîne.</span> Sans ego.
          </h1>
          <p className="text-sm text-neutral-500 mt-2 max-w-lg mx-auto">
            Pas de fil infini, pas de likes publics : de petits groupes qui construisent une œuvre finie, à
            plusieurs mains.
          </p>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-neutral-900">Vos projets actifs</h2>
          </div>

          {fetching ? (
            <p className="text-sm text-neutral-400">Chargement...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : data.active.length === 0 ? (
            <div className="card p-6 text-center text-sm text-neutral-400">
              Vous ne participez à aucun projet pour le moment. Rejoignez une suggestion ci-dessous, ou{' '}
              <a href="/projects/new" className="text-chain-600 underline underline-offset-2">
                créez le vôtre
              </a>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.active.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>

        {data.suggested.length > 0 && (
          <section className="mt-10">
            <h2 className="font-semibold text-neutral-900 mb-3">Suggestions pour vous</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.suggested.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
