import type { Metadata } from "next";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Heart, Target, Trophy, Users, Star, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Shakhtar Academy Calgary — our mission, our coaching philosophy, and the values that guide how we develop young soccer players in Calgary, AB.",
};

const VALUES = [
  { icon: Target,      title: "Development Over Results",  desc: "At every age, we prioritize the long-term growth of the player over the score of any single game." },
  { icon: ShieldCheck, title: "Discipline & Respect",       desc: "We hold players to a standard of effort, sportsmanship, and respect for teammates, opponents, and coaches." },
  { icon: Heart,       title: "Love of the Game",           desc: "Soccer should be challenging — and it should be fun. We protect the joy that brought every player to the pitch." },
  { icon: Users,       title: "A Real Club Community",      desc: "Families stay with us for years. We build relationships that last well beyond a single season." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-brand-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold text-brand-orange bg-brand-gray-800 px-3 py-1 rounded-full mb-4">
            About the Academy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Developing players, building character
          </h1>
          <p className="mt-4 text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            Shakhtar Academy Calgary was founded on a simple idea: every young player deserves
            quality coaching, a structured path to improve, and a club that feels like a second home.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full mb-4">
            <Star size={12} /> Our Mission
          </span>
          <h2 className="text-3xl font-bold text-brand-black tracking-tight mb-4">
            Helping every player reach their potential — on the pitch and off it
          </h2>
          <p className="text-brand-gray-600 leading-relaxed">
            We exist to give Calgary&apos;s youth soccer community a place to grow. Our coaches design
            age-appropriate programs that build technical ability, tactical awareness, and game intelligence,
            while reinforcing the values — discipline, teamwork, resilience — that serve players well beyond the game.
            Whether your child is just discovering soccer or chasing a competitive pathway, our job is to meet
            them where they are and help them take the next step.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-brand-gray-100 border-y border-brand-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-brand-black tracking-tight">What we stand for</h2>
            <p className="mt-3 text-brand-gray-600">The principles that shape every training session and every team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-brand-gray-200">
                <div className="w-11 h-11 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-orange" />
                </div>
                <h3 className="font-semibold text-brand-black mb-1.5">{title}</h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full mb-4">
              <Trophy size={12} /> Our Story
            </span>
            <h2 className="text-3xl font-bold text-brand-black tracking-tight mb-4">
              Built by coaches who know Calgary soccer
            </h2>
            <p className="text-brand-gray-600 leading-relaxed mb-4">
              Shakhtar Academy Calgary was started by a group of licensed coaches who saw a need for
              a club that treated player development as seriously as winning. We started with a single
              age group and a handful of families — and have grown into a multi-program academy serving
              players from age 6 through pre-academy age, all without losing sight of why we started.
            </p>
            <p className="text-brand-gray-600 leading-relaxed">
              Today, our staff includes coaches with national licensing and playing experience at the
              competitive and collegiate level. What hasn&apos;t changed is our commitment to giving every
              player — regardless of where they start — a clear path to get better.
            </p>
          </div>
          <div className="bg-brand-black rounded-2xl p-8">
            <h3 className="text-white font-semibold mb-5">By the numbers</h3>
            <div className="space-y-4">
              {[
                { label: "Years coaching Calgary youth", value: "10+" },
                { label: "Players developed", value: "500+" },
                { label: "Licensed coaches & staff", value: "20+" },
                { label: "Active programs across age groups", value: "4" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-brand-gray-800 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-brand-gray-400">{row.label}</span>
                  <span className="text-xl font-bold text-brand-orange">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Want to see our programs?</h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Find the right age group and training schedule for your player.
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
