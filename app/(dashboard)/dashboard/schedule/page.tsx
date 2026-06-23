import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import ScheduleView, { type SessionWithAttendance } from '@/app/components/portal/ScheduleView';

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const admin = createAdminClient();
  const { data: player } = await admin
    .from('players')
    .select('id, program_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  let sessions: SessionWithAttendance[] = [];

  if (player?.program_id) {
    const today = new Date().toISOString().split('T')[0];
    const { data: raw } = await admin
      .from('sessions')
      .select('id, session_date, time_start, time_end, address, google_maps_url, notes, programs(name), workers(first_name, last_name)')
      .eq('program_id', player.program_id)
      .eq('is_cancelled', false)
      .gte('session_date', today)
      .order('session_date').order('time_start')
      .limit(40);

    if (raw && raw.length > 0) {
      const { data: att } = await admin
        .from('attendance')
        .select('session_id, id, status')
        .eq('player_id', player.id)
        .in('session_id', raw.map(s => s.id));

      const attMap = Object.fromEntries((att ?? []).map(a => [a.session_id, a]));
      sessions = raw.map(s => {
        const prog = (Array.isArray(s.programs) ? s.programs[0] : s.programs) as { name: string } | null;
        const wk = (Array.isArray(s.workers) ? s.workers[0] : s.workers) as { first_name: string; last_name: string } | null;
        return {
          id: s.id,
          session_date: s.session_date,
          time_start: s.time_start,
          time_end: s.time_end,
          address: s.address,
          google_maps_url: s.google_maps_url,
          notes: s.notes,
          program_name: prog?.name ?? null,
          trainer_name: wk ? `${wk.first_name} ${wk.last_name}` : null,
          my_status: attMap[s.id]?.status ?? 'no_answer',
          attendance_id: attMap[s.id]?.id ?? null,
        };
      });
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Training Schedule</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">
          {sessions.length > 0
            ? `${sessions.length} upcoming session${sessions.length !== 1 ? 's' : ''}`
            : 'No sessions scheduled yet'}
        </p>
      </div>
      <ScheduleView sessions={sessions} playerId={player?.id ?? ''} />
    </div>
  );
}
