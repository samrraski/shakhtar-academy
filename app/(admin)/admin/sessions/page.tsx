"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, MapPin } from "lucide-react";

interface Session {
  id: string; session_date: string; time_start: string; time_end: string;
  address: string; is_cancelled: boolean;
  programs: { name: string } | null;
  workers: { first_name: string; last_name: string } | null;
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions").then(r => r.json()).then(data => {
      setSessions(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sessions.length} total</p>
        </div>
        <button onClick={() => router.push("/admin/sessions/new")}
          className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={15} /> Add session
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Date","Time","Program","Trainer","Location","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Loading…</td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No sessions yet.</td></tr>
            ) : sessions.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {new Date(s.session_date + "T00:00:00").toLocaleDateString("en-CA", { weekday:"short", month:"short", day:"numeric" })}
                </td>
                <td className="px-4 py-3 text-gray-600">{s.time_start.slice(0,5)} – {s.time_end.slice(0,5)}</td>
                <td className="px-4 py-3 text-gray-600">{(s.programs as any)?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {s.workers ? `${(s.workers as any).first_name} ${(s.workers as any).last_name}` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="flex items-center gap-1"><MapPin size={12} />{s.address.slice(0,30)}{s.address.length > 30 ? "…" : ""}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.is_cancelled ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                    {s.is_cancelled ? "Cancelled" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => router.push(`/admin/sessions/${s.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200">
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
