import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getUserFromRequest } from '../../../../../lib/supabaseServer.js'
import { computeDynamicRole } from '../../../../../lib/roles.js'

// POST /api/projects/:id/contributions
// Ajoute une contribution versionnée automatiquement (V1, V2, V3...) et met à
// jour le rôle dynamique du membre en fonction de son activité.
export async function POST(request, { params }) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = params
  const { content } = await request.json()
  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'La contribution ne peut pas être vide.' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient()

  const { data: member, error: memErr } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single()

  if (memErr || !member) {
    return NextResponse.json({ error: 'Vous devez rejoindre ce projet avant de contribuer.' }, { status: 403 })
  }

  const { data: project } = await supabase.from('projects').select('status, creator_id').eq('id', id).single()
  if (!project || project.status !== 'active') {
    return NextResponse.json({ error: 'Ce projet n\'accepte plus de nouvelles contributions.' }, { status: 400 })
  }

  const { count: versionCount } = await supabase
    .from('contributions')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', id)

  const version = (versionCount || 0) + 1

  const { data: contribution, error } = await supabase
    .from('contributions')
    .insert({ project_id: id, user_id: user.id, content: content.trim(), version })
    .select('*, users(id, pseudo)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const newCount = member.contribution_count + 1
  const newRole = computeDynamicRole({
    isCreator: project.creator_id === user.id,
    contributionCount: newCount,
  })

  await supabase
    .from('project_members')
    .update({ contribution_count: newCount, role: newRole })
    .eq('id', member.id)

  return NextResponse.json({ contribution, role: newRole })
}
