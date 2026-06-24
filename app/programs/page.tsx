import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, MapPin, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;


export const metadata: Metadata = {
  title: "Programs",
  description:
    "Browse Shakhtar Academy Calgary's youth soccer programs by age group — Mini Strikers, Development Squad, Elite Pathway, and Pre-Academy. Training schedules and pricing included.",
};

// Highlights are editorial content, not in the DB — keyed by program name
const HIGHLIGHTS: Record<string, string[]> = {
  "Mini Strikers": [
    "Fun, game-based sessions — no standing in lines",
    "Focus on ball familiarity, balance, and coordination",
    "1 coach for every 8 players",
    "End-of-season jamboree for all Mini Strikers",
  ],
  "Development Squad": [
    "Structured technical curriculum each session",
    "Introduction to positions and team tactics",
    "Friendly matches against partner clubs",
    "Mid-season player evaluations with feedback for parents",
  ],
  "Elite Pathway": [
    "Position-specific and small-group technical training",
    "Full competitive league season + tournaments",
    "Strength, speed, and injury-prevention conditioning",
    "Individualized development plans each season",
  ],
  "Pre-Academy": [
    "Advanced tactical and game-management training",
    "Exposure matches and recruiting support",
    "College & provincial pathway guidance",
    "Direct mentorship from senior coaching staff",
  ],
};

const DEFAULT_HIGHLIGHTS = [
  "Expert coaching tailored to your age group",
  "Structured training curriculum",
  "Competitive opportunities and player evaluations",
  "Welcoming team environment",
];

const FALLBACK = [
  { name: "Mini Strikers",     age_group: "U6 – U8",   price: 149, schedule_summary: "Tue & Thu · 5:00–6:00 PM · Field House",              description: "An introduction to the game built entirely around fun — first touches, coordination, and a love for the ball.", is_active: true },
  { name: "Development Squad", age_group: "U9 – U12",  price: 189, schedule_summary: "Mon, Wed & Fri · 5:30–7:00 PM · Field House",         description: "Building the technical and tactical foundation players rely on for the rest of their careers.", is_active: true },
  { name: "Elite Pathway",     age_group: "U13 – U16", price: 239, schedule_summary: "Mon–Thu · 6:00–7:30 PM · Field House & Turf 2",       description: "Our most competitive program — high-intensity training, advanced tactics, and a full league + tournament schedule.", is_active: true },
  { name: "Pre-Academy",       age_group: "U17+",      price: 259, schedule_summary: "Mon, Tue & Thu · 7:00–8:30 PM · Field House & Turf 2", description: "The final step before senior and post-secondary soccer — elite-level training and exposure to scouts.", is_active: true },
];

interface DashboardProgram {
  id: string; name: string; age_min: number | null; age_max: number | null;
  price_cad: number; gst_rate: number; schedule_days: string[] | null;
  sessions_min: number | null; sessions_max: number | null; is_active: boolean;
}

interface Program {
  id: string; name: string; age_group: string;
  description: string | null; price: number | null;
  schedule_summary: string | null; is_active: boolean;
}

function adapt(p: DashboardProgram): Program {
  const days = p.schedule_days?.join(", ") ?? "";
  const sessions = p.sessions_min
    ? ` · ${p.sessions_min}${p.sessions_max && p.sessions_max !== p.sessions_min ? `–${p.sessions_max}` : ""} sessions/wk`
    : "";
  return {
    id: p.id,
    name: p.name,
    age_group: p.age_min && p.age_max ? `U${p.age_min} – U${p.age_max}` : p.age_min ? `U${p.age_min}+` : "All ages",
    description: null,
    price: p.price_cad,
    schedule_summary: days ? `${days}${sessions}` : null,
    is_active: p.is_active,
  };
}

