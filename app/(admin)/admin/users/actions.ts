"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function setUserRole(id: string, role: "admin" | "parent") {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}
