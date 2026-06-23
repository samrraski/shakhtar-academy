'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brand-gray-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <LogOut size={18} />
      Sign out
    </button>
  );
}
