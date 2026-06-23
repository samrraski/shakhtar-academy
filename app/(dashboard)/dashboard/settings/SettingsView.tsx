"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

export default function SettingsView({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({
      data: { full_name: form.full_name || null, phone: form.phone || null },
    });

    if (err) { setError(err.message); setSaving(false); return; }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Settings</h1>
        <p className="text-brand-gray-400 text-sm mt-0.5">Manage your parent account details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
        <h2 className="font-semibold text-brand-black mb-4">Your Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-gray-600 mb-1">Email</label>
            <input
              value={email}
              disabled
              className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm text-brand-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">Full Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="Jane Smith"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray-600 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(403) 000-0000"
                className="w-full bg-brand-gray-100 border border-brand-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          <p className="text-xs text-brand-gray-400">
            We use your phone number to reach you about training changes, weather cancellations, and your
            player&apos;s registration.
          </p>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle2 size={15} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
