'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/AuthProvider.jsx'

// Petit logo "maillon de chaîne" en SVG (dégradé de marque), pour remplacer
// l'emoji 🔗 par une marque un peu plus soignée et cohérente entre thèmes.
function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7a6cf5" />
          <stop offset="1" stopColor="#3a27ad" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="7"
        width="13"
        height="12"
        rx="6"
        transform="rotate(-20 2 7)"
        stroke="url(#logoGrad)"
        strokeWidth="2.4"
      />
      <rect
        x="11"
        y="7"
        width="13"
        height="12"
        rx="6"
        transform="rotate(-20 11 7)"
        stroke="url(#logoGrad)"
        strokeWidth="2.4"
      />
    </svg>
  )
}

export default function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <header
      className={`sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b transition-shadow duration-300 ${
        scrolled ? 'border-neutral-200 shadow-[0_2px_16px_rgba(15,23,42,0.06)]' : 'border-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-neutral-900 group">
          <span className="transition-transform duration-300 group-hover:rotate-12">
            <LogoMark />
          </span>
          <span>
            Craf<span className="text-chain-600">yro</span>
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="text-sm font-medium px-3.5 py-1.5 rounded-full bg-chain-50 text-chain-700
                transition-all duration-200 hover:bg-chain-100 hover:-translate-y-0.5"
            >
              + Créer un projet
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors link-underline"
            >
              Profil
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
