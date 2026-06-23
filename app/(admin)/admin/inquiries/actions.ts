"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatus(id: string, status: "in_progress" | "resolved") {
  const supabase = createAdminClient();
  const update: Record<string, unknown> = { status };
  if (status === "resolved") update.resolved_at = new Date().toISOString();
  const { error } = await supabase.from("inquiries").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inquiries");
}
