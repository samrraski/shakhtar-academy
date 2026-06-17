"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ProgramPayload {
  id?: string;
  name: string;
  age_group: string;
  description: string;
  price: number;
  schedule_summary: string;
  is_active: boolean;
}

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function upsertProgram(payload: ProgramPayload) {
  const supabase = createAdminClient();

  if (payload.id && isUUID(payload.id)) {
    const { error } = await supabase
      .from("programs")
      .update({
        name: payload.name,
        age_group: payload.age_group,
        description: payload.description,
        price: payload.price,
        schedule_summary: payload.schedule_summary,
        is_active: payload.is_active,
      })
      .eq("id", payload.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("programs").insert({
      name: payload.name,
      age_group: payload.age_group,
      description: payload.description,
      price: payload.price,
      schedule_summary: payload.schedule_summary,
      is_active: payload.is_active,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}

export async function toggleProgramStatus(id: string, is_active: boolean) {
  if (!isUUID(id)) throw new Error("Cannot toggle a program that hasn't been saved to the database yet.");
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("programs")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
