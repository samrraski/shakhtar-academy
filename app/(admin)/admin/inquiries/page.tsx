import { createClient } from "@/lib/supabase/server";
import InquiriesClient from "./InquiriesClient";

interface Inquiry {
  id: string; name: string; email: string; phone: string | null;
  program_interest: string | null; message: string | null;
  status: string; created_at: string;
}

export default async function AdminInquiriesPage() {
  let inquiries: Inquiry[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    inquiries = (data ?? []) as Inquiry[];
  } catch { /* not connected */ }

  return <InquiriesClient initialInquiries={inquiries} />;
}
