"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ProgramPayload {
  id?: string;
  name: string;
  description: string;
  min_age: number | null;
  max_age: number | null;
  price_cad: number;
  gst_rate: number;
  schedule_days: string[];
  schedule_time_start: string;
  schedule_time_end: string;
  location: string;
  is_active: boolean;
}

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function upsertProgram(payload: ProgramPayload) {
  const supabase = createAdminClient();
  const fields = {
    name: payload.name,
    description: payload.description || null,
    min_age: payload.min_age,
    max_age: payload.max_age,
    price_cad: payload.price_cad,
    gst_rate: payload.gst_rate,
    schedule_days: payload.schedule_days,
    schedule_time_start: payload.schedule_time_start || null,
    schedule_time_end: payload.schedule_time_end || null,
    location: payload.location || null,
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
