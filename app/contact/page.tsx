import type { Metadata } from "next";
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
  { icon: MapPin, label: "Location", value: `${ACADEMY.area} — Shakhtar Academy Field House` },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri, 9:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-brand-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-xs font-bold text-brand-orange bg-brand-gray-800 px-3 py-1 rounded-full mb-4">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 text-brand-gray-200 max-w-2xl mx-auto leading-relaxed">
            Questions about programs, schedules, or registration? Send us a message and a member
            of our staff will get back to you within 1–2 business days.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div className="space-y-4">
            {INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-brand-gray-100 border border-brand-gray-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-brand-gray-400 font-semibold mb-0.5">{label}</p>
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
