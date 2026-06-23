import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  let query = db()
    .from('sessions')
    .select('*, programs(name), workers(first_name,last_name)')
    .order('session_date', { ascending: false })

  if (searchParams.get('program_id')) query = query.eq('program_id', searchParams.get('program_id')!)
  if (searchParams.get('upcoming') === 'true') query = query.gte('session_date', new Date().toISOString().split('T')[0])

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { data, error } = await db().from('sessions').insert({
    trainer_id: body.trainer_id ?? null,
    program_id: body.program_id ?? null,
    session_date: body.session_date,
    time_start: body.time_start,
    time_end: body.time_end,
    address: body.address,
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    google_maps_url: body.google_maps_url ?? null,
    notes: body.notes ?? null,
    is_cancelled: false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
