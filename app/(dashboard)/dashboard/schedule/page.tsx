import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Calendar, Clock, MapPin } from "lucide-react";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: players } = await admin.from("players").select("program_id").eq("user_id", user.id);
  const programIds = (players ?? []).map((p: any) => p.program_id).filter(Boolean);

  let sessions: any[] = [];
  if (programIds.length > 0) {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await admin
      .from("sessions")
      .select("*, programs(name), workers(first_name,last_name)")
      .in("program_id", programIds)
      .gte("session_date", today)
      .eq("is_cancelled", false)
      .order("session_date").order("time_start")
      .limit(20);
    sessions = data ?? [];
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Upcoming Sessions</h1>
      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No upcoming sessions scheduled.</p>
        </div>
      ) : sessions.map(s => (
        <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-gray-900">
                {new Date(s.session_date + "T00:00:00").toLocaleDateString("en-CA", { weekday:"long", month:"long", day:"numeric" })}
              </p>
              <p className="text-sm text-brand-orange font-medium">{s.programs?.name ?? "—"}</p>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Scheduled</span>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Clock size={14}/>{s.time_start.slice(0,5)} – {s.time_end.slice(0,5)}</div>
            <div className="flex items-center gap-2"><MapPin size={14}/>{s.address}</div>
            {s.workers && <div className="flex items-center gap-2"><span className="text-xs text-gray-400">Trainer:</span>{s.workers.first_name} {s.workers.last_name}</div>}
          </div>
          {s.google_maps_url && (
            <a href={s.google_maps_url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-orange hover:underline font-medium">
              <MapPin size={12}/> Open in Google Maps
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
