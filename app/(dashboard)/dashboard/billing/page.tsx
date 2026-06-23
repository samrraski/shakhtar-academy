import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Receipt, CheckCircle, Clock, AlertCircle, MinusCircle } from 'lucide-react';

function fmtCAD(n: number | string) {
  return `$${Number(n).toFixed(2)}`;
}
function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  paid:    { label: 'Paid',    color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   Icon: CheckCircle  },
  unpaid:  { label: 'Unpaid',  color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', Icon: Clock        },
  overdue: { label: 'Overdue', color: 'text-red-600',    bg: 'bg-red-50 border-red-200',       Icon: AlertCircle  },
  waived:  { label: 'Waived',  color: 'text-brand-gray-400', bg: 'bg-brand-gray-100 border-brand-gray-200', Icon: MinusCircle },
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const admin = createAdminClient();
  const { data: player } = await admin
    .from('players').select('id').eq('user_id', user.id).limit(1).maybeSingle();

  const invoices = player
    ? (await admin.from('invoices').select('*').eq('player_id', player.id).order('created_at', { ascending: false })).data ?? []
    : [];

  const outstanding = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue')
    .reduce((s, i) => s + Number(i.total_cad), 0);
  const paid = invoices.filter(i => i.status === 'paid')
    .reduce((s, i) => s + Number(i.total_cad), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Billing</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Receipt size={40} className="text-brand-gray-200 mb-3" />
          <p className="font-medium text-brand-black">No invoices yet</p>
          <p className="text-sm text-brand-gray-400 mt-1">Your billing history will appear here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-brand-gray-200 p-4">
              <p className="text-xs text-brand-gray-400 mb-1">Outstanding</p>
              <p className={`text-2xl font-bold ${outstanding > 0 ? 'text-red-600' : 'text-brand-black'}`}>
                {fmtCAD(outstanding)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-brand-gray-200 p-4">
              <p className="text-xs text-brand-gray-400 mb-1">Total paid</p>
              <p className="text-2xl font-bold text-green-700">{fmtCAD(paid)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {invoices.map(inv => {
              const overdue = inv.status === 'unpaid' && inv.due_date && new Date(inv.due_date) < new Date();
              const key = overdue ? 'overdue' : inv.status as keyof typeof STATUS;
              const { label, color, bg, Icon } = STATUS[key] ?? STATUS.unpaid;
              return (
                <div key={inv.id} className="bg-white rounded-2xl border border-brand-gray-200 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-black text-sm">{inv.description}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${bg} ${color}`}>
                      <Icon size={11} />{label}
                    </span>
                  </div>
                  <div className="bg-brand-gray-100 rounded-xl px-3 py-2.5 space-y-1 text-sm">
                    <div className="flex justify-between text-brand-gray-400">
                      <span>Subtotal</span><span>{fmtCAD(inv.amount_cad)}</span>
                    </div>
                    {Number(inv.gst_amount) > 0 && (
                      <div className="flex justify-between text-brand-gray-400">
                        <span>GST</span><span>{fmtCAD(inv.gst_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-brand-black pt-1 border-t border-brand-gray-200">
                      <span>Total</span><span>{fmtCAD(inv.total_cad)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-brand-gray-400">
                    <span>Issued {fmtDate(inv.created_at)}</span>
                    {inv.status === 'paid' && inv.paid_at
                      ? <span className="text-green-700">Paid {fmtDate(inv.paid_at)}</span>
                      : inv.due_date
                        ? <span className={overdue ? 'text-red-600 font-medium' : ''}>Due {fmtDate(inv.due_date)}</span>
                        : null}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