export default async function ProgramsPage() {
  let programs: Program[] = FALLBACK as Program[];

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("programs")
      .select("id,name,age_min,age_max,price_cad,gst_rate,schedule_days,sessions_min,sessions_max,is_active")
      .eq("is_active", true)
      .order("price_cad");
    if (data && data.length > 0) programs = data.map(adapt);
  } catch { /* offline — use fallback */ }

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
            className="pointer-events-none select-none absolute -right-28 -top-20 w-[560px] max-w-none opacity-40 mix-blend-screen sm:opacity-60"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="font-display text-xs sm:text-sm uppercase tracking-[0.25em] text-brand-orange font-medium">
            Programs &amp; Pricing
          </p>
          <h1 className="mt-3 font-display uppercase text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            A program for every stage
          </h1>
          <p className="mt-5 text-base sm:text-lg text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            {`From a player's very first touch to their pursuit of competitive soccer, our four programs are built to meet players where they are — and help them get to where they want to go.`}
          </p>
        </div>
      </section>

      {/* Programs list */}
      <section className="py-16 sm:py-24 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {programs.map((p, i) => {
            const highlights = HIGHLIGHTS[p.name] ?? DEFAULT_HIGHLIGHTS;
            const [schedule, ...locationParts] = (p.schedule_summary ?? "").split(" · ");
            const location = locationParts.join(" · ") || "Shakhtar Academy Field House";

            return (
              <div key={p.name} id={p.name.toLowerCase().replace(/\s+/g, "-")} className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden shadow-sm scroll-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className={`lg:col-span-2 p-7 sm:p-8 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-display text-2xl font-bold text-brand-orange/25 leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.age_group && (
                        <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-2.5 py-1 rounded-full">
                          {p.age_group}
                        </span>
                      )}
                      <h2 className="font-display uppercase text-2xl font-bold text-brand-black tracking-tight">{p.name}</h2>
                    </div>
                    <p className="text-brand-gray-600 leading-relaxed mb-5">
                      {p.description ?? ""}
                    </p>
                    <ul className="space-y-2.5">
                      {highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                          <span className="text-sm text-brand-gray-600">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-brand-black p-7 sm:p-8 flex flex-col justify-between ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="space-y-4">
                      <div>
                        <p className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-medium mb-1">Tuition</p>
                        <p className="font-display text-2xl font-bold text-white">
                          {p.price ? `$${p.price} / month` : "Contact us"}
                        </p>
                      </div>
                      {schedule && (
                        <div className="flex items-start gap-2.5">
                          <Clock size={15} className="text-brand-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-medium mb-0.5">Schedule</p>
                            <p className="text-sm text-white font-medium">{schedule}</p>
                          </div>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-start gap-2.5">
                          <MapPin size={15} className="text-brand-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-medium mb-0.5">Location</p>
                            <p className="text-sm text-white font-medium">{location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/contact"
                      className="mt-6 inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-3 rounded-full text-xs uppercase tracking-wide transition-colors shadow-[0_0_0_1px_rgba(243,108,33,0.4),0_8px_30px_-6px_rgba(243,108,33,0.7)]"
                    >
                      Register for {p.name} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Note / CTA */}
      <section className="relative py-16 sm:py-20 bg-brand-black overflow-hidden">
        <Image
          src="/brand/halftone-wave-compact.png"
          alt=""
          width={3288}
          height={1314}
          className="pointer-events-none select-none absolute -left-24 -bottom-24 w-[460px] max-w-none opacity-25 mix-blend-screen"
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-orange font-medium">Not Sure Where To Start?</p>
          <h2 className="mt-2 font-display uppercase text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Talk to our staff about the right fit
          </h2>
          <p className="mt-3 text-brand-gray-200 max-w-xl mx-auto leading-relaxed">
            Our staff will help you find the best program for your player based on age, experience, and
            goals. Sibling and multi-season discounts are available — ask us when you register.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-bold px-7 py-3.5 rounded-full text-sm uppercase tracking-wide transition-colors"
          >
            Get In Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
