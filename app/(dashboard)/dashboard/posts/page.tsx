import { createAdminClient } from "@/lib/supabase/admin";
import { Newspaper } from "lucide-react";

export default async function DashboardPostsPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("posts")
    .select("id,title,body,visibility,created_at,workers(first_name,last_name)")
    .in("visibility", ["all", "parents"])
    .order("created_at", { ascending: false })
    .limit(30);

  const posts = data ?? [];

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">News & Updates</h1>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Newspaper size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No posts yet. Check back soon!</p>
        </div>
      ) : posts.map((p: any) => (
        <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-bold text-gray-900">{p.title}</h2>
            <span className="shrink-0 text-xs text-gray-400">
              {new Date(p.created_at).toLocaleDateString("en-CA", { month:"short", day:"numeric" })}
            </span>
          </div>
          {p.body && <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>}
          {p.workers && (
            <p className="text-xs text-gray-400">— {(p.workers as any).first_name} {(p.workers as any).last_name}</p>
          )}
        </div>
      ))}
    </div>
  );
}
