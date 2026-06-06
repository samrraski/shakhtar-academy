"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Phone, Menu, X } from "lucide-react";
import { ACADEMY } from "@/lib/config";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/coaches", label: "Coaches" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-brand-black border-b border-brand-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-brand-orange rounded-md flex items-center justify-center">
              <Shield size={14} className="text-brand-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              Shakhtar <span className="text-brand-orange">Academy</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-white bg-brand-gray-800"
                      : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-800"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <a href={`tel:${ACADEMY.phone}`} className="hidden lg:flex items-center gap-1.5 text-brand-gray-400 hover:text-white text-sm transition-colors">
              <Phone size={13} />{ACADEMY.phone}
            </a>
            <Link href="/sign-in"
              className="hidden sm:block text-brand-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up"
              className="hidden sm:block bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm px-4 py-1.5 rounded-lg transition-colors">
              Register
            </Link>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-brand-gray-400 hover:text-white transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-gray-800 bg-brand-black px-4 pb-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/sign-in" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <div className="pt-2">
            <Link href="/sign-up" onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-brand-orange text-white font-bold text-sm px-4 py-2.5 rounded-lg">
              Register Today
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
