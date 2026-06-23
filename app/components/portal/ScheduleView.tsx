'use client';
import { useState, useTransition } from 'react';
import { MapPin, User, CheckCircle, XCircle, MinusCircle, ExternalLink, CalendarX } from 'lucide-react';
import { updateRsvp } from '@/app/actions/portal';

export type SessionWithAttendance = {
  id: string;
  session_date: string;
  time_start: string;
  time_end: string;
  address: string | null;
  google_maps_url: string | null;
  notes: string | null;
  program_name: string | null;
  trainer_name: string | null;
  my_status: string;
  attendance_id: string | null;
};

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}
function fmtTime(t: string) {
  const [h, mi] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function groupByDate(sessions: SessionWithAttendance[]) {
  const map = new Map<string, SessionWithAttendance[]>();
  for (const s of sessions) {
    const list = map.get(s.session_date) ?? [];
    list.push(s);
    map.set(s.session_date, list);
  }
  return map;
}

export default function ScheduleView({ sessions, playerId }: { sessions: SessionWithAttendance[]; playerId: string }) {
  const [, startTransition] = useTransition();
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(sessions.map(s => [s.id, s.my_status]))
  );

  function handleRsvp(sessionId: string, status: 'attend' | 'declined' | 'no_answer') {
    setStatuses(prev => ({ ...prev, [sessionId]: status }));
    startTransition(() => updateRsvp(sessionId, playerId, status));
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CalendarX size={40} className="text-brand-gray-400 mb-3" />
        <p className="font-medium text-brand-black">No upcoming sessions</p>
        <p className="text-sm text-brand-gray-400 mt-1">Check back soon — your trainer will schedule sessions here.</p>
      </div>
    );
  }

  const grouped = groupByDate(sessions);
  const sortedDates = Array.from(grouped.keys()).sort();

  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <div key={date}>
          <h2 className="text-xs font-semibold text-brand-gray-400 uppercase tracking-wide mb-3">
            {fmtDate(date)}
          </h2>
          <div className="space-y-3">
            {grouped.get(date)!.map(session => {
              const status = statuses[session.id] ?? 'no_answer';
              return (
                <div key={session.id} className="bg-white rounded-2xl border border-brand-gray-200 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-brand-black">
                        {fmtTime(session.time_start)} – {fmtTime(session.time_end)}
                      </p>
                      {session.program_name && (
                        <p className="text-xs text-brand-orange font-medium mt-0.5">{session.program_name}</p>
                      )}
                    </div>
                    <RsvpPill status={status} />
                  </div>

                  <div className="space-y-1.5 text-sm text-brand-gray-600">
                    {session.trainer_name && (
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-brand-gray-400 shrink-0" />
                        {session.trainer_name}
                      </div>
                    )}
                    {session.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-brand-gray-400 shrink-0" />
                        <span className="flex-1">{session.address}</span>
                        {session.google_maps_url && (
                          <a href={session.google_maps_url} target="_blank" rel="noopener noreferrer"
                            className="text-brand-orange text-xs flex items-center gap-0.5 hover:underline">
                            Map <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    )}
                    {session.notes && (
                      <p className="text-xs text-brand-gray-400">{session.notes}</p>
                    )}
                  </div>

                  <div className="pt-1 border-t border-brand-gray-200">
                    <p className="text-xs text-brand-gray-400 mb-2">Are you attending?</p>
                    <div className="flex gap-2">
                      {([
                        { value: 'attend',    label: 'Attending',    Icon: CheckCircle,  active: 'bg-green-50 border-green-300 text-green-700' },
                        { value: 'declined',  label: "Can't make it", Icon: XCircle,      active: 'bg-red-50 border-red-300 text-red-600' },
                        { value: 'no_answer', label: 'Unsure',        Icon: MinusCircle,  active: 'bg-brand-gray-100 border-brand-gray-300 text-brand-gray-600' },
                      ] as const).map(({ value, label, Icon, active }) => (
                        <button
                          key={value}
                          onClick={() => handleRsvp(session.id, value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg border font-medium transition-colors ${
                            status === value ? active : 'border-brand-gray-200 text-brand-gray-400 hover:bg-brand-gray-100'
                          }`}
                        >
                          <Icon size={13} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function RsvpPill({ status }: { status: string }) {
  if (status === 'attend')
    return <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Attending</span>;
  if (status === 'declined')
    return <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Declined</span>;
  return <span className="text-xs font-medium text-brand-gray-400 bg-brand-gray-100 border border-brand-gray-200 px-2 py-0.5 rounded-full">No response</span>;
}
