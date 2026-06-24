"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role;
    if (role !== "admin" && role !== "worker") {
      await supabase.auth.signOut();
      setError("Access denied. This login is for staff only.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="bg-brand-gray-900 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} className="text-brand-orange" />
        <h1 className="text-white text-2xl font-bold">Staff Login</h1>
      </div>
      <p className="text-brand-gray-400 text-sm mb-6">Shakhtar Academy — staff & admin access</p>

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

        <div>
          <label className="block text-sm font-medium text-brand-gray-200 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-gray-800 border border-brand-gray-600 rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-brand-gray-600 text-sm focus:outline-none focus:border-brand-orange transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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
          Sign In to Dashboard
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray-400">
        Parent?{" "}
        <Link href="/sign-in" className="text-brand-orange hover:text-brand-orange-hover font-medium transition-colors">
          Go to Parent Portal →
        </Link>
      </p>
    </div>
  );
}
