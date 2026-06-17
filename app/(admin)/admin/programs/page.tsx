import { createClient } from "@/lib/supabase/server";
import ProgramsClient from "./ProgramsClient";

interface Program {
  id: string; name: string; age_group: string | null;
  description: string | null; price: number | null;
  schedule_summary: string | null; is_active: boolean;
}

const MOCK_PROGRAMS: Program[] = [
  { id: "1", name: "Mini Strikers",     age_group: "U6 – U8",   price: 149, schedule_summary: "Tue & Thu · 5:00–6:00 PM", is_active: true,  description: "First touches, fun-first games." },
  { id: "2", name: "Development Squad", age_group: "U9 – U12",  price: 189, schedule_summary: "Mon, Wed & Fri · 5:30–7:00 PM", is_active: true,  description: "Building technical foundations." },
  { id: "3", name: "Elite Pathway",     age_group: "U13 – U16", price: 239, schedule_summary: "Mon–Thu · 6:00–7:30 PM", is_active: true,  description: "High-intensity competitive training." },
  { id: "4", name: "Pre-Academy",       age_group: "U17+",      price: 259, schedule_summary: "Mon, Tue & Thu · 7:00–8:30 PM", is_active: true,  description: "Elite training for the next level." },
];

export default async function AdminProgramsPage() {
  let programs: Program[] = MOCK_PROGRAMS;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("programs").select("*").order("price", { ascending: true });
    if (data && data.length > 0) programs = data as Program[];
  } catch { /* not connected */ }

  return (
    <div className="space-y-6">
      <ProgramsClient initial={programs} />
    </div>
  );
}
