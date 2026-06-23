import { createAdminClient } from "@/lib/supabase/admin";
import PlayerForm from "../PlayerForm";
import { notFound } from "next/navigation";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("players").select("*").eq("id", id).single();
  if (!data) notFound();
  return <PlayerForm player={data} />;
}
