"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Plus, ClipboardList, X, Ban, DollarSign, Clock } from "lucide-react";

export interface Registration {
  id: string;
  status: string;
  created_at: string;
  player_id: string;
  players: { full_name: string } | null;
  programs: { id: string; name: string; age_group: string | null } | null;
}

interface PlayerOption {
  id: string;
  full_name: string;
}

interface ProgramOption {
  id: string;
  name: string;
  age_group: string | null;
  price: number | null;
  schedule_summary: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  active:    "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Pending Review",
  active:    "Active",
  cancelled: "Cancelled",
};

const fmtPrice = (n: number | null) =>
  n == null ? null : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

export default function RegistrationsView({
  initialRegistrations,
  players,
  programs,
}: {
  initialRegistrations: Registration[];
  players: PlayerOption[];
  programs: ProgramOption[];
}) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [modal, setModal] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [programId, setProgramId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openModal() {
    setPlayerId(players[0]?.id ?? "");
    setProgramId(programs[0]?.id ?? "");
    setError("");
    setModal(true);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!playerId || !programId) return;
    setSaving(true);
    setError("");
    const supabase = createSupabaseClient();

    const { data, error: err } = await supabase
      .from("registrations")
      .insert({ player_id: playerId, program_id: programId, status: "pending" })
      .select("id, status, created_at, player_id, players(full_name), programs(id, name, age_group)")
      .single();

    if (err) { setError(err.message); setSaving(false); return; }
    setRegistrations((prev) => [data as unknown as Registration, ...prev]);
    setSaving(false);
    setModal(false);
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this registration?")) return;
    const supabase = createSupabaseClient();
    const { error: err } = await supabase
      .from("registrations")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (err) { alert(err.message); return; }
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));
  }

  const canRegister = players.length > 0 && programs.length > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Registrations</h1>
          <p className="text-brand-gray-400 text-sm mt-0.5">
            {registrations.length} registration{registrations.length !== 1 ? "s" : ""} on your account
          </p>
        </div>
        <button
          onClick={openModal}
          disabled={!canRegister}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={!canRegister ? "Add a player first to register them for a program" : undefined}
        >
          <Plus size={15} /> New Registration
        </button>
      </div>

      {players.length === 0 && (
        <div className="bg-brand-orange-light border border-brand-orange/30 rounded-2xl px-5 py-4 text-sm text-brand-black">
          You haven&apos;t added any players yet.{" "}
          <Link href="/dashboard/players" className="text-brand-orange font-semibold hover:underline">
            Add a player
          </Link>{" "}
          before registering for a program.
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
        {registrations.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={32} className="mx-auto text-brand-gray-300 mb-3" />
            <p className="text-brand-gray-400 text-sm">No registrations yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-brand-gray-200">
            {registrations.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-4 hover:bg-brand-gray-100 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-black truncate">
                    {r.programs?.name ?? "Program"} {r.programs?.age_group && (
                      <span className="text-brand-gray-400 font-normal">· {r.programs.age_group}</span>
                    )}
                  </p>
                  <p className="text-xs text-brand-gray-400 mt-0.5">
                    Player: {r.players?.full_name ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                  {r.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="p-2 text-brand-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel registration"
                    >
                      <Ban size={15} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-brand-black">New Registration</h2>
              <button onClick={() => setModal(false)} className="p-1.5 text-brand-gray-400 hover:text-brand-black rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">Player</label>
                <select
                  required
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">Program</label>
                <select
                  required
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.age_group ? ` (${p.age_group})` : ""}</option>
                  ))}
                </select>
              </div>

              {/* Selected program details */}
              {(() => {
                const selected = programs.find((p) => p.id === programId);
                if (!selected) return null;
                return (
                  <div className="bg-brand-gray-100 rounded-xl p-4 space-y-1.5">
                    {selected.price != null && (
                      <p className="flex items-center gap-2 text-sm text-brand-gray-600">
                        <DollarSign size={13} className="text-brand-orange" /> {fmtPrice(selected.price)} / month
                      </p>
                    )}
                    {selected.schedule_summary && (
                      <p className="flex items-center gap-2 text-sm text-brand-gray-600">
                        <Clock size={13} className="text-brand-orange" /> {selected.schedule_summary}
                      </p>
                    )}
                  </div>
                );
              })()}

              <p className="text-xs text-brand-gray-400">
                Submitting a registration sends it to our staff for review. You&apos;ll see its status
                change to &quot;Active&quot; once it&apos;s confirmed.
              </p>

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
                  {saving ? "Submitting…" : "Submit Registration"}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(false)}
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
