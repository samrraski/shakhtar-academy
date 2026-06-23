'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function updateRsvp(sessionId: string, playerId: string, status: 'attend' | 'declined' | 'no_answer') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const admin = createAdminClient();
  // Verify player belongs to this user
  const { data: player } = await admin
    .from('players')
    .select('id')
    .eq('id', playerId)
    .eq('user_id', user.id)
    .single();

  if (!player) throw new Error('Unauthorized');

  await admin.from('attendance').upsert(
    { session_id: sessionId, player_id: playerId, status, responded_at: new Date().toISOString() },
    { onConflict: 'session_id,player_id' }
  );

  revalidatePath('/dashboard/schedule');
}

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const admin = createAdminClient();
  const { error } = await admin.from('inquiries').insert({
    contact_name: formData.get('name') as string,
    contact_email: formData.get('email') as string || user.email,
    contact_phone: (formData.get('phone') as string) || null,
    message: formData.get('message') as string,
    status: 'new',
  });

  if (error) throw error;
}
