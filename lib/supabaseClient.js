// -----------------------------------------------------------------------------
// supabaseClient.js
// Client Supabase utilisable côté navigateur (composants "use client").
// Nécessite les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et
// NEXT_PUBLIC_SUPABASE_ANON_KEY (à ajouter dans le dashboard Vercel).
// -----------------------------------------------------------------------------
'use client'

import { createBrowserClient } from '@supabase/ssr'

let browserClient

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    // Fallback de secours : évite un crash au build (prerendering) tant que
    // les vraies variables Supabase n'ont pas été ajoutées dans Vercel.
    // Une fois les vraies valeurs ajoutées + un redeploy, l'app fonctionne normalement.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
    browserClient = createBrowserClient(url, key)
  }
  return browserClient
}
