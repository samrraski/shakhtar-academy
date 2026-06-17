"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateRegistrationStatus(id: string, status: "active" | "cancelled") {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("registrations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/registrations");
}
