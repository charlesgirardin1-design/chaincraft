'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { useAuth } from '../lib/AuthProvider.jsx'

function CardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton w-11 h-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-2/3 rounded" />
          <div className="skeleton h-2.5 w-1/3 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded mt-4" />
      <div className="skeleton h-3 w-4/5 rounded mt-2" />
    </div>
  )
}

// Illustration légère en SVG pur (aucun asset externe requis) pour l'état
// "aucun projet actif" : un maillon de chaîne ouvert, en écho au logo.
function EmptyIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="36" cy="36" r="35" fill="#f2f1fe" />
      <rect x="16" y="26" width="26" height="22" rx="11" transform="rotate(-18 16 26)" stroke="#a29afa" strokeWidth="3" />
      <rect x="32" y="26" width="26" height="22" rx="11" transform="rotate(-18 32 26)" stroke="#7a6cf5" strokeWidth="3" />
    </svg>
  )
}

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
      <main className="flex-1 w-full">
        <div className="relative overflow-hidden">
          <div
            className="blob w-72 h-72 bg-chain-300 -top-20 -left-16 animate-blobFloat"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="blob w-64 h-64 bg-spark-200 top-4 right-0 animate-blobFloatSlow"
            style={{ animationDelay: '1.2s' }}
          />
          <div
            className="blob w-56 h-56 bg-chain-200 top-24 left-1/3 animate-blobFloat"
            style={{ animationDelay: '2.4s' }}
          />

          <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8 w-full animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                <span className="inline-block animate-rise" style={{ animationDelay: '0ms' }}>
                  Créer ensemble.
                </span>{' '}
                <span
                  className="inline-block animate-rise text-gradient-animate"
                  style={{ animationDelay: '120ms' }}
                >
                  En chaîne.
                </span>{' '}
                <span className="inline-block animate-rise" style={{ animationDelay: '240ms' }}>
                  Sans ego.
                </span>
              </h1>
              <p
                className="text-sm text-neutral-500 mt-2 max-w-lg mx-auto animate-rise"
                style={{ animationDelay: '360ms' }}
              >
                Pas de fil infini, pas de likes publics : de petits groupes qui construisent une œuvre finie, à
                plusieurs mains.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-10 w-full">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-neutral-900">Vos projets actifs</h2>
            </div>

            {fetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : data.active.length === 0 ? (
              <div className="card p-8 text-center animate-fadeIn">
                <div className="flex justify-center mb-3">
                  <EmptyIllustration />
                </div>
                <p className="text-sm text-neutral-500">
                  Vous ne participez à aucun projet pour le moment. Rejoignez une suggestion ci-dessous, ou{' '}
                  <a href="/projects/new" className="text-chain-600 font-medium link-underline">
                    créez le vôtre
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.active.map((p, i) => (
                  <div key={p.id} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {data.suggested.length > 0 && (
            <section className="mt-10">
              <h2 className="font-semibold text-neutral-900 mb-3">Suggestions pour vous</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.suggested.map((p, i) => (
                  <div key={p.id} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
