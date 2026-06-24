import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { ACADEMY } from "@/lib/config";

export default function PublicFooter() {
  return (
    <footer className="bg-brand-black border-t border-brand-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/brand/shakhtar-crest.png" alt="" width={207} height={321} className="h-8 w-auto" />
              <span className="text-white font-bold text-base">Shakhtar <span className="text-brand-orange">Academy</span></span>
            </div>
            <p className="text-brand-gray-600 text-sm leading-relaxed">
              {ACADEMY.tagline}.
            </p>
          </div>

          {/* Club */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Club</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about"    className="text-brand-gray-600 hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link href="/coaches"  className="text-brand-gray-600 hover:text-brand-orange transition-colors">Coaches</Link></li>
              <li><Link href="/schedule" className="text-brand-gray-600 hover:text-brand-orange transition-colors">Schedule</Link></li>
              <li><Link href="/contact"  className="text-brand-gray-600 hover:text-brand-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/programs" className="text-brand-gray-600 hover:text-brand-orange transition-colors">Mini Strikers (U6–U8)</Link></li>
              <li><Link href="/programs" className="text-brand-gray-600 hover:text-brand-orange transition-colors">Development Squad (U9–U12)</Link></li>
              <li><Link href="/programs" className="text-brand-gray-600 hover:text-brand-orange transition-colors">Elite Pathway (U13–U16)</Link></li>
              <li><Link href="/programs" className="text-brand-gray-600 hover:text-brand-orange transition-colors">Pre-Academy (U17+)</Link></li>
            </ul>
          </div>

          {/* Contact + Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`tel:${ACADEMY.phone}`} className="flex items-center gap-2 text-brand-gray-600 hover:text-brand-orange transition-colors">
                  <Phone size={13} />{ACADEMY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${ACADEMY.email}`} className="flex items-center gap-2 text-brand-gray-600 hover:text-brand-orange transition-colors">
                  <Mail size={13} />{ACADEMY.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-brand-gray-600">
                <MapPin size={13} />{ACADEMY.area}
              </li>
            </ul>

            <h4 className="text-white font-semibold text-sm mt-6 mb-3">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sign-in" className="text-brand-gray-600 hover:text-brand-orange transition-colors">
                  Parent Portal
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-brand-gray-600 hover:text-brand-orange transition-colors">
                  Staff Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-gray-600 text-xs">
            © {new Date().getFullYear()} {ACADEMY.name}. All rights reserved.
          </p>
          <Link href="/contact" className="text-brand-orange text-xs font-semibold hover:underline">
            Register for a Program →
          </Link>
        </div>
      </div>
    </footer>
  );
}
