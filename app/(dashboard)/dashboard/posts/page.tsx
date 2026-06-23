import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Newspaper } from 'lucide-react';

function fmtDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const admin = createAdminClient();
  const { data: posts } = await admin
    .from('posts')
    .select('id, title, body, media_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Academy News</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">Updates and announcements from the academy.</p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Newspaper size={40} className="text-brand-gray-200 mb-3" />
          <p className="font-medium text-brand-black">No posts yet</p>
          <p className="text-sm text-brand-gray-400 mt-1">The academy will share updates here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
              {post.media_url && (
                <div className="w-full h-44 bg-brand-gray-100 overflow-hidden">
                  <img src={post.media_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 space-y-2">
                <p className="text-xs text-brand-orange font-semibold uppercase tracking-wide">
                  {fmtDate(post.published_at ?? post.created_at)}
                </p>
                <h2 className="font-bold text-brand-black leading-snug">{post.title}</h2>
                <p className="text-sm text-brand-gray-600 leading-relaxed whitespace-pre-wrap">{post.body}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
