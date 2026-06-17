import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import {
  ArrowRight, Target, Users, Trophy, ShieldCheck,
  Calendar, CheckCircle2,
} from "lucide-react";

const VALUE_PROPS = [
  { icon: Target,      title: "Player Development",  desc: "Age-appropriate curriculum focused on technical skill, tactical understanding, and confidence on the ball." },
  { icon: ShieldCheck, title: "Licensed Coaching",    desc: "Every program is led by certified coaches who know how to bring out the best in young players." },
  { icon: Users,       title: "Club Community",       desc: "A supportive environment where players, parents, and coaches grow together season after season." },
];

const PROGRAMS_PREVIEW = [
  { age: "U6 – U8",   name: "Mini Strikers",       desc: "First touches, fun-first games, and a love for the ball." },
  { age: "U9 – U12",  name: "Development Squad",   desc: "Building technical foundations and team play." },
  { age: "U13 – U16", name: "Elite Pathway",       desc: "Competitive training for serious, driven players." },
  { age: "U17+",      name: "Pre-Academy",         desc: "Preparing top players for the next level." },
];


export default function HomePage() {
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
            className="pointer-events-none select-none absolute -right-24 -top-16 w-[640px] max-w-none opacity-50 mix-blend-screen sm:opacity-70"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-28 sm:pb-36">
          <p className="font-display text-xs sm:text-sm uppercase tracking-[0.25em] text-brand-orange font-medium">
            Official Shakhtar Academy — Season 2026/27
          </p>
          <h1 className="mt-3 font-display uppercase text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
            The Shakhtar way of player development, in Calgary
          </h1>
          <p className="mt-5 text-base sm:text-lg text-brand-gray-200 max-w-2xl leading-relaxed">
            {`Calgary's home for elite youth soccer development. Structured programs for ages 6–18, led by licensed coaches who care about every player's growth — on and off the pitch.`}
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link href="/programs"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-7 py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors shadow-[0_0_0_1px_rgba(255,100,0,0.4),0_8px_30px_-6px_rgba(255,100,0,0.7)] w-full sm:w-auto">
              Explore Programs <ArrowRight size={16} />
            </Link>
            <Link href="/sign-up"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-bold px-7 py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors w-full sm:w-auto">
              Register Today
            </Link>
          </div>
          <p className="mt-10 font-display text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-white/20">
            WE ARE UNBREAKABLE
          </p>
        </div>

      </section>

      {/* Mission snapshot */}
      <section className="pt-16 sm:pt-20 pb-16 sm:pb-20 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Our Approach</p>
            <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-brand-black tracking-tight">Built to develop complete players</h2>
            <p className="mt-3 text-brand-gray-600 leading-relaxed">
              Our programs combine technical training, tactical education, and character development —
              giving every player the tools to succeed on the pitch and beyond.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
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

      {/* Programs preview */}
      <section className="py-16 sm:py-20 bg-brand-black relative overflow-hidden">
        <Image
          src="/brand/halftone-wave-compact.png"
          alt=""
          width={3288}
          height={1314}
          className="pointer-events-none select-none absolute -left-32 bottom-0 w-[560px] max-w-none opacity-25 mix-blend-screen"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Programs</p>
              <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-white tracking-tight">A pathway for every age</h2>
              <p className="mt-2 text-brand-gray-400">From first touches to competitive pathways.</p>
            </div>
            <Link href="/programs" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-white transition-colors">
              View all programs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS_PREVIEW.map((p) => (
              <Link key={p.name} href="/programs"
                className="bg-brand-gray-900 rounded-2xl border border-white/10 p-6 hover:border-brand-orange transition-colors group">
                <span className="inline-block text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full mb-4">
                  {p.age}
                </span>
                <h3 className="font-semibold text-white mb-1.5 group-hover:text-brand-orange transition-colors">{p.name}</h3>
                <p className="text-sm text-brand-gray-400 leading-relaxed">{p.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-white transition-colors">
              View all programs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 sm:py-20 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">What To Expect</p>
            <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-brand-black tracking-tight mb-4">What every player gets</h2>
            <ul className="space-y-3">
              {[
                "A structured curriculum built around age and ability",
                "Small group sizes for more individual coaching attention",
                "Regular evaluations and feedback for players and parents",
                "Pathways into competitive league and tournament play",
                "A club culture built on respect, effort, and teamwork",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-brand-gray-600 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative bg-white rounded-2xl border-l-4 border-brand-orange shadow-sm p-8">
            <span className="absolute -top-5 left-8 text-6xl text-brand-orange/30 font-serif italic select-none">&ldquo;</span>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                <Trophy size={18} className="text-brand-orange" />
              </div>
              <h3 className="font-semibold text-brand-black">Ready to see it in action?</h3>
            </div>
            <p className="text-sm text-brand-gray-600 leading-relaxed mb-5">
              Browse our weekly training schedule and see when each program meets,
              or create a parent account to register a player and track everything in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/schedule"
                className="inline-flex items-center justify-center gap-2 bg-brand-cream border border-brand-gray-200 hover:border-brand-orange text-brand-black font-semibold px-5 py-2.5 rounded-full text-sm transition-colors">
                <Calendar size={15} /> View Schedule
              </Link>
              <Link href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
                Create Account <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WE ARE UNBREAKABLE banner */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-brand-orange rounded-2xl px-8 sm:px-12 py-10 sm:py-12 flex items-center">
            <Image
              src="/brand/we-are-unbreakable.png"
              alt="We Are Unbreakable"
              width={3420}
              height={531}
              className="w-full max-w-xl h-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 sm:py-20 bg-brand-black text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Join The Academy</p>
          <h2 className="mt-2 font-display uppercase text-3xl sm:text-4xl font-bold text-white tracking-tight">Ready to join the academy?</h2>
          <p className="mt-3 text-brand-gray-400 max-w-xl mx-auto">
            Spots fill quickly each season. Create a free account to register your player and lock in their spot.
          </p>
          <Link href="/sign-up"
            className="mt-7 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors shadow-[0_0_0_1px_rgba(243,108,33,0.4),0_8px_30px_-6px_rgba(243,108,33,0.7)]">
            Register Today <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
