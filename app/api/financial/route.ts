import { NextResponse } from 'next/server'
import { getSessionUser, db } from '@/lib/api-auth'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.user_metadata?.role
  if (role !== 'admin' && role !== 'worker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = db()
  const [bills, payments, payroll, expenses] = await Promise.all([
    supabase.from('player_bills').select('*, players(first_name,last_name)').order('created_at', { ascending: false }).limit(50),
    supabase.from('payments').select('*, players(first_name,last_name)').order('payment_date', { ascending: false }).limit(50),
    supabase.from('payroll').select('*, workers(first_name,last_name)').order('created_at', { ascending: false }).limit(50),
    supabase.from('expenses').select('*').order('expense_date', { ascending: false }).limit(50),
  ])

  return NextResponse.json({
    bills: bills.data ?? [],
    payments: payments.data ?? [],
    payroll: payroll.data ?? [],
    expenses: expenses.data ?? [],
  })
}
