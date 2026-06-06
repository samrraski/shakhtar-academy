import { createClient } from "@/lib/supabase/server";
import SettingsView from "./SettingsView";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return <SettingsView profile={profile} email={user!.email ?? ""} />;
}
