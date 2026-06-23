import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Calendar, DollarSign, ChevronRight, User } from 'lucide-react';

function fmtTime(t: string) {
  const [h, mi] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const admin = createAdminClient();

  const { data: player } = await admin
    .from('players')
    .select('*, programs(name, price_cad, gst_rate, schedule_days)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-gray-200 flex items-center justify-center mb-4">
          <User size={28} className="text-brand-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-brand-black">No player linked yet</h2>
        <p className="text-sm text-brand-gray-400 mt-1 max-w-xs">
          Your account hasn&apos;t been linked to a player profile yet. Contact the academy to get set up.
        </p>
        <Link href="/dashboard/contact"
          className="mt-5 inline-flex items-center gap-2 bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-orange-hover transition-colors">
          Contact the Academy
        </Link>
      </div>
    );
  }

  const program = player.programs as { name: string; price_cad: number; gst_rate: number; schedule_days: string[] } | null;
  const today = new Date().toISOString().split('T')[0];

  const [{ data: nextSession }, { data: invoices }] = await Promise.all([
    player.program_id
      ? admin.from('sessions')
          .select('session_date, time_start, time_end, address')
          .eq('program_id', player.program_id)
          .eq('is_cancelled', false)
          .gte('session_date', today)
          .order('session_date').order('time_start')
          .limit(1).maybeSingle()
      : { data: null },
    admin.from('invoices')
      .select('total_cad')
      .eq('player_id', player.id)
      .in('status', ['unpaid', 'overdue']),
  ]);

  const outstanding = (invoices ?? []).reduce((s, i) => s + Number(i.total_cad), 0);
  const monthly = program
    ? (Number(program.price_cad) * (1 + Number(program.gst_rate ?? 0.05))).toFixed(2)
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Welcome back</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">Here&apos;s your portal at a glance.</p>
      </div>

      {/* Player card */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center overflow-hidden shrink-0">
          {player.profile_photo_url
            ? <img src={player.profile_photo_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold text-brand-orange">{player.first_name?.[0]?.toUpperCase()}</span>
          }
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-brand-black">{player.first_name} {player.last_name}</h2>
          <p className="text-sm text-brand-gray-400 truncate">{program?.name ?? 'No program assigned'}</p>
          <span className={`mt-1.5 inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
            player.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-gray-100 text-brand-gray-400'
          }`}>
            {player.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/schedule"
          className="bg-white rounded-2xl border border-brand-gray-200 p-4 hover:border-brand-orange transition-colors group">
          <div className="w-9 h-9 bg-brand-orange/10 group-hover:bg-brand-orange/20 rounded-xl flex items-center justify-center mb-3 transition-colors">
            <Calendar size={17} className="text-brand-orange" />
          </div>
          <p className="text-xs text-brand-gray-400">Next session</p>
          {nextSession ? (
            <>
              <p className="text-sm font-bold text-brand-black mt-0.5">
                {new Date(nextSession.session_date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-brand-gray-400">{fmtTime(nextSession.time_start)}</p>
            </>
          ) : (
            <p className="text-sm font-bold text-brand-black mt-0.5">None scheduled</p>
          )}
        </Link>

        <Link href="/dashboard/billing"
          className="bg-white rounded-2xl border border-brand-gray-200 p-4 hover:border-brand-orange transition-colors group">
          <div className="w-9 h-9 bg-brand-orange/10 group-hover:bg-brand-orange/20 rounded-xl flex items-center justify-center mb-3 transition-colors">
            <DollarSign size={17} className="text-brand-orange" />
          </div>
          <p className="text-xs text-brand-gray-400">Outstanding</p>
          <p className={`text-sm font-bold mt-0.5 ${outstanding > 0 ? 'text-red-600' : 'text-brand-black'}`}>
            ${outstanding.toFixed(2)} CAD
          </p>
          {monthly && <p className="text-xs text-brand-gray-400">Monthly: ${monthly}</p>}
        </Link>
      </div>

      {/* Program details */}
      {program && (
        <div className="bg-white rounded-2xl border border-brand-gray-200 p-5">
          <h3 className="text-sm font-semibold text-brand-black mb-3">Program details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Program',        value: program.name },
              { label: 'Training days',  value: program.schedule_days?.join(', ') ?? '—' },
              { label: 'Date of birth',  value: new Date(player.date_of_birth + 'T00:00:00').toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) },
              { label: 'Monthly fee',    value: `$${monthly} CAD (incl. GST)` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-brand-gray-400">{label}</p>
                <p className="font-semibold text-brand-black mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/dashboard/schedule', label: 'View Schedule' },
          { href: '/dashboard/posts',    label: 'Academy News' },
          { href: '/dashboard/contact',  label: 'Contact Us' },
          { href: '/dashboard/billing',  label: 'View Billing' },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            className="flex items-center justify-between bg-white border border-brand-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-brand-black hover:border-brand-orange transition-colors group">
            {label}
            <ChevronRight size={15} className="text-brand-gray-400 group-hover:text-brand-orange transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
