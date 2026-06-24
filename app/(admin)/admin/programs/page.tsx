import { createAdminClient } from "@/lib/supabase/admin";
import ProgramsClient from "./ProgramsClient";

export default async function AdminProgramsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("programs")
    .select("id,name,age_min,age_max,price_cad,gst_rate,schedule_days,sessions_min,sessions_max,is_active")
    .order("price_cad", { ascending: true });

  return (
    <div className="space-y-6">
      <ProgramsClient initial={data ?? []} />
    </div>
  );
}
