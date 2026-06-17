import { createClient } from "@/lib/supabase/server";
import RegistrationsClient from "./RegistrationsClient";

interface Reg {
  id: string; status: string; created_at: string;
  players: { full_name: string } | null;
  programs: { name: string; age_group: string | null } | null;
}

export default async function AdminRegistrationsPage() {
  let regs: Reg[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("registrations")
      .select("id, status, created_at, players(full_name), programs(name, age_group)")
      .order("created_at", { ascending: false });
    regs = (data ?? []) as unknown as Reg[];
  } catch { /* not connected */ }

  return <RegistrationsClient initialRegs={regs} />;
}
