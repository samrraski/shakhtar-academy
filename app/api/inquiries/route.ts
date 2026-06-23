import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = req.nextUrl
  let query = db().from('inquiries').select('*, players(first_name,last_name)').order('created_at', { ascending: false })
  if (searchParams.get('status')) query = query.eq('status', searchParams.get('status')!)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await db().from('inquiries').insert({
    contact_name: body.contact_name,
    contact_email: body.contact_email ?? null,
    contact_phone: body.contact_phone ?? null,
    message: body.message,
    status: 'new',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
