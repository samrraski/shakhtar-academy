import type { Metadata } from "next";
import Link from "next/link";
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
      <section className="bg-brand-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold text-brand-orange bg-brand-gray-800 px-3 py-1 rounded-full mb-4">
            Our Staff
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Coaches who care about every player
          </h1>
          <p className="mt-4 text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            Every Shakhtar Academy coach is licensed, background-checked, and trained in our development
            philosophy — so families can trust who&apos;s leading their player&apos;s growth.
          </p>
        </div>
      </section>

      {/* Staff grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STAFF.map((person) => (
              <div key={person.name} className="bg-white rounded-2xl border border-brand-gray-200 p-6 flex gap-5">
                <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-brand-orange">
                    {person.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-brand-black">{person.name}</h3>
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
      <section className="py-16 sm:py-20 bg-brand-gray-100 border-y border-brand-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={22} className="text-brand-orange" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight mb-3">
            Our coaching standards
          </h2>
          <p className="text-brand-gray-600 leading-relaxed">
            Every coach on staff holds a recognized coaching license appropriate to their program, completes
            a criminal record and vulnerable sector check before working with players, and goes through
            ongoing training in our academy&apos;s curriculum and player-safety policies. We hold our staff
            to the same standard of respect and accountability we expect from our players.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Want to train with our staff?</h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Find the program that matches your player&apos;s age and goals.
          </p>
          <Link href="/programs"
            className="mt-7 inline-flex items-center gap-2 bg-brand-black hover:bg-brand-gray-900 text-white font-bold px-7 py-3 rounded-xl text-sm transition-colors">
            View Programs <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
