import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { data, error } = await db().from('inquiries').update({
    status: body.status,
    assigned_to: body.assigned_to ?? null,
    resolved_at: body.status === 'resolved' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
