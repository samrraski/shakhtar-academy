"use client";

import { useState, useTransition } from "react";
import { Plus, Calendar, MapPin, X, Loader2, Trash2 } from "lucide-react";
import { upsertEvent, deleteEvent, type EventPayload } from "./actions";

interface Program { id: string; name: string; }

interface Event {
  id: string; title: string; type: string;
  location: string | null; start_time: string; end_time: string | null;
  programs: { name: string } | null;
}

const TYPE_STYLES: Record<string, string> = {
  training:   "bg-blue-100 text-blue-700",
  game:       "bg-green-100 text-green-700",
  tournament: "bg-brand-orange/15 text-brand-orange",
};

const EMPTY_FORM: Omit<EventPayload, "id"> = {
  title: "", type: "training", program_id: "", location: "", start_time: "", end_time: "",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });

export default function EventsClient({
  initialEvents,
  programs,
}: {
  initialEvents: Event[];
  programs: Program[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [editing, setEditing] = useState<Event | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<EventPayload, "id">>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setCreating(true);
    setForm({ ...EMPTY_FORM, program_id: programs[0]?.id ?? "" });
    setError("");
  }

  function openEdit(e: Event) {
    setEditing(e);
    setForm({
      title: e.title,
      type: e.type as EventPayload["type"],
      program_id: "", // programs FK not returned by current query; user can reselect
      location: e.location ?? "",
      start_time: e.start_time ? e.start_time.slice(0, 16) : "",
      end_time: e.end_time ? e.end_time.slice(0, 16) : "",
    });
    setError("");
  }

  function closeModal() { setEditing(null); setCreating(false); setError(""); }

  function handleSave() {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.start_time) { setError("Start time is required."); return; }
    if (!creating && !form.program_id && !editing) { setError("Program is required."); return; }

    startTransition(async () => {
      try {
        await upsertEvent({ ...form, id: editing?.id });
        // Optimistic update
        if (editing) {
          setEvents(prev => prev.map(e =>
            e.id === editing.id ? { ...e, title: form.title, type: form.type, location: form.location || null, start_time: new Date(form.start_time).toISOString(), end_time: form.end_time ? new Date(form.end_time).toISOString() : null } : e
          ));
        } else {
          // Re-fetch by revalidation handled by server; optimistically add placeholder
          setEvents(prev => [...prev, {
            id: `tmp-${Date.now()}`, title: form.title, type: form.type,
            location: form.location || null,
            start_time: new Date(form.start_time).toISOString(),
            end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
            programs: programs.find(p => p.id === form.program_id) ? { name: programs.find(p => p.id === form.program_id)!.name } : null,
          }]);
        }
        closeModal();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to save.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    startTransition(async () => {
      try {
        await deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
      } catch (e) {
        alert(e instanceof Error ? e.message : "Delete failed.");
      }
    });
  }

  const modalOpen = !!editing || creating;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-black font-display uppercase">Events</h1>
            <p className="text-brand-gray-400 text-sm mt-1">{events.length} scheduled events</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} /> Add Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-gray-200 py-20 text-center">
            <Calendar size={32} className="text-brand-gray-200 mx-auto mb-3" />
            <p className="text-brand-gray-400 text-sm">No events yet — add your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray-100 text-brand-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold">Event</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Program</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Start</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Location</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-200">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-brand-gray-100/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-brand-black">{e.title}</td>
                    <td className="px-5 py-4 text-brand-gray-600">{e.programs?.name ?? "—"}</td>
                    <td className="px-5 py-4 text-brand-gray-600 text-xs">{fmt(e.start_time)}</td>
                    <td className="px-5 py-4 text-brand-gray-600">
                      {e.location ? (
                        <span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${TYPE_STYLES[e.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-3">
                      <button onClick={() => openEdit(e)} className="text-xs text-brand-orange hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(e.id)} className="text-xs text-red-400 hover:underline font-medium">
                        <Trash2 size={13} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-black font-display uppercase">
                {editing ? "Edit Event" : "Add Event"}
              </h2>
              <button onClick={closeModal} className="text-brand-gray-400 hover:text-brand-black transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">Title *</label>
                <input type="text" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Elite Pathway Training"
                  className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventPayload["type"] }))}
                    className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange">
                    <option value="training">Training</option>
                    <option value="game">Game</option>
                    <option value="tournament">Tournament</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">Program *</label>
                  <select value={form.program_id} onChange={e => setForm(f => ({ ...f, program_id: e.target.value }))}
                    className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange">
                    <option value="">Select…</option>
                    {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">Start *</label>
                  <input type="datetime-local" value={form.start_time}
                    onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                    className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">End</label>
                  <input type="datetime-local" value={form.end_time}
                    onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                    className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-gray-600 uppercase tracking-wide mb-1.5">Location</label>
                <input type="text" value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Field House"
                  className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={closeModal}
                className="flex-1 border border-brand-gray-200 text-brand-gray-600 hover:bg-brand-gray-100 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isPending}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending && <Loader2 size={14} className="animate-spin" />}
                {editing ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
