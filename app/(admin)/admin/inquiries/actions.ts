"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatus(id: string, status: "contacted" | "closed") {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inquiries");
}
