import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = db()
  const role = user.user_metadata?.role ?? 'player_parent'
  const { searchParams } = req.nextUrl

  let query = supabase
    .from('players')
    .select('*, programs(name,price_cad,gst_rate,schedule_days)')
    .order('last_name').order('first_name')

  if (role === 'player_parent') {
    query = query.eq('user_id', user.id)
  } else {
    if (searchParams.get('program_id')) query = query.eq('program_id', searchParams.get('program_id')!)
    if (searchParams.get('is_active') !== null && searchParams.get('is_active') !== '') {
      query = query.eq('is_active', searchParams.get('is_active') === 'true')
    }
    if (searchParams.get('search')) {
      const s = searchParams.get('search')!
      query = query.or(`first_name.ilike.%${s}%,last_name.ilike.%${s}%`)
    }
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const flat = (data ?? []).map((p: any) => ({
    ...p,
    program_name: p.programs?.name ?? null,
    program_price_cad: p.programs?.price_cad ?? null,
    program_gst_rate: p.programs?.gst_rate ?? null,
    program_schedule_days: p.programs?.schedule_days ?? null,
    programs: undefined,
  }))

  return NextResponse.json(flat)
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role ?? 'player_parent'
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const supabase = db()

  const { data, error } = await supabase.from('players').insert({
    first_name: body.first_name,
    last_name: body.last_name,
    date_of_birth: body.date_of_birth,
    notify_birthday: body.notify_birthday ?? true,
    parent1_phone: body.parent1_phone ?? null,
    parent2_phone: body.parent2_phone ?? null,
    email: body.email ?? null,
    profile_photo_url: body.profile_photo_url ?? null,
    program_id: body.program_id ?? null,
    notes: body.notes ?? null,
    user_id: body.user_id ?? null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (body.program_id) {
    await supabase.from('player_program_history').insert({
      player_id: (data as any).id,
      program_id: body.program_id,
      started_at: new Date().toISOString().split('T')[0],
    })
  }

  return NextResponse.json(data, { status: 201 })
}
