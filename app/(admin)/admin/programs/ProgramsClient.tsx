"use client";

import { useState, useTransition } from "react";
import { Plus, CheckCircle2, XCircle, X, Loader2 } from "lucide-react";
import { upsertProgram, toggleProgramStatus, type ProgramPayload } from "./actions";

interface Program {
  id: string; name: string; age_group: string | null;
  description: string | null; price: number | null;
  schedule_summary: string | null; is_active: boolean;
}

const EMPTY: Omit<ProgramPayload, "id"> = {
  name: "", age_group: "", description: "",
  price: 0, schedule_summary: "", is_active: true,
};

export default function ProgramsClient({ initial }: { initial: Program[] }) {
  const [programs, setPrograms] = useState<Program[]>(initial);
  const [editing, setEditing] = useState<Program | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<ProgramPayload, "id">>(EMPTY);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openEdit(p: Program) {
    setEditing(p);
    setForm({
      name: p.name,
      age_group: p.age_group ?? "",
      description: p.description ?? "",
      price: p.price ?? 0,
      schedule_summary: p.schedule_summary ?? "",
      is_active: p.is_active,
    });
    setError("");
  }

  function openCreate() {
    setCreating(true);
    setForm(EMPTY);
    setError("");
  }

  function closeModal() {
    setEditing(null);
    setCreating(false);
    setError("");
  }

  function handleSave() {
    if (!form.name.trim()) { setError("Program name is required."); return; }
    if (form.price <= 0) { setError("Price must be greater than 0."); return; }

    startTransition(async () => {
      try {
        await upsertProgram({ ...form, id: editing?.id });

        if (editing) {
          setPrograms(prev => prev.map(p =>
            p.id === editing.id ? { ...p, ...form } : p
          ));
        } else {
          // Optimistically add with temp id — page will revalidate with real id
          setPrograms(prev => [...prev, { id: `tmp-${Date.now()}`, ...form }]);
        }
        closeModal();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to save. Try again.");
      }
    });
  }

  function handleToggle(p: Program) {
    const next = !p.is_active;
    setPrograms(prev => prev.map(x => x.id === p.id ? { ...x, is_active: next } : x));
    startTransition(async () => {
      try {
        await toggleProgramStatus(p.id, next);
      } catch {
        // Revert on failure
        setPrograms(prev => prev.map(x => x.id === p.id ? { ...x, is_active: p.is_active } : x));
      }
    });
  }

  const modalOpen = !!editing || creating;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black font-display uppercase">Programs</h1>
          <p className="text-brand-gray-400 text-sm mt-1">{programs.length} programs configured</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Add Program
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-gray-100 text-brand-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold">Program</th>
              <th className="text-left px-5 py-3.5 font-semibold">Age Group</th>
              <th className="text-left px-5 py-3.5 font-semibold">Schedule</th>
              <th className="text-left px-5 py-3.5 font-semibold">Price/mo</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-200">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-brand-gray-100/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-brand-black">{p.name}</p>
                  {p.description && (
                    <p className="text-xs text-brand-gray-400 mt-0.5 max-w-xs truncate">{p.description}</p>
                  )}
                </td>
                <td className="px-5 py-4 text-brand-gray-600">{p.age_group ?? "—"}</td>
                <td className="px-5 py-4 text-brand-gray-600 text-xs">{p.schedule_summary ?? "—"}</td>
                <td className="px-5 py-4 font-bold text-brand-black">${p.price ?? "—"}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleToggle(p)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      p.is_active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-brand-gray-200 text-brand-gray-600 hover:bg-brand-gray-300"
                    }`}
                  >
                    {p.is_active ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                    {p.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-xs text-brand-orange hover:underline font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-black font-display uppercase">
                {editing ? "Edit Program" : "Add Program"}
              </h2>
              <button onClick={closeModal} className="text-brand-gray-400 hover:text-brand-black transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">
                  Program Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Elite Pathway"
                  className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">
                    Age Group
                  </label>
                  <input
                    type="text"
                    value={form.age_group}
                    onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
                    placeholder="e.g. U9 – U12"
                    className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">
                    Monthly Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">
                  Schedule
                </label>
                <input
                  type="text"
                  value={form.schedule_summary}
                  onChange={e => setForm(f => ({ ...f, schedule_summary: e.target.value }))}
                  placeholder="e.g. Mon, Wed & Fri · 5:30–7:00 PM · Field House"
                  className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown on the website…"
                  className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-brand-gray-200 peer-focus:ring-2 peer-focus:ring-brand-orange/30 rounded-full peer peer-checked:bg-brand-orange transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                </label>
                <span className="text-sm text-brand-gray-600">
                  {form.is_active ? "Active — visible on site" : "Inactive — hidden from site"}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 border border-brand-gray-200 text-brand-gray-600 hover:bg-brand-gray-100 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                {editing ? "Save Changes" : "Create Program"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
