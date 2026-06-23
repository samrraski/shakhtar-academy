import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsView from './SettingsView';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Pull display name + phone from user_metadata (no separate profiles table needed)
  const meta = user.user_metadata ?? {};
  const profile = {
    id: user.id,
    full_name: (meta.full_name as string) ?? null,
    phone: (meta.phone as string) ?? null,
  };

  return <SettingsView profile={profile} email={user.email ?? ''} />;
}
