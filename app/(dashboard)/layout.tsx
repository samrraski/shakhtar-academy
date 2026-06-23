import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PortalNav from '@/app/components/portal/PortalNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="flex min-h-screen bg-brand-gray-100">
      <PortalNav email={user.email} />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
