"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Users,
  Calendar, MessageSquare, BookOpen, LogOut, ChevronRight, DollarSign,
} from "lucide-react";

const NAV = [
  { href: "/admin",               label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/players",       label: "Players",     icon: Users           },
  { href: "/admin/programs",      label: "Programs",    icon: BookOpen        },
  { href: "/admin/sessions",      label: "Sessions",    icon: Calendar        },
  { href: "/admin/workers",       label: "Workers",     icon: Users           },
  { href: "/admin/posts",         label: "Posts",       icon: MessageSquare   },
  { href: "/admin/inquiries",     label: "Inquiries",   icon: MessageSquare   },
  { href: "/admin/financial",     label: "Financial",   icon: DollarSign      },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-brand-black flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <Image src="/brand/shakhtar-crest.png" alt="" width={207} height={321} className="h-10 w-auto" />
        <div className="leading-none">
          <p className="text-white font-black text-sm uppercase tracking-tight">Shakhtar</p>
          <p className="text-brand-orange font-bold text-xs uppercase">Admin</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                active
                  ? "bg-brand-orange text-white"
                  : "text-brand-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} />
          Back to Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
