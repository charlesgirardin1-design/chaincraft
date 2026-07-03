import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getUserFromRequest } from '../../../../../lib/supabaseServer.js'

// POST /api/projects/:id/join
// Fait rejoindre l'utilisateur courant à un projet, si une place est
// disponible (2 à 10 participants maximum) et que le projet est actif.
export async function POST(request, { params }) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = params
  const supabase = getSupabaseAdminClient()

  const { data: project, error: projErr } = await supabase.from('projects').select('*').eq('id', id).single()
  if (projErr || !project) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })
  if (project.status !== 'active') {
    return NextResponse.json({ error: 'Ce projet n\'est plus actif.' }, { status: 400 })
  }

  const { count } = await supabase
    .from('project_members')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', id)

  if ((count || 0) >= project.max_participants) {
    return NextResponse.json({ error: 'Ce projet a déjà atteint son nombre maximum de participants.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('project_members')
    .insert({ project_id: id, user_id: user.id, role: 'contributeur_idee' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, alreadyMember: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
