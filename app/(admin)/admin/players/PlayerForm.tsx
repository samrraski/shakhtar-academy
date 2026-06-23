"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

interface Player {
  id?: string; first_name: string; last_name: string;
  date_of_birth: string; program_id: string | null;
  parent_name: string | null; parent_email: string | null; parent_phone: string | null;
  notes: string | null; is_active: boolean; user_id: string | null;
}

interface Program { id: string; name: string; }

const EMPTY: Omit<Player, "id"> = {
  first_name: "", last_name: "", date_of_birth: "",
  program_id: null, parent_name: null, parent_email: null, parent_phone: null,
  notes: null, is_active: true, user_id: null,
};

export default function PlayerForm({ player }: { player?: Player }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Player, "id">>(player ? {
    first_name: player.first_name, last_name: player.last_name,
    date_of_birth: player.date_of_birth, program_id: player.program_id,
    parent_name: player.parent_name, parent_email: player.parent_email,
    parent_phone: player.parent_phone, notes: player.notes,
    is_active: player.is_active, user_id: player.user_id,
  } : EMPTY);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/programs").then(r => r.json()).then(data => setPrograms(Array.isArray(data) ? data : []));
  }, []);

  async function handleSave() {
    if (!form.first_name.trim() || !form.last_name.trim() || !form.date_of_birth) {
      setError("First name, last name, and date of birth are required."); return;
    }
    setSaving(true); setError("");
    const url = player?.id ? `/api/players/${player.id}` : "/api/players";
    const method = player?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to save."); setSaving(false); return; }
    router.push("/admin/players");
    router.refresh();
  }

  async function handleDelete() {
    if (!player?.id || !confirm("Delete this player? This action cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/players/${player.id}`, { method: "DELETE" });
    router.push("/admin/players");
    router.refresh();
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value || null }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/admin/players")} className="text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{player ? "Edit Player" : "Add Player"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{player ? `${player.first_name} ${player.last_name}` : "New player registration"}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Player Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name *">
            <input className={INPUT} value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="Ahmed" />
          </Field>
          <Field label="Last Name *">
            <input className={INPUT} value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Al-Hassan" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of Birth *">
            <input type="date" className={INPUT} value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
          </Field>
          <Field label="Program">
            <select className={INPUT} value={form.program_id ?? ""} onChange={e => setForm(f => ({ ...f, program_id: e.target.value || null }))}>
              <option value="">No program</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
            className="w-4 h-4 accent-brand-orange" />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active player</label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Parent / Guardian</h2>
        <Field label="Parent Name">
          <input className={INPUT} value={form.parent_name ?? ""} onChange={set("parent_name")} placeholder="Mohammed Al-Hassan" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input type="email" className={INPUT} value={form.parent_email ?? ""} onChange={set("parent_email")} placeholder="parent@email.com" />
          </Field>
          <Field label="Phone">
            <input type="tel" className={INPUT} value={form.parent_phone ?? ""} onChange={set("parent_phone")} placeholder="+1 403 555 0000" />
          </Field>
        </div>
        <Field label="Portal Account (Supabase Auth user_id)">
          <input className={INPUT} value={form.user_id ?? ""} onChange={set("user_id")} placeholder="UUID — leave blank if not registered" />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Notes</h2>
        <textarea rows={3} className={INPUT + " resize-none"} value={form.notes ?? ""} onChange={set("notes")} placeholder="Internal notes about this player…" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        {player?.id && (
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors">
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
          </button>
        )}
        <button onClick={() => router.push("/admin/players")}
          className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-brand-orange text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {player ? "Save Changes" : "Add Player"}
        </button>
      </div>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}
