import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Coaches & Staff",
  description:
    "Meet the licensed coaching staff at Shakhtar Academy Calgary — experienced coaches dedicated to developing youth soccer players in Calgary, AB.",
};

const STAFF = [
  {
    name: "Coach Director",
    role: "Director of Coaching",
    bio: "Oversees the academy's curriculum across all age groups and leads our Elite Pathway and Pre-Academy programs. National coaching license, with playing and coaching experience at the competitive level.",
    badges: ["National Licensed", "10+ yrs coaching"],
  },
  {
    name: "Coach Mini Strikers",
    role: "Mini Strikers Lead",
    bio: "Specializes in early-childhood player development. Brings a games-based approach that keeps the youngest players engaged, active, and excited to come back every week.",
    badges: ["Youth Development Cert.", "6 yrs coaching"],
  },
  {
    name: "Coach Development",
    role: "Development Squad Lead",
    bio: "Focuses on building technical fundamentals and introducing tactical concepts. Played competitively through the U18 level and has coached the Development Squad since the academy's founding.",
    badges: ["Provincial Licensed", "8 yrs coaching"],
  },
  {
    name: "Coach Elite",
    role: "Elite Pathway Assistant Coach",
    bio: "Former collegiate player who brings high-level training methods to our competitive program — with an emphasis on conditioning, tactical discipline, and game management.",
    badges: ["Collegiate Player", "5 yrs coaching"],
  },
];

export default function CoachesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative bg-brand-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-orange/10" />
          <Image
            src="/brand/halftone-wave-wide.png"
            alt=""
            width={2782}
            height={1440}
            className="pointer-events-none select-none absolute -right-24 -top-16 w-[520px] max-w-none opacity-40 mix-blend-screen sm:opacity-60"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="font-display text-xs sm:text-sm uppercase tracking-[0.25em] text-brand-orange font-medium">
            Our Staff
          </p>
          <h1 className="mt-3 font-display uppercase text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            Coaches who care about every player
          </h1>
          <p className="mt-5 text-base sm:text-lg text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            {`Every Shakhtar Academy coach is licensed, background-checked, and trained in our development philosophy — so families can trust who's leading their player's growth.`}
          </p>
        </div>
      </section>

      {/* Staff grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STAFF.map((person) => (
              <div key={person.name} className="bg-white rounded-2xl border border-brand-gray-200 p-6 sm:p-7 flex gap-5">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-xl font-bold text-brand-orange">
                    {person.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display uppercase text-base font-semibold text-brand-black tracking-wide">{person.name}</h3>
                  <p className="text-sm text-brand-orange font-medium mb-2">{person.role}</p>
                  <p className="text-sm text-brand-gray-600 leading-relaxed mb-3">{person.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {person.badges.map((b) => (
                      <span key={b} className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-gray-600 bg-brand-gray-100 px-2.5 py-1 rounded-full">
                        <Award size={11} className="text-brand-orange" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-16 sm:py-24 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={22} className="text-brand-orange" />
          </div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Our Standards</p>
          <h2 className="mt-2 font-display uppercase text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">
            Held to a higher standard
          </h2>
          <p className="mt-4 text-brand-gray-600 leading-relaxed">
            {`Every coach on staff holds a recognized coaching license appropriate to their program, completes a criminal record and vulnerable sector check before working with players, and goes through ongoing training in our academy's curriculum and player-safety policies. We hold our staff to the same standard of respect and accountability we expect from our players.`}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 bg-brand-black overflow-hidden">
        <Image
          src="/brand/halftone-wave-compact.png"
          alt=""
          width={3288}
          height={1314}
          className="pointer-events-none select-none absolute -right-24 -bottom-28 w-[460px] max-w-none opacity-25 mix-blend-screen"
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Next Step</p>
          <h2 className="mt-2 font-display uppercase text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Want to train with our staff?
          </h2>
          <p className="mt-3 text-brand-gray-200 max-w-xl mx-auto leading-relaxed">
            {`Find the program that matches your player's age and goals.`}
          </p>
          <Link href="/programs"
            className="mt-7 inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-7 py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors shadow-[0_0_0_1px_rgba(243,108,33,0.4),0_8px_30px_-6px_rgba(243,108,33,0.7)]">
            View Programs <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
