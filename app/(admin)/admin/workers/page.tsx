"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Mail, Phone } from "lucide-react";

interface Worker {
  id: string; first_name: string; last_name: string;
  email: string; phone: string | null; role: string;
  years_experience: number | null; is_active: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  head_trainer: "Head Trainer", trainer: "Trainer",
  coordinator: "Coordinator", admin: "Admin", other: "Other",
};

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", phone:"", role:"trainer", years_experience:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/workers").then(r => r.json()).then(data => {
      setWorkers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  function openAdd() { setForm({ first_name:"", last_name:"", email:"", phone:"", role:"trainer", years_experience:"" }); setEditing(null); setModal("add"); }
  function openEdit(w: Worker) {
    setForm({ first_name:w.first_name, last_name:w.last_name, email:w.email, phone:w.phone??'', role:w.role, years_experience:w.years_experience?.toString()??'' });
    setEditing(w); setModal("edit");
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, years_experience: form.years_experience ? Number(form.years_experience) : null, phone: form.phone || null };
    const url = modal === "edit" ? `/api/workers/${editing!.id}` : "/api/workers";
    const res = await fetch(url, { method: modal === "edit" ? "PUT" : "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (modal === "edit") setWorkers(ws => ws.map(w => w.id === editing!.id ? data : w));
    else setWorkers(ws => [...ws, data]);
    setSaving(false); setModal(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={15} /> Add worker
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Worker","Role","Contact","Experience","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Loading…</td></tr>
            ) : workers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No workers yet.</td></tr>
            ) : workers.map(w => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{w.first_name} {w.last_name}</td>
                <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{ROLE_LABELS[w.role] ?? w.role}</span></td>
                <td className="px-4 py-3 text-gray-600">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1"><Mail size={11}/>{w.email}</span>
                    {w.phone && <span className="flex items-center gap-1"><Phone size={11}/>{w.phone}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{w.years_experience ? `${w.years_experience} yrs` : "—"}</td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${w.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{w.is_active ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(w)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"><Pencil size={12}/> Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{modal === "add" ? "Add worker" : "Edit worker"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">First name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" value={form.first_name} onChange={e => setForm(f=>({...f,first_name:e.target.value}))}/></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Last name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" value={form.last_name} onChange={e => setForm(f=>({...f,last_name:e.target.value}))}/></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}/></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}>
                  {Object.entries(ROLE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Years exp.</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" value={form.years_experience} onChange={e => setForm(f=>({...f,years_experience:e.target.value}))}/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-orange text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
