import { createClient } from "@/lib/supabase/server";
import PlayersView from "./PlayersView";

export default async function PlayersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("parent_id", user!.id)
    .order("full_name", { ascending: true });

  return <PlayersView initialPlayers={players ?? []} />;
}
