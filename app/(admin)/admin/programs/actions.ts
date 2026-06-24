"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ProgramPayload {
  id?: string;
  name: string;
  age_min: number | null;
  age_max: number | null;
  price_cad: number;
  gst_rate: number;
  schedule_days: string[];
  sessions_min: number | null;
  sessions_max: number | null;
  is_active: boolean;
}

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function upsertProgram(payload: ProgramPayload) {
  const supabase = createAdminClient();
  const fields = {
    name: payload.name,
    age_min: payload.age_min,
    age_max: payload.age_max,
    price_cad: payload.price_cad,
    gst_rate: payload.gst_rate,
    schedule_days: payload.schedule_days,
    sessions_min: payload.sessions_min,
    sessions_max: payload.sessions_max,
    is_active: payload.is_active,
  };

  if (payload.id && isUUID(payload.id)) {
    const { error } = await supabase.from("programs").update(fields).eq("id", payload.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("programs").insert(fields);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}

export async function toggleProgramStatus(id: string, is_active: boolean) {
  if (!isUUID(id)) throw new Error("Cannot toggle a program that hasn't been saved yet.");
  const supabase = createAdminClient();
  const { error } = await supabase.from("programs").update({ is_active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
