'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../../components/Header.jsx'
import MembersList from '../../../components/MembersList.jsx'
import AssistantPanel from '../../../components/AssistantPanel.jsx'
import ContributionTimeline from '../../../components/ContributionTimeline.jsx'
import AddContributionForm from '../../../components/AddContributionForm.jsx'
import ExpirationBanner from '../../../components/ExpirationBanner.jsx'
import { useAuth } from '../../../lib/AuthProvider.jsx'
import { getProjectTypeMeta } from '../../../lib/projectTypes.js'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user, loading, apiFetch } = useAuth()
  const router = useRouter()
  const [state, setState] = useState(null)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/projects/${id}`)
      setState(data)
    } catch (err) {
      setError(err.message || 'Projet introuvable.')
    }
  }, [apiFetch, id])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
      return
    }
    if (user) load()
  }, [loading, user, router, load])

  const handleJoin = async () => {
    setJoining(true)
    try {
      await apiFetch(`/api/projects/${id}/join`, { method: 'POST' })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setJoining(false)
    }
  }

  if (!user) return null
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-10 text-center text-sm text-red-500">{error}</main>
      </div>
    )
  }
  if (!state) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-10 text-center text-sm text-neutral-400">
          Chargement...
        </main>
      </div>
    )
  }

  const { project, members, isMember, contributions } = state
  const meta = getProjectTypeMeta(project.type)
  const isFull = members.length >= project.max_participants
  const myPseudo = members.find((m) => m.user_id === user.id)?.users?.pseudo

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full animate-fadeIn">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className={`badge ${meta.badgeBg}`}>
              {meta.icon} {meta.label}
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 mt-2">{project.title}</h1>
            <p className="text-sm text-neutral-500 mt-1 max-w-xl">{project.description}</p>
            {project.objective && (
              <p className="text-sm text-neutral-400 mt-1">
                🎯 Objectif : <span className="text-neutral-600">{project.objective}</span>
              </p>
            )}
          </div>

          {!isMember && (
            <button onClick={handleJoin} disabled={joining || isFull} className="btn-primary shrink-0">
              {isFull ? 'Complet' : joining ? 'Ajout...' : 'Rejoindre ce projet'}
            </button>
          )}
        </div>

        <div className="mt-5">
          <ExpirationBanner project={project} />
        </div>

        {!isMember ? (
          <div className="mt-6 card p-6 text-center text-sm text-neutral-500">
            Rejoignez ce projet pour voir et ajouter des contributions.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-4">
              {project.status === 'active' && (
                <AddContributionForm
                  projectId={project.id}
                  projectType={project.type}
                  authorName={myPseudo}
                  onAdded={load}
                />
              )}
              <ContributionTimeline
                contributions={contributions}
                currentUserId={user.id}
                onChanged={load}
              />
            </div>
            <div className="space-y-4">
              <MembersList members={members} maxParticipants={project.max_participants} />
              <AssistantPanel projectId={project.id} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
