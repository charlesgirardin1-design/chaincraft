'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/AuthProvider.jsx'

export default function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-neutral-100">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-neutral-900">
          <span aria-hidden>🔗</span>
          <span>
            Craf<span className="text-chain-600">yro</span>
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="text-sm font-medium px-3 py-1.5 rounded-full bg-chain-50 text-chain-700 hover:bg-chain-100 transition"
            >
              + Créer un projet
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition"
            >
              Profil
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-neutral-400 hover:text-neutral-700 transition"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
