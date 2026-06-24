"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const PROGRAMS = [
  "Mini Strikers (U6–U8)",
  "Development Squad (U9–U12)",
  "Elite Pathway (U13–U16)",
  "Pre-Academy (U17+)",
  "Not sure yet",
];

const EMPTY_FORM = { name: "", email: "", phone: "", program_interest: "", message: "" };


export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Build message — include program interest if selected
    const fullMessage = form.program_interest
      ? `Program of interest: ${form.program_interest}\n\n${form.message}`
      : form.message;

    try {
      const res = await fetch(`/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:             form.name.trim(),
          email:            form.email.trim() || undefined,
          phone:            form.phone.trim() || undefined,
          program_interest: form.program_interest || undefined,
          message:          fullMessage.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `Error ${res.status}`);
      }

      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-brand-gray-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={44} className="text-brand-orange" />
        </div>
        <h2 className="text-xl font-bold text-brand-black mb-2">Message sent!</h2>
        <p className="text-sm text-brand-gray-600">
          Thanks for reaching out, {form.name.split(" ")[0] || "friend"}. A member of our staff will
          get back to you within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-gray-200 p-6 sm:p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Your name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Smith"
            className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">
            Phone <span className="text-brand-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(403) 555-0123"
            className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Program of interest</label>
          <select
            value={form.program_interest}
            onChange={(e) => update("program_interest", e.target.value)}
            className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
          >
            <option value="">Select a program…</option>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-black mb-1.5">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us a bit about your player and what you're looking for…"
          className="w-full bg-white border border-brand-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Send Message
      </button>
    </form>
  );
}
