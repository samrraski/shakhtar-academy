import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Heart, Target, Users, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Shakhtar Academy Calgary — our mission, our coaching philosophy, and the values that guide how we develop young soccer players in Calgary, AB.",
};

const VALUES = [
  { icon: Target,      title: "Development Over Results", desc: "At every age, we prioritize the long-term growth of the player over the score of any single game." },
  { icon: ShieldCheck, title: "Discipline & Respect",      desc: "We hold players to a standard of effort, sportsmanship, and respect for teammates, opponents, and coaches." },
  { icon: Heart,       title: "Love Of The Game",          desc: "Soccer should be challenging — and it should be fun. We protect the joy that brought every player to the pitch." },
  { icon: Users,       title: "A Real Club Community",     desc: "Families stay with us for years. We build relationships that last well beyond a single season." },
];

const STORY_STATS = [
  { label: "Years coaching Calgary youth", value: "10+" },
  { label: "Players developed", value: "500+" },
  { label: "Licensed coaches & staff", value: "20+" },
  { label: "Active programs across age groups", value: "4" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative bg-brand-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-orange/10" />
          <Image
            src="/brand/halftone-wave-compact.png"
            alt=""
            width={3288}
            height={1314}
            className="pointer-events-none select-none absolute -left-28 -bottom-20 w-[520px] max-w-none opacity-30 mix-blend-screen sm:opacity-50"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="font-display text-xs sm:text-sm uppercase tracking-[0.25em] text-brand-orange font-medium">
            About The Academy
          </p>
          <h1 className="mt-3 font-display uppercase text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            Developing players, building character
          </h1>
          <p className="mt-5 text-base sm:text-lg text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            {`Shakhtar Academy Calgary was founded on a simple idea: every young player deserves quality coaching, a structured path to improve, and a club that feels like a second home.`}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Our Mission</p>
          <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-brand-black tracking-tight">
            Helping every player reach their potential — on the pitch and off it
          </h2>
          <p className="mt-4 text-brand-gray-600 leading-relaxed">
            {`We exist to give Calgary's youth soccer community a place to grow. Our coaches design age-appropriate programs that build technical ability, tactical awareness, and game intelligence, while reinforcing the values — discipline, teamwork, resilience — that serve players well beyond the game. Whether your child is just discovering soccer or chasing a competitive pathway, our job is to meet them where they are and help them take the next step.`}
          </p>
        </div>
      </section>

      {/* Values — pillar cards */}
      <section className="relative py-16 sm:py-24 bg-brand-black overflow-hidden">
        <Image
          src="/brand/halftone-wave-wide.png"
          alt=""
          width={2782}
          height={1440}
          className="pointer-events-none select-none absolute -right-32 -top-24 w-[560px] max-w-none opacity-25 mix-blend-screen"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">What We Stand For</p>
            <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-white tracking-tight">The pillars of our program</h2>
            <p className="mt-2 text-brand-gray-400">The principles that shape every training session and every team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7">
                <div className="flex items-start justify-between mb-5">
                  <span className="font-display text-3xl font-bold text-white/15 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-11 h-11 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-brand-orange" />
                  </div>
                </div>
                <h3 className="font-display uppercase text-lg font-semibold text-white mb-1.5 tracking-wide">{title}</h3>
                <p className="text-sm text-brand-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 sm:py-24 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Our Story</p>
            <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-brand-black tracking-tight mb-4">
              Built by coaches who know Calgary soccer
            </h2>
            <p className="text-brand-gray-600 leading-relaxed mb-4">
              Shakhtar Academy Calgary was started by a group of licensed coaches who saw a need for
              a club that treated player development as seriously as winning. We started with a single
              age group and a handful of families — and have grown into a multi-program academy serving
              players from age 6 through pre-academy age, all without losing sight of why we started.
            </p>
            <p className="text-brand-gray-600 leading-relaxed">
              {`Today, our staff includes coaches with national licensing and playing experience at the competitive and collegiate level. What hasn't changed is our commitment to giving every player — regardless of where they start — a clear path to get better.`}
            </p>
          </div>
          <div className="bg-brand-black rounded-2xl p-8">
            <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium mb-5">
              By The Numbers
            </p>
            <div className="space-y-4">
              {STORY_STATS.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-brand-gray-400">{row.label}</span>
                  <span className="font-display text-2xl font-bold text-brand-orange">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
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
          <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Want to see our programs?
          </h2>
          <p className="mt-3 text-brand-gray-200 max-w-xl mx-auto leading-relaxed">
            Find the right age group and training schedule for your player.
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
