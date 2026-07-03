'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/AuthProvider.jsx'

// Connexion sans mot de passe : Supabase envoie un lien magique par email.
export default function LoginPage() {
  const { signInWithEmail, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    router.replace('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: signInError } = await signInWithEmail(email)
      if (signInError) throw signInError
      setSent(true)
    } catch (err) {
      setError(err.message || 'Impossible d\'envoyer le lien de connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm card p-7 animate-fadeIn">
        <div className="text-center mb-6">
          <span className="text-4xl" aria-hidden>
            🔗
          </span>
          <h1 className="text-xl font-extrabold text-neutral-900 mt-3">
            Chain<span className="text-chain-600">Craft</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Créer ensemble. En chaîne. Sans ego.</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Un lien de connexion a été envoyé à <span className="font-medium">{email}</span>. Ouvrez-le
              pour accéder à votre compte.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Envoi...' : 'Recevoir un lien de connexion'}
            </button>
          </form>
        )}

        <p className="text-xs text-neutral-400 text-center mt-6">
          Pas de mot de passe : un simple lien envoyé par email suffit.
        </p>
      </div>
    </div>
  )
}
