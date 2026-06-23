"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

interface Post { id: string; title: string; body: string | null; visibility: string; created_at: string; }

const VISIBILITY = [
  { value: "all", label: "Everyone" },
  { value: "parents", label: "Parents only" },
  { value: "staff", label: "Staff only" },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "", visibility: "all" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts").then(r => r.json()).then(data => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  function openAdd() { setForm({ title: "", content: "", visibility: "all" }); setEditing(null); setModal("add"); }
  function openEdit(p: Post) {
    setForm({ title: p.title, content: p.body ?? "", visibility: p.visibility });
    setEditing(p); setModal("edit");
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    const url = modal === "edit" ? `/api/posts/${editing!.id}` : "/api/posts";
    const method = modal === "edit" ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (modal === "edit") setPosts(ps => ps.map(p => p.id === editing!.id ? data : p));
    else setPosts(ps => [data, ...ps]);
    setSaving(false); setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(ps => ps.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={15} /> New Post
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No posts yet.</div>
        ) : posts.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-orange transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                  <span className="shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {VISIBILITY.find(v => v.value === p.visibility)?.label ?? p.visibility}
                  </span>
                </div>
                {p.body && <p className="text-sm text-gray-500 line-clamp-2">{p.body}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(p.created_at).toLocaleDateString("en-CA", { month:"short", day:"numeric", year:"numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{modal === "add" ? "New Post" : "Edit Post"}</h2>
              <button onClick={() => setModal(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
              <input className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Post title…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Content</label>
              <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange resize-none"
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your post…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Visible to</label>
              <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
                value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}>
                {VISIBILITY.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()}
                className="flex-1 bg-brand-orange text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {modal === "add" ? "Publish" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
