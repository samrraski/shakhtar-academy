import { createAdminClient } from "@/lib/supabase/admin";
import ProgramsClient from "./ProgramsClient";

export default async function AdminProgramsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("programs")
    .select("id,name,description,min_age,max_age,price_cad,gst_rate,schedule_days,schedule_time_start,schedule_time_end,location,is_active")
    .order("price_cad", { ascending: true });

  return (
    <div className="space-y-6">
      <ProgramsClient initial={data ?? []} />
    </div>
  );
}
