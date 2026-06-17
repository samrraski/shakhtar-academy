import { createClient } from "@/lib/supabase/server";
import UsersClient from "./UsersClient";

interface Profile {
  id: string; full_name: string | null; phone: string | null;
  role: string; created_at: string;
}

export default async function AdminUsersPage() {
  let users: Profile[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, created_at")
      .order("created_at", { ascending: false });
    users = (data ?? []) as Profile[];
  } catch { /* not connected */ }

  return <UsersClient initialUsers={users} />;
}
