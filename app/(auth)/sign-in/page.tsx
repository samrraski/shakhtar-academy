"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="bg-brand-gray-900 rounded-2xl p-8 shadow-2xl">
      <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-brand-gray-400 text-sm mb-6">Sign in to your Shakhtar Academy parent portal</p>

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
          <div className="mt-1.5 text-right">
            <Link href="/forgot-password" className="text-xs text-brand-orange hover:text-brand-orange-hover transition-colors">
              Forgot password?
            </Link>
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
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray-400">
        New to the academy?{" "}
        <Link href="/sign-up" className="text-brand-orange hover:text-brand-orange-hover font-medium transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}
