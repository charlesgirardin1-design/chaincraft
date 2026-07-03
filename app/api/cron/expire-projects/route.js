import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '../../../../lib/supabaseServer.js'

// GET /api/cron/expire-projects
// Appelée automatiquement chaque jour par le cron Vercel (voir vercel.json).
// Règle stricte du produit : tout projet expire exactement 30 jours après sa
// création. On marque "archived" les projets dont expires_at est dépassé, et
// on repère ceux qui expirent dans moins de 48h (pour la bannière de
// notification affichée côté client — voir lib/projectTypes.js#isExpiringSoon).
export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
  } else if (!isVercelCron) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = getSupabaseAdminClient()
  const nowIso = new Date().toISOString()

  const { data: expired, error: expireErr } = await supabase
    .from('projects')
    .update({ status: 'archived' })
    .lt('expires_at', nowIso)
    .eq('status', 'active')
    .select('id')

  if (expireErr) return NextResponse.json({ error: expireErr.message }, { status: 500 })

  const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  const { data: soonToExpire, error: soonErr } = await supabase
    .from('projects')
    .update({ notified_48h: true })
    .eq('status', 'active')
    .eq('notified_48h', false)
    .lt('expires_at', in48h)
    .select('id, title, creator_id')

  if (soonErr) return NextResponse.json({ error: soonErr.message }, { status: 500 })

  return NextResponse.json({
    archivedCount: expired?.length || 0,
    expiringSoonCount: soonToExpire?.length || 0,
  })
}
