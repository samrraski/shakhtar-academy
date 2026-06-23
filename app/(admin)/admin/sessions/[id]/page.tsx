import { createAdminClient } from "@/lib/supabase/admin";
import SessionForm from "../SessionForm";
import { notFound } from "next/navigation";

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("sessions").select("*").eq("id", id).single();
  if (!data) notFound();
  return <SessionForm session={data} />;
}
