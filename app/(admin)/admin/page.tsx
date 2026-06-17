import { createClient } from "@/lib/supabase/server";
import { Users, ClipboardList, Calendar, MessageSquare, BookOpen, TrendingUp } from "lucide-react";

const MOCK = {
  programs: 4, users: 0, players: 0,
  registrations: { pending: 0, active: 0, cancelled: 0 },
  events: 0, inquiries: { new: 0, contacted: 0 },
};

export default async function AdminOverviewPage() {
  let data = MOCK;
  let connected = false;

  try {
    const supabase = await createClient();
    const [programs, users, players, registrations, events, inquiries] = await Promise.all([
      supabase.from("programs").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("registrations").select("id, status"),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("inquiries").select("id, status"),
    ]);

    const regs = (registrations.data ?? []) as { status: string }[];
    const inqs = (inquiries.data ?? []) as { status: string }[];

    data = {
      programs: programs.count ?? 0,
      users: users.count ?? 0,
      players: players.count ?? 0,
      registrations: {
        pending:   regs.filter(r => r.status === "pending").length,
        active:    regs.filter(r => r.status === "active").length,
        cancelled: regs.filter(r => r.status === "cancelled").length,
      },
      events: events.count ?? 0,
      inquiries: {
        new:       inqs.filter(i => i.status === "new").length,
        contacted: inqs.filter(i => i.status === "contacted").length,
      },
    };
    connected = true;
  } catch { /* Supabase not connected — showing defaults */ }

  const cards = [
    { label: "Programs",           value: data.programs,                       icon: BookOpen,      color: "bg-blue-500",   href: "/admin/programs"      },
    { label: "Registered Parents", value: data.users,                          icon: Users,         color: "bg-purple-500", href: "/admin/users"         },
    { label: "Players",            value: data.players,                        icon: TrendingUp,    color: "bg-green-500",  href: "/admin/users"         },
    { label: "Active Enrolments",  value: data.registrations.active,           icon: ClipboardList, color: "bg-brand-orange", href: "/admin/registrations" },
    { label: "Pending Approval",   value: data.registrations.pending,          icon: ClipboardList, color: "bg-yellow-500", href: "/admin/registrations" },
    { label: "Upcoming Events",    value: data.events,                         icon: Calendar,      color: "bg-cyan-500",   href: "/admin/events"        },
    { label: "New Inquiries",      value: data.inquiries.new,                  icon: MessageSquare, color: "bg-red-500",    href: "/admin/inquiries"     },
    { label: "Inquiries Contacted",value: data.inquiries.contacted,            icon: MessageSquare, color: "bg-gray-500",   href: "/admin/inquiries"     },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black font-display uppercase">Admin Overview</h1>
        <p className="text-brand-gray-400 text-sm mt-1">Shakhtar Academy Calgary — management panel</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <a key={label} href={href} className="bg-white rounded-2xl p-5 border border-brand-gray-200 hover:border-brand-orange transition-colors group">
            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-3xl font-black text-brand-black">{value}</p>
            <p className="text-xs text-brand-gray-400 mt-0.5">{label}</p>
          </a>
        ))}
      </div>

      {connected ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm flex items-center gap-3">
          <span className="text-green-500 text-lg">✓</span>
          <div>
            <p className="font-bold text-green-800">Database connected</p>
            <p className="text-green-700 mt-0.5">Live data from Supabase. All stats update in real-time as parents register and inquiries come in.</p>
          </div>
        </div>
      ) : (
        <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-5 text-sm text-brand-black">
          <p className="font-bold mb-1">⚡ Connect Supabase to see live data</p>
          <p className="text-brand-gray-600">Add your real Supabase keys to <code className="bg-white px-1.5 py-0.5 rounded text-xs">.env.local</code> and run the schema — all stats, registrations, and inquiries will populate automatically.</p>
        </div>
      )}
    </div>
  );
}
