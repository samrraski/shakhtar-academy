"use client";

import { useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, User, X, Cake, FileText } from "lucide-react";

interface Player {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  notes: string | null;
  created_at: string;
}

const EMPTY_FORM = { full_name: "", date_of_birth: "", notes: "" };

export default function PlayersView({ initialPlayers }: { initialPlayers: Player[] }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Player | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setError("");
    setModal("add");
  }

  function openEdit(player: Player) {
    setForm({
      full_name: player.full_name,
      date_of_birth: player.date_of_birth ?? "",
      notes: player.notes ?? "",
    });
    setEditing(player);
    setError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createSupabaseClient();

    const payload = {
      full_name: form.full_name.trim(),
      date_of_birth: form.date_of_birth || null,
      notes: form.notes || null,
    };

    if (modal === "add") {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error: err } = await supabase
        .from("players")
        .insert({ ...payload, parent_id: user!.id })
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setPlayers((prev) =>
        [...prev, data as Player].sort((a, b) => a.full_name.localeCompare(b.full_name))
      );
    } else if (editing) {
      const { data, error: err } = await supabase
        .from("players")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setPlayers((prev) => prev.map((p) => (p.id === editing.id ? (data as Player) : p)));
    }

    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this player? Their registrations will be removed too. This cannot be undone.")) return;
    const supabase = createSupabaseClient();
    const { error: err } = await supabase.from("players").delete().eq("id", id);
    if (err) { alert(err.message); return; }
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">My Players</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">
            {players.length} player{players.length !== 1 ? "s" : ""} on your account
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Add Player
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        {players.length === 0 ? (
          <div className="py-16 text-center">
            <User size={32} className="mx-auto text-brand-gray-300 mb-3" />
            <p className="text-brand-gray-400 text-sm">No players yet. Add your first one to get started!</p>
          </div>
        ) : (
          <ul className="divide-y divide-brand-gray-200">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-brand-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-brand-orange">
                      {p.full_name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-black truncate">{p.full_name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      {p.date_of_birth && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray-400">
                          <Cake size={10} /> {p.date_of_birth}
                        </span>
                      )}
                      {p.notes && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray-400 truncate max-w-xs">
                          <FileText size={10} /> {p.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 text-brand-gray-400 hover:text-brand-black hover:bg-brand-gray-200 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-brand-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-brand-black">
                {modal === "add" ? "Add Player" : "Edit Player"}
              </h2>
              <button onClick={closeModal} className="p-1.5 text-brand-gray-400 hover:text-brand-black rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">Full name</label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Player's full name"
                  className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">Date of birth</label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
                  className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Notes <span className="text-brand-gray-400 font-normal">(allergies, medical info, etc.)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Anything coaches should know…"
                  className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving…" : modal === "add" ? "Add Player" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-brand-gray-600 hover:text-brand-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
