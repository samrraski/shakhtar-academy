import { createAdminClient } from "@/lib/supabase/admin";
import InquiriesClient from "./InquiriesClient";

export default async function AdminInquiriesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("inquiries")
    .select("id,name,email,phone,program_interest,message,status,created_at")
    .order("created_at", { ascending: false });

  return <InquiriesClient initialInquiries={data ?? []} />;
}
