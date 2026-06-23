"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

interface Session {
  id?: string; program_id: string; worker_id: string | null;
  session_date: string; time_start: string; time_end: string;
  address: string; google_maps_url: string | null;
  notes: string | null; is_cancelled: boolean;
}

interface Program { id: string; name: string; }
interface Worker { id: string; first_name: string; last_name: string; }

const EMPTY: Omit<Session, "id"> = {
  program_id: "", worker_id: null, session_date: "",
  time_start: "17:00", time_end: "18:30",
  address: "", google_maps_url: null, notes: null, is_cancelled: false,
};

export default function SessionForm({ session }: { session?: Session }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Session, "id">>(session ? {
    program_id: session.program_id, worker_id: session.worker_id,
    session_date: session.session_date, time_start: session.time_start,
    time_end: session.time_end, address: session.address,
    google_maps_url: session.google_maps_url, notes: session.notes,
    is_cancelled: session.is_cancelled,
  } : EMPTY);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/programs").then(r => r.json()),
      fetch("/api/workers").then(r => r.json()),
    ]).then(([p, w]) => {
      setPrograms(Array.isArray(p) ? p : []);
      setWorkers(Array.isArray(w) ? w : []);
    });
  }, []);

  async function handleSave() {
    if (!form.program_id || !form.session_date || !form.address.trim()) {
      setError("Program, date, and address are required."); return;
    }
    setSaving(true); setError("");
    const url = session?.id ? `/api/sessions/${session.id}` : "/api/sessions";
    const method = session?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to save."); setSaving(false); return; }
    router.push("/admin/sessions");
    router.refresh();
  }

  async function handleDelete() {
    if (!session?.id || !confirm("Delete this session?")) return;
    setDeleting(true);
    await fetch(`/api/sessions/${session.id}`, { method: "DELETE" });
    router.push("/admin/sessions");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/admin/sessions")} className="text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{session ? "Edit Session" : "Add Session"}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Session Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Program *">
            <select className={INPUT} value={form.program_id} onChange={e => setForm(f => ({ ...f, program_id: e.target.value }))}>
              <option value="">Select program…</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Trainer">
            <select className={INPUT} value={form.worker_id ?? ""} onChange={e => setForm(f => ({ ...f, worker_id: e.target.value || null }))}>
              <option value="">Unassigned</option>
              {workers.map(w => <option key={w.id} value={w.id}>{w.first_name} {w.last_name}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Date *">
            <input type="date" className={INPUT} value={form.session_date} onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))} />
          </Field>
          <Field label="Start Time">
            <input type="time" className={INPUT} value={form.time_start} onChange={e => setForm(f => ({ ...f, time_start: e.target.value }))} />
          </Field>
          <Field label="End Time">
            <input type="time" className={INPUT} value={form.time_end} onChange={e => setForm(f => ({ ...f, time_end: e.target.value }))} />
          </Field>
        </div>
        <Field label="Address *">
          <input className={INPUT} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Calgary Soccer Centre, 7000 48 St SE" />
        </Field>
        <Field label="Google Maps URL">
          <input type="url" className={INPUT} value={form.google_maps_url ?? ""} onChange={e => setForm(f => ({ ...f, google_maps_url: e.target.value || null }))} placeholder="https://maps.google.com/…" />
        </Field>
        <Field label="Notes">
          <textarea rows={2} className={INPUT + " resize-none"} value={form.notes ?? ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))} placeholder="Internal notes…" />
        </Field>
        {session && (
          <div className="flex items-center gap-3">
            <input type="checkbox" id="cancelled" checked={form.is_cancelled} onChange={e => setForm(f => ({ ...f, is_cancelled: e.target.checked }))} className="w-4 h-4 accent-red-500" />
            <label htmlFor="cancelled" className="text-sm text-red-600 font-medium">Mark as cancelled</label>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        {session?.id && (
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors">
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
          </button>
        )}
        <button onClick={() => router.push("/admin/sessions")}
          className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-brand-orange text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {session ? "Save Changes" : "Add Session"}
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
