import type { Metadata } from "next";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import ContactForm from "./ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ACADEMY } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Shakhtar Academy Calgary — ask about programs, schedules, registration, or anything else. We're happy to help you find the right fit for your player.",
};

const INFO = [
  { icon: Phone, label: "Phone",  value: ACADEMY.phone, href: `tel:${ACADEMY.phone}` },
  { icon: Mail,  label: "Email",  value: ACADEMY.email, href: `mailto:${ACADEMY.email}` },
  { icon: MapPin, label: "Location", value: "Calgary, AB — Shakhtar Academy Field House" },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri, 9:00 AM – 6:00 PM" },
];

export default function ContactPage() {
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
            Get In Touch
          </p>
          <h1 className="mt-3 font-display uppercase text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            {`We'd love to hear from you`}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            Questions about programs, schedules, or registration? Send us a message and a member
            of our staff will get back to you within 1–2 business days.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-16 sm:py-24 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray-200 p-6 sm:p-8">
            <ContactForm />
          </div>
          <div className="space-y-4">
            {INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-white border border-brand-gray-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-medium mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-brand-black hover:text-brand-orange transition-colors break-words">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-brand-black break-words">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
