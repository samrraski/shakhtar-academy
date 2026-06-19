"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, LogIn } from "lucide-react";
import { ACADEMY } from "@/lib/config";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:5174";

const NAV_LINKS = [
  { href: "/about",    label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/coaches",  label: "Coaches" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact",  label: "Contact" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);

  return (
    <header className="bg-brand-black border-b border-brand-gray-800 sticky top-0 z-50">
      {/* Promo bar */}
      {!promoDismissed && (
        <div className="bg-brand-orange text-white text-center py-2 px-4 text-sm font-bold relative">
          <span className="font-display uppercase tracking-wide">
            🎒 Back to School, Back to Football — <span className="underline underline-offset-2">Fall 2026 registration</span> is open!
          </span>
          <Link href="/contact" className="ml-3 inline-block bg-white text-brand-orange font-black text-xs uppercase tracking-widest px-3 py-1 rounded-full hover:bg-brand-orange-light transition-colors">
            Get In Touch
          </Link>
          <button onClick={() => setPromoDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors text-lg leading-none">
            ×
          </button>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-28">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/brand/shakhtar-crest.png" alt="" width={207} height={321} className="h-24 w-auto" />
            <div className="flex flex-col leading-none">
              <span className="text-white font-black text-lg tracking-tight uppercase">Shakhtar</span>
              <span className="text-white font-bold text-base tracking-tight uppercase">Academy</span>
              <span className="text-brand-orange font-semibold text-sm italic">Calgary</span>
            </div>
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
            <a
              href={`${PORTAL_URL}/login`}
              className="hidden sm:flex items-center gap-1.5 text-brand-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors"
            >
              <LogIn size={14} />
              Parent Portal
            </a>
            <Link
              href="/contact"
              className="hidden sm:block bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm px-4 py-1.5 rounded-lg transition-colors"
            >
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
          <a
            href={`${PORTAL_URL}/login`}
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-brand-gray-400 hover:text-white transition-colors"
          >
            Parent Portal
          </a>
          <div className="pt-2">
            <Link href="/contact" onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-brand-orange text-white font-bold text-sm px-4 py-2.5 rounded-lg">
              Register Today
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
