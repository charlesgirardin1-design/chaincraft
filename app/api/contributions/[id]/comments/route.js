import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getUserFromRequest } from '../../../../../lib/supabaseServer.js'

// POST /api/contributions/:id/comments
// Ajoute un commentaire sur une contribution.
export async function POST(request, { params }) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = params
  const { content } = await request.json()
  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Le commentaire ne peut pas être vide.' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient()
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({ contribution_id: id, user_id: user.id, content: content.trim() })
    .select('*, users(pseudo)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comment })
}
