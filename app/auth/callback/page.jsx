'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '../../../lib/supabaseClient.js'

// Page de retour après clic sur le lien magique envoyé par email : le client
// Supabase détecte automatiquement la session dans l'URL, puis on redirige.
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    const timeout = setTimeout(() => router.replace('/'), 2500)

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        clearTimeout(timeout)
        router.replace('/')
      }
    })

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <span className="text-3xl" aria-hidden>
          🔗
        </span>
        <p className="text-sm text-neutral-500 mt-3">Connexion en cours...</p>
      </div>
    </div>
  )
}
