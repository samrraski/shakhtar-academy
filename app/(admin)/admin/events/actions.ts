"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface EventPayload {
  id?: string;
  title: string;
  type: "training" | "game" | "tournament";
  program_id: string;
  location: string;
  start_time: string;
  end_time: string;
}

export async function upsertEvent(payload: EventPayload) {
  const supabase = createAdminClient();
  const body = {
    title: payload.title,
    type: payload.type,
    program_id: payload.program_id,
    location: payload.location || null,
    start_time: payload.start_time,
    end_time: payload.end_time || null,
  };

  if (payload.id) {
    const { error } = await supabase.from("events").update(body).eq("id", payload.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("events").insert(body);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/events");
  revalidatePath("/schedule");
}

export async function deleteEvent(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/schedule");
}
