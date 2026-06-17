import { createClient } from "@/lib/supabase/server";
import EventsClient from "./EventsClient";

interface Event {
  id: string; title: string; type: string;
  location: string | null; start_time: string; end_time: string | null;
  programs: { name: string } | null;
}

interface Program { id: string; name: string; }

export default async function AdminEventsPage() {
  let events: Event[] = [];
  let programs: Program[] = [];
  try {
    const supabase = await createClient();
    const [eventsRes, programsRes] = await Promise.all([
      supabase
        .from("events")
        .select("id, title, type, location, start_time, end_time, programs(name)")
        .order("start_time", { ascending: true }),
      supabase
        .from("programs")
        .select("id, name")
        .eq("is_active", true)
        .order("name", { ascending: true }),
    ]);
    events = (eventsRes.data ?? []) as unknown as Event[];
    programs = (programsRes.data ?? []) as Program[];
  } catch { /* not connected */ }

  return <EventsClient initialEvents={events} programs={programs} />;
}
