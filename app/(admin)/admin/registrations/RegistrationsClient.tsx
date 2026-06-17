"use client";

import { useState, useTransition } from "react";
import { updateRegistrationStatus } from "./actions";

interface Reg {
  id: string;
  status: string;
  created_at: string;
  players: { full_name: string } | null;
  programs: { name: string; age_group: string | null } | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  active:    "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });

export default function RegistrationsClient({ initialRegs }: { initialRegs: Reg[] }) {
  const [regs, setRegs] = useState(initialRegs);
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function updateLocal(id: string, status: string) {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  function handleAction(id: string, status: "active" | "cancelled") {
    setLoadingId(id);
    startTransition(async () => {
      try {
        await updateRegistrationStatus(id, status);
        updateLocal(id, status);
      } catch (e) {
        alert(e instanceof Error ? e.message : "Action failed.");
      } finally {
        setLoadingId(null);
      }
    });
  }

  const counts = {
    pending:   regs.filter(r => r.status === "pending").length,
    active:    regs.filter(r => r.status === "active").length,
    cancelled: regs.filter(r => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-black font-display uppercase">Registrations</h1>
          <p className="text-brand-gray-400 text-sm mt-1">{regs.length} total · {counts.pending} pending</p>
        </div>
        <div className="flex gap-2">
          {[
            { label: `${counts.pending} Pending`,   cls: "bg-yellow-100 text-yellow-700" },
            { label: `${counts.active} Active`,     cls: "bg-green-100 text-green-700"   },
            { label: `${counts.cancelled} Cancelled`, cls: "bg-red-100 text-red-600"    },
          ].map(({ label, cls }) => (
            <span key={label} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${cls}`}>{label}</span>
          ))}
        </div>
      </div>

      {regs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-gray-200 py-20 text-center">
          <p className="text-brand-gray-400 text-sm">No registrations yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray-100 text-brand-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold">Player</th>
                <th className="text-left px-5 py-3.5 font-semibold">Program</th>
                <th className="text-left px-5 py-3.5 font-semibold">Date</th>
                <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-200">
              {regs.map((r) => {
                const isLoading = loadingId === r.id && pending;
                return (
                  <tr key={r.id} className="hover:bg-brand-gray-100/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-brand-black">{r.players?.full_name ?? "—"}</td>
                    <td className="px-5 py-4">
                      <p className="text-brand-black">{r.programs?.name ?? "—"}</p>
                      {r.programs?.age_group && <p className="text-xs text-brand-gray-400">{r.programs.age_group}</p>}
                    </td>
                    <td className="px-5 py-4 text-brand-gray-600">{fmt(r.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-3">
                      {r.status === "pending" && (
                        <>
                          <button
                            disabled={isLoading}
                            onClick={() => handleAction(r.id, "active")}
                            className="text-xs text-green-600 hover:underline font-medium disabled:opacity-40"
                          >
                            {isLoading ? "…" : "Approve"}
                          </button>
                          <button
                            disabled={isLoading}
                            onClick={() => handleAction(r.id, "cancelled")}
                            className="text-xs text-red-500 hover:underline font-medium disabled:opacity-40"
                          >
                            {isLoading ? "…" : "Decline"}
                          </button>
                        </>
                      )}
                      {r.status === "active" && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleAction(r.id, "cancelled")}
                          className="text-xs text-red-500 hover:underline font-medium disabled:opacity-40"
                        >
                          {isLoading ? "…" : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
