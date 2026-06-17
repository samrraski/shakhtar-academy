import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, MapPin, Clock, ClipboardList, Trophy, Dumbbell, Star } from "lucide-react";

interface ProgramRow {
  id: string;
  name: string;
  age_group: string | null;
  schedule_summary: string | null;
}

interface EventRow {
  id: string;
  title: string;
  type: string;
  location: string | null;
  start_time: string;
  end_time: string | null;
  programs: { name: string } | null;
}

const TYPE_ICONS: Record<string, typeof Dumbbell> = {
  training: Dumbbell,
  game: Trophy,
  tournament: Star,
};

const TYPE_LABELS: Record<string, string> = {
  training: "Training",
  game: "Game",
  tournament: "Tournament",
};

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });

export default async function DashboardSchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: playersData } = await supabase
    .from("players")
    .select("id")
    .eq("parent_id", user.id);
  const playerIds = (playersData ?? []).map((p) => p.id as string);

  const activePrograms: ProgramRow[] = [];
  if (playerIds.length > 0) {
    const { data } = await supabase
      .from("registrations")
      .select("status, programs(id, name, age_group, schedule_summary)")
      .in("player_id", playerIds)
      .eq("status", "active");

    const seen = new Set<string>();
    for (const row of (data ?? []) as unknown as { programs: ProgramRow | null }[]) {
      const p = row.programs;
      if (p && !seen.has(p.id)) { seen.add(p.id); activePrograms.push(p); }
    }
  }

  const programIds = activePrograms.map((p) => p.id);

  let events: EventRow[] = [];
  if (programIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("id, title, type, location, start_time, end_time, programs(name)")
      .in("program_id", programIds)
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(30);
    events = (data ?? []) as unknown as EventRow[];
  }

  // Group events by calendar day
  const groups: { day: string; items: EventRow[] }[] = [];
  for (const e of events) {
    const day = fmtDay(e.start_time);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(e);
    else groups.push({ day, items: [e] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">My Schedule</h1>
        <p className="text-brand-gray-400 text-sm mt-0.5">
          Upcoming sessions, games, and events for your registered programs.
        </p>
      </div>

      {activePrograms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-gray-200 py-16 text-center px-6">
          <Calendar size={32} className="mx-auto text-brand-gray-200 mb-3" />
          <p className="text-brand-gray-400 text-sm max-w-sm mx-auto">
            Your personalized schedule shows up here once you have an{" "}
            <span className="font-medium text-brand-black">active</span> program registration.
          </p>
          <Link
            href="/dashboard/registrations"
            className="mt-4 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <ClipboardList size={15} /> Register a Player
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming events */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-gray-200">
              <h2 className="font-semibold text-brand-black">Upcoming</h2>
            </div>
            {groups.length === 0 ? (
              <div className="py-14 text-center text-sm text-brand-gray-400 px-6">
                No upcoming events scheduled right now. Check back soon!
              </div>
            ) : (
              <div className="divide-y divide-brand-gray-200">
                {groups.map((g) => (
                  <div key={g.day} className="px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-400 mb-3">{g.day}</p>
                    <ul className="space-y-3">
                      {g.items.map((e) => {
                        const Icon = TYPE_ICONS[e.type] ?? Calendar;
                        return (
                          <li key={e.id} className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
                              <Icon size={15} className="text-brand-orange" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-brand-black truncate">{e.title}</p>
                                <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full shrink-0">
                                  {TYPE_LABELS[e.type] ?? e.type}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                                  <Clock size={10} />
                                  {fmtTime(e.start_time)}{e.end_time ? ` – ${fmtTime(e.end_time)}` : ""}
                                </span>
                                {e.location && (
                                  <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                                    <MapPin size={10} /> {e.location}
                                  </span>
                                )}
                                {e.programs?.name && (
                                  <span className="text-xs text-brand-gray-400">{e.programs.name}</span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active programs / weekly rhythm */}
          <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden h-fit">
            <div className="px-5 py-4 border-b border-brand-gray-200">
              <h2 className="font-semibold text-brand-black">Your Programs</h2>
            </div>
            <ul className="divide-y divide-brand-gray-200">
              {activePrograms.map((p) => (
                <li key={p.id} className="px-5 py-4">
                  <p className="text-sm font-semibold text-brand-black">{p.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {p.age_group && (
                      <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full">
                        {p.age_group}
                      </span>
                    )}
                  </div>
                  {p.schedule_summary && (
                    <p className="flex items-start gap-1.5 text-xs text-brand-gray-600 mt-2">
                      <Clock size={12} className="text-brand-gray-400 mt-0.5 shrink-0" /> {p.schedule_summary}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
