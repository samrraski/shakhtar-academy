import type { Metadata } from "next";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Browse Shakhtar Academy Calgary's youth soccer programs by age group — Mini Strikers, Development Squad, Elite Pathway, and Pre-Academy. Training schedules and pricing included.",
};

const PROGRAMS = [
  {
    age: "U6 – U8",
    name: "Mini Strikers",
    price: "$149 / month",
    schedule: "Tue & Thu · 5:00–6:00 PM",
    location: "Shakhtar Academy Field House",
    desc: "An introduction to the game built entirely around fun. Players develop their first touches, basic coordination, and a love for the ball through games and small-sided play.",
    highlights: [
      "Fun, game-based sessions — no standing in lines",
      "Focus on ball familiarity, balance, and coordination",
      "1 coach for every 8 players",
      "End-of-season jamboree for all Mini Strikers",
    ],
  },
  {
    age: "U9 – U12",
    name: "Development Squad",
    price: "$189 / month",
    schedule: "Mon, Wed & Fri · 5:30–7:00 PM",
    location: "Shakhtar Academy Field House",
    desc: "Players build the technical and tactical foundation they'll rely on for the rest of their playing careers — passing, dribbling, spatial awareness, and an introduction to team shape.",
    highlights: [
      "Structured technical curriculum each session",
      "Introduction to positions and team tactics",
      "Friendly matches against partner clubs",
      "Mid-season player evaluations with feedback for parents",
    ],
  },
  {
    age: "U13 – U16",
    name: "Elite Pathway",
    price: "$239 / month",
    schedule: "Mon–Thu · 6:00–7:30 PM",
    location: "Shakhtar Academy Field House & Turf 2",
    desc: "Our most competitive program — for players who are serious about improving and want to be challenged. High-intensity training, advanced tactical concepts, and a full league + tournament schedule.",
    highlights: [
      "Position-specific and small-group technical training",
      "Full competitive league season + tournaments",
      "Strength, speed, and injury-prevention conditioning",
      "Individualized development plans each season",
    ],
  },
  {
    age: "U17+",
    name: "Pre-Academy",
    price: "$259 / month",
    schedule: "Mon, Tue & Thu · 7:00–8:30 PM",
    location: "Shakhtar Academy Field House & Turf 2",
    desc: "Preparing our most advanced players for the next level — whether that's provincial programs, college recruitment, or senior amateur and semi-pro play.",
    highlights: [
      "Advanced tactical and game-management training",
      "Exposure matches and recruiting support",
      "College & provincial pathway guidance",
      "Direct mentorship from senior coaching staff",
    ],
  },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-brand-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold text-brand-orange bg-brand-gray-800 px-3 py-1 rounded-full mb-4">
            Programs &amp; Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            A program for every stage
          </h1>
          <p className="mt-4 text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            From a player&apos;s very first touch to their pursuit of competitive soccer, our four programs
            are built to meet players where they are — and help them get to where they want to go.
          </p>
        </div>
      </section>

      {/* Programs list */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {PROGRAMS.map((p, i) => (
            <div key={p.name} className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className={`lg:col-span-2 p-7 sm:p-8 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-2.5 py-1 rounded-full">
                      {p.age}
                    </span>
                    <h2 className="text-2xl font-bold text-brand-black">{p.name}</h2>
                  </div>
                  <p className="text-brand-gray-600 leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2.5">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                        <span className="text-sm text-brand-gray-600">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-brand-gray-100 p-7 sm:p-8 flex flex-col justify-between ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-brand-gray-400 font-semibold mb-1">Tuition</p>
                      <p className="text-2xl font-extrabold text-brand-black">{p.price}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock size={15} className="text-brand-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-brand-gray-400 font-semibold mb-0.5">Schedule</p>
                        <p className="text-sm text-brand-black font-medium">{p.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={15} className="text-brand-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-brand-gray-400 font-semibold mb-0.5">Location</p>
                        <p className="text-sm text-brand-black font-medium">{p.location}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/sign-up"
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                    Register for {p.name} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-brand-gray-100 border border-brand-gray-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-brand-gray-600 leading-relaxed">
              Not sure which program is right for your player? <Link href="/contact" className="text-brand-orange font-semibold hover:underline">Get in touch</Link> and
              our staff will help you find the best fit based on age, experience, and goals. Sibling and
              multi-season discounts are available — ask us when you register.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
