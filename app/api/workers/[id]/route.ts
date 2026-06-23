import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { data, error } = await db().from('workers').update({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone ?? null,
    role: body.role,
    years_experience: body.years_experience ?? null,
    profile_photo_url: body.profile_photo_url ?? null,
    certificates: body.certificates ?? [],
    assigned_groups: body.assigned_groups ?? [],
    is_active: body.is_active ?? true,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { error } = await db().from('workers')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
