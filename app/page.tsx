import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import {
  ArrowRight, Target, Users, Trophy, ShieldCheck,
  Calendar, Star, CheckCircle2,
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

const STATS = [
  { value: "10+",  label: "Years Coaching Calgary Youth" },
  { value: "500+", label: "Players Developed" },
  { value: "20+",  label: "Licensed Coaches & Staff" },
  { value: "6–18", label: "Age Groups Served" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="relative bg-brand-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-orange/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gray-800 border border-brand-gray-800 rounded-full px-4 py-1.5 mb-6">
            <Star size={13} className="text-brand-orange" />
            <span className="text-xs font-medium text-brand-gray-200">Now registering for the upcoming season</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Shakhtar Academy <span className="text-brand-orange">Calgary</span>
          </h1>
          <p className="mt-5 text-lg text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            {`Calgary's home for elite youth soccer development. Structured programs for ages 6–18, led by licensed coaches who care about every player's growth — on and off the pitch.`}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/programs"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto">
              Explore Programs <ArrowRight size={16} />
            </Link>
            <Link href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-gray-100 text-brand-black font-bold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto">
              Register Today
            </Link>
          </div>
        </div>
      </section>

      {/* Mission snapshot */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-brand-black tracking-tight">Built to develop complete players</h2>
            <p className="mt-3 text-brand-gray-600 leading-relaxed">
              Our programs combine technical training, tactical education, and character development —
              giving every player the tools to succeed on the pitch and beyond.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-brand-gray-100 rounded-2xl p-6 border border-brand-gray-200">
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
      <section className="py-16 sm:py-20 bg-brand-gray-100 border-y border-brand-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-brand-black tracking-tight">Programs for every age</h2>
              <p className="mt-2 text-brand-gray-600">From first touches to competitive pathways.</p>
            </div>
            <Link href="/programs" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors">
              View all programs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS_PREVIEW.map((p) => (
              <Link key={p.name} href="/programs"
                className="bg-white rounded-2xl border border-brand-gray-200 p-6 hover:border-brand-orange transition-colors group">
                <span className="inline-block text-xs font-bold text-brand-orange bg-brand-orange-light px-2.5 py-1 rounded-full mb-4">
                  {p.age}
                </span>
                <h3 className="font-semibold text-brand-black mb-1.5 group-hover:text-brand-orange transition-colors">{p.name}</h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">{p.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors">
              View all programs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold text-brand-orange">{s.value}</p>
                <p className="mt-1.5 text-sm text-brand-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-black tracking-tight mb-4">What every player gets</h2>
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
          <div className="bg-brand-gray-100 rounded-2xl border border-brand-gray-200 p-8">
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
                className="inline-flex items-center justify-center gap-2 bg-white border border-brand-gray-200 hover:border-brand-orange text-brand-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                <Calendar size={15} /> View Schedule
              </Link>
              <Link href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Create Account <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 bg-brand-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Ready to join the academy?</h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Spots fill quickly each season. Create a free account to register your player and lock in their spot.
          </p>
          <Link href="/sign-up"
            className="mt-7 inline-flex items-center gap-2 bg-brand-black hover:bg-brand-gray-900 text-white font-bold px-7 py-3 rounded-xl text-sm transition-colors">
            Register Today <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
