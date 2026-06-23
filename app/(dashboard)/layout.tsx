import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.full_name ?? user?.email ?? undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userName={name} />
      <main className="max-w-screen-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
