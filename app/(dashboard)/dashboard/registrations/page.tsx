import { createClient } from "@/lib/supabase/server";
import RegistrationsView, { type Registration } from "./RegistrationsView";

export default async function RegistrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: players } = await supabase
    .from("players")
    .select("id, full_name")
    .eq("parent_id", user!.id)
    .order("full_name", { ascending: true });

  const playerIds = (players ?? []).map((p) => p.id);

  const { data: programs } = await supabase
    .from("programs")
    .select("id, name, age_group, price, schedule_summary")
    .eq("is_active", true)
    .order("name", { ascending: true });

  let registrations: Registration[] = [];
  if (playerIds.length > 0) {
    const { data } = await supabase
      .from("registrations")
      .select("id, status, created_at, player_id, players(full_name), programs(id, name, age_group)")
      .in("player_id", playerIds)
      .order("created_at", { ascending: false });
    registrations = (data ?? []) as unknown as Registration[];
  }

  return (
    <RegistrationsView
      initialRegistrations={registrations}
      players={players ?? []}
      programs={programs ?? []}
    />
  );
}
