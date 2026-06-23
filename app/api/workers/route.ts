import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await db().from('workers').select('*').order('last_name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { data, error } = await db().from('workers').insert({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone ?? null,
    role: body.role ?? 'trainer',
    years_experience: body.years_experience ?? null,
    profile_photo_url: body.profile_photo_url ?? null,
    certificates: body.certificates ?? [],
    assigned_groups: body.assigned_groups ?? [],
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
