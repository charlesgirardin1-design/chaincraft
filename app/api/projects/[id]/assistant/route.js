import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getUserFromRequest } from '../../../../../lib/supabaseServer.js'

// POST /api/projects/:id/assistant
// Body: { action: 'idea' | 'structure' | 'unblock' | 'summarize' }
// Appelle Google Gemini avec le contexte du projet (description, objectif,
// contributions) pour proposer des idées, structurer, débloquer ou résumer.
// Nécessite la variable d'environnement GEMINI_API_KEY sur Vercel.
export async function POST(request, { params }) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = params
  const { action } = await request.json()

  const supabase = getSupabaseAdminClient()

  const isMember = await supabase
    .from('project_members')
    .select('id')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!isMember.data) {
    return NextResponse.json({ error: 'Vous devez être membre du projet.' }, { status: 403 })
  }

  const { data: project } = await supabase.from('projects').select('*').eq('id', id).single()
  const { data: contributions } = await supabase
    .from('contributions')
    .select('content, version, users(pseudo)')
    .eq('project_id', id)
    .order('version', { ascending: true })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Assistant IA non configuré : ajoutez GEMINI_API_KEY dans les variables d\'environnement Vercel.' },
      { status: 503 }
    )
  }

  const contributionsText = (contributions || [])
    .map((c) => `V${c.version} (${c.users?.pseudo || 'anonyme'}) : ${c.content}`)
    .join('\n')

  const prompts = {
    idea: 'Propose 3 idées concrètes et courtes pour faire avancer ce projet créatif collectif.',
    structure: 'Propose une structure claire (plan en étapes) pour organiser ce projet à partir de ce qui existe déjà.',
    unblock:
      'Le groupe semble bloqué ou en manque d\'inspiration. Propose une piste concrète pour débloquer la situation.',
    summarize: 'Résume en quelques phrases claires l\'état actuel du projet à partir des contributions ci-dessous.',
  }

  const instruction = prompts[action] || prompts.idea

  const prompt = `Tu es l'assistant IA de Crafyro, un outil de création collaborative en petits groupes.
Projet : "${project.title}" (type : ${project.type})
Description : ${project.description}
Objectif : ${project.objective}

Contributions actuelles du groupe :
${contributionsText || '(aucune contribution pour le moment)'}

Tâche : ${instruction}
Réponds en français, de façon concise et actionnable (pas plus de 120 mots), sans préambule.`

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: `Erreur IA : ${errText}` }, { status: 502 })
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || 'Aucune suggestion générée.'

    return NextResponse.json({ suggestion: text.trim() })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Erreur assistant IA' }, { status: 500 })
  }
}
