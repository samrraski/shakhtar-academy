import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const supabase = db()

  const { data, error } = await supabase
    .from('players')
    .select('*, programs(name,price_cad,gst_rate,schedule_days)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const p = data as any
  return NextResponse.json({
    ...p,
    program_name: p.programs?.name ?? null,
    program_price_cad: p.programs?.price_cad ?? null,
    program_gst_rate: p.programs?.gst_rate ?? null,
    program_schedule_days: p.programs?.schedule_days ?? null,
    programs: undefined,
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role ?? 'player_parent'
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const supabase = db()

  const { data: existing } = await supabase.from('players').select('program_id').eq('id', id).single()

  const { data, error } = await supabase.from('players').update({
    first_name: body.first_name,
    last_name: body.last_name,
    date_of_birth: body.date_of_birth,
    notify_birthday: body.notify_birthday,
    parent1_phone: body.parent1_phone ?? null,
    parent2_phone: body.parent2_phone ?? null,
    email: body.email ?? null,
    profile_photo_url: body.profile_photo_url ?? null,
    program_id: body.program_id ?? null,
    notes: body.notes ?? null,
    is_active: body.is_active ?? true,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (body.program_id && body.program_id !== (existing as any)?.program_id) {
    await supabase.from('player_program_history')
      .update({ ended_at: new Date().toISOString().split('T')[0] })
      .eq('player_id', id).is('ended_at', null)
    await supabase.from('player_program_history').insert({
      player_id: id, program_id: body.program_id,
      started_at: new Date().toISOString().split('T')[0],
    })
  }

  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role ?? 'player_parent'
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { error } = await db().from('players')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
