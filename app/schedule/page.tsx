import type { Metadata } from "next";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Calendar, MapPin, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Training Schedule",
  description:
    "Weekly training schedule for Shakhtar Academy Calgary's youth soccer programs — Mini Strikers, Development Squad, Elite Pathway, and Pre-Academy.",
};

const WEEKLY_SCHEDULE = [
  { program: "Mini Strikers",     age: "U6 – U8",   days: "Tue & Thu",        time: "5:00 – 6:00 PM", location: "Field House" },
  { program: "Development Squad", age: "U9 – U12",  days: "Mon, Wed & Fri",   time: "5:30 – 7:00 PM", location: "Field House" },
  { program: "Elite Pathway",     age: "U13 – U16", days: "Mon – Thu",        time: "6:00 – 7:30 PM", location: "Field House & Turf 2" },
  { program: "Pre-Academy",       age: "U17+",      days: "Mon, Tue & Thu",   time: "7:00 – 8:30 PM", location: "Field House & Turf 2" },
];

const UPCOMING_EVENTS = [
  { type: "Tournament", title: "Fall Jamboree (U6 – U12)",          date: "Sat, Sep 13",  location: "Shakhtar Academy Field House" },
  { type: "Game",       title: "Elite Pathway vs. Calgary United",  date: "Sun, Sep 21",  location: "Turf 2" },
  { type: "Evaluation", title: "Mid-Season Player Evaluations",     date: "Sat, Oct 18",  location: "Field House" },
  { type: "Tournament", title: "Pre-Academy Showcase Weekend",      date: "Oct 24 – 26",  location: "Calgary Soccer Centre" },
];

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-brand-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold text-brand-orange bg-brand-gray-800 px-3 py-1 rounded-full mb-4">
            Training Schedule
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            When and where we train
          </h1>
          <p className="mt-4 text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            Here&apos;s our regular weekly training schedule by program, plus upcoming games, tournaments,
            and key academy dates. Registered families get a personalized schedule and reminders in their portal.
          </p>
        </div>
      </section>

      {/* Weekly schedule */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2.5 mb-6">
            <Calendar size={18} className="text-brand-orange" />
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">Weekly training</h2>
          </div>
          <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-5 sm:px-6 py-3 bg-brand-gray-100 text-xs font-semibold uppercase tracking-wide text-brand-gray-400">
              <span>Program</span>
              <span>Days</span>
              <span>Time</span>
              <span className="hidden sm:block">Location</span>
            </div>
            <ul className="divide-y divide-brand-gray-200">
              {WEEKLY_SCHEDULE.map((row) => (
                <li key={row.program} className="grid grid-cols-4 gap-4 px-5 sm:px-6 py-4 items-center hover:bg-brand-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-brand-black">{row.program}</p>
                    <span className="inline-block mt-1 text-xs font-bold text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full">
                      {row.age}
                    </span>
                  </div>
                  <span className="text-sm text-brand-gray-600">{row.days}</span>
                  <span className="text-sm text-brand-gray-600">{row.time}</span>
                  <span className="hidden sm:flex items-center gap-1.5 text-sm text-brand-gray-600">
                    <MapPin size={13} className="text-brand-gray-400" /> {row.location}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-brand-gray-400">
            Schedules may shift slightly by season. Registered families always see the most current
            schedule for their player&apos;s program inside the parent portal.
          </p>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-16 sm:py-20 bg-brand-gray-100 border-y border-brand-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2.5 mb-6">
            <Trophy size={18} className="text-brand-orange" />
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">Upcoming games &amp; events</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {UPCOMING_EVENTS.map((e) => (
              <div key={e.title} className="bg-white rounded-2xl border border-brand-gray-200 p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex flex-col items-center justify-center shrink-0">
                  <Calendar size={18} className="text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <span className="inline-block text-xs font-bold text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full mb-1.5">
                    {e.type}
                  </span>
                  <p className="text-sm font-semibold text-brand-black">{e.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xs text-brand-gray-600">{e.date}</span>
                    <span className="flex items-center gap-1 text-xs text-brand-gray-600">
                      <MapPin size={11} className="text-brand-gray-400" /> {e.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-brand-black tracking-tight">Get a personalized schedule</h2>
          <p className="mt-3 text-brand-gray-600 max-w-xl mx-auto">
            Create a free parent account to register your player and see their program&apos;s schedule,
            upcoming games, and registration status all in one place.
          </p>
          <Link href="/sign-up"
            className="mt-7 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-7 py-3 rounded-xl text-sm transition-colors">
            Create Your Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
