"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { setUserRole } from "./actions";

interface Profile {
  id: string; full_name: string | null; phone: string | null;
  role: string; created_at: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });

export default function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleRoleChange(id: string, role: "admin" | "parent") {
    setLoadingId(id);
    startTransition(async () => {
      try {
        await setUserRole(id, role);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      } catch (e) {
        alert(e instanceof Error ? e.message : "Action failed.");
      } finally {
        setLoadingId(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black font-display uppercase">Users</h1>
        <p className="text-brand-gray-400 text-sm mt-1">{users.length} registered parents</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-gray-200 py-20 text-center">
          <Users size={32} className="text-brand-gray-200 mx-auto mb-3" />
          <p className="text-brand-gray-400 text-sm">No users yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray-100 text-brand-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold">Phone</th>
                <th className="text-left px-5 py-3.5 font-semibold">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold">Joined</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-200">
              {users.map((u) => {
                const isLoading = loadingId === u.id && pending;
                return (
                  <tr key={u.id} className="hover:bg-brand-gray-100/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-brand-orange">
                            {(u.full_name ?? "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-brand-black">{u.full_name ?? "Unnamed"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-brand-gray-600">{u.phone ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        u.role === "admin" ? "bg-brand-orange/15 text-brand-orange" : "bg-blue-100 text-blue-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-brand-gray-600">{fmt(u.created_at)}</td>
                    <td className="px-5 py-4 text-right space-x-3">
                      {u.role !== "admin" && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleRoleChange(u.id, "admin")}
                          className="text-xs text-brand-orange hover:underline font-medium disabled:opacity-40"
                        >
                          {isLoading ? "…" : "Make Admin"}
                        </button>
                      )}
                      {u.role === "admin" && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleRoleChange(u.id, "parent")}
                          className="text-xs text-brand-gray-400 hover:underline font-medium disabled:opacity-40"
                        >
                          {isLoading ? "…" : "Remove Admin"}
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
