"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Search, Cake } from "lucide-react";

interface Player {
  id: string; first_name: string; last_name: string;
  date_of_birth: string; program_name: string | null;
  is_active: boolean; profile_photo_url: string | null;
}

function isBirthdaySoon(dob: string) {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const bd = new Date(dob + 'T00:00:00');
    if (bd.getMonth() === d.getMonth() && bd.getDate() === d.getDate()) return true;
  }
  return false;
}

export default function PlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("");
  const [activeFilter, setActiveFilter] = useState<"true" | "false" | "">( "true");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/programs").then(r => r.json()).then(setPrograms);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (programId) params.set("program_id", programId);
    if (activeFilter !== "") params.set("is_active", activeFilter);
    fetch(`/api/players?${params}`).then(r => r.json()).then(data => {
      setPlayers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [search, programId, activeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players</h1>
          <p className="text-sm text-gray-500 mt-0.5">{players.length} result{players.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => router.push("/admin/players/new")}
          className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={15} /> Add player
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:border-brand-orange"
            placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-brand-orange"
          value={programId} onChange={e => setProgramId(e.target.value)}>
          <option value="">All programs</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
          {([["true","Active"],["","All"],["false","Inactive"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setActiveFilter(val)}
              className={`px-3 py-2 transition-colors ${activeFilter === val ? "bg-brand-orange text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Player","Program","Date of birth","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Loading…</td></tr>
            ) : players.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No players found.</td></tr>
            ) : players.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xs shrink-0">
                      {p.first_name[0]}{p.last_name[0]}
                    </div>
                    <span className="font-medium text-gray-900">
                      {p.first_name} {p.last_name}
                      {isBirthdaySoon(p.date_of_birth) && <Cake size={13} className="inline ml-1.5 text-pink-500" />}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.program_name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(p.date_of_birth + "T00:00:00").toLocaleDateString("en-CA", { year:"numeric", month:"short", day:"numeric" })}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => router.push(`/admin/players/${p.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
