"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="bg-brand-gray-900 rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={48} className="text-brand-orange" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">Reset link sent</h2>
        <p className="text-brand-gray-400 text-sm">
          Check your inbox at <span className="text-white font-medium">{email}</span> for a password reset link.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand-orange hover:text-brand-orange-hover transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray-900 rounded-2xl p-8 shadow-2xl">
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Back to Sign In
      </Link>

      <h1 className="text-white text-2xl font-bold mb-1">Forgot your password?</h1>
      <p className="text-brand-gray-400 text-sm mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-gray-200 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-brand-gray-800 border border-brand-gray-600 rounded-lg px-3.5 py-2.5 text-white placeholder-brand-gray-600 text-sm focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
