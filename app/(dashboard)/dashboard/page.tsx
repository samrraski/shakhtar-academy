import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users, ClipboardList, Calendar, Plus, ArrowRight,
  CheckCircle2, Clock, MapPin, Settings,
} from "lucide-react";

interface PlayerRow {
  id: string;
  full_name: string;
  date_of_birth: string | null;
}

interface RegistrationRow {
  id: string;
  status: string;
  players: { full_name: string } | null;
  programs: { id: string; name: string; age_group: string | null } | null;
}

interface EventRow {
  id: string;
  title: string;
  type: string;
  location: string | null;
  start_time: string;
  programs: { name: string } | null;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: playersData } = await supabase
    .from("players")
    .select("id, full_name, date_of_birth")
    .eq("parent_id", user.id)
    .order("full_name", { ascending: true });
  const players = (playersData ?? []) as PlayerRow[];
  const playerIds = players.map((p) => p.id);

  let registrations: RegistrationRow[] = [];
  if (playerIds.length > 0) {
    const { data } = await supabase
      .from("registrations")
      .select("id, status, players(full_name), programs(id, name, age_group)")
      .in("player_id", playerIds)
      .order("created_at", { ascending: false });
    registrations = (data ?? []) as unknown as RegistrationRow[];
  }

  const activeProgramIds = Array.from(
    new Set(
      registrations
        .filter((r) => r.status === "active" && r.programs?.id)
        .map((r) => r.programs!.id)
    )
  );

  let upcomingEvents: EventRow[] = [];
  if (activeProgramIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("id, title, type, location, start_time, programs(name)")
      .in("program_id", activeProgramIds)
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(5);
    upcomingEvents = (data ?? []) as unknown as EventRow[];
  }

  const activeCount = registrations.filter((r) => r.status === "active").length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;

  const stats = [
    { label: "My Players",      value: players.length,        icon: Users,         href: "/dashboard/players",       color: "text-blue-500"   },
    { label: "Active Programs", value: activeCount,           icon: CheckCircle2,  href: "/dashboard/registrations", color: "text-green-500"  },
    { label: "Pending Review",  value: pendingCount,          icon: Clock,         href: "/dashboard/registrations", color: "text-yellow-600" },
    { label: "Upcoming Events", value: upcomingEvents.length, icon: Calendar,      href: "/dashboard/schedule",      color: "text-brand-orange" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Overview</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">Here&apos;s what&apos;s happening with your players.</p>
        </div>
        <Link
          href="/dashboard/registrations"
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Register a Player
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 border border-brand-gray-200 hover:border-brand-orange transition-colors group"
          >
            <div className="w-9 h-9 bg-brand-gray-100 group-hover:bg-brand-orange/10 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-brand-black">{value}</p>
            <p className="text-xs text-brand-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Players */}
        <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gray-200">
            <h2 className="font-semibold text-brand-black">My Players</h2>
            <Link href="/dashboard/players" className="text-xs text-brand-orange hover:text-brand-orange-hover font-medium flex items-center gap-1 transition-colors">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          {players.length === 0 ? (
            <div className="py-14 text-center text-sm text-brand-gray-400">
              No players added yet.{" "}
              <Link href="/dashboard/players" className="text-brand-orange hover:underline">
                Add your first player →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-brand-gray-200">
              {players.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-gray-100 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-brand-orange">{p.full_name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{p.full_name}</p>
                    {p.date_of_birth && (
                      <p className="text-xs text-brand-gray-400 mt-0.5">Born {p.date_of_birth}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gray-200">
            <h2 className="font-semibold text-brand-black">Upcoming Events</h2>
            <Link href="/dashboard/schedule" className="text-xs text-brand-orange hover:text-brand-orange-hover font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="py-14 text-center text-sm text-brand-gray-400 px-6">
              {activeProgramIds.length === 0
                ? <>No active program registrations yet — once you&apos;re registered, upcoming sessions and games will show up here.</>
                : <>No upcoming events scheduled right now. Check back soon!</>
              }
            </div>
          ) : (
            <ul className="divide-y divide-brand-gray-200">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-brand-gray-100 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <Calendar size={15} className="text-brand-orange" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{e.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="text-xs text-brand-gray-400">{fmtDate(e.start_time)}</span>
                      {e.location && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                          <MapPin size={10} /> {e.location}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/dashboard/players",       label: "Add a Player",      desc: "Add your child's info",        icon: Users         },
          { href: "/dashboard/registrations", label: "Register",          desc: "Sign up for a program",        icon: ClipboardList },
          { href: "/dashboard/schedule",      label: "View Schedule",     desc: "See upcoming sessions & games", icon: Calendar      },
          { href: "/dashboard/settings",      label: "Account Settings",  desc: "Update your contact info",     icon: Settings      },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-brand-gray-200 p-5 hover:border-brand-orange transition-colors group flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-brand-gray-100 group-hover:bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
              <Icon
                size={18}
                className="text-brand-gray-600 group-hover:text-brand-orange transition-colors"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-black">{label}</p>
              <p className="text-xs text-brand-gray-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
