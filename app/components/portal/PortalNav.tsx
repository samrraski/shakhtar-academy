'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Receipt, Newspaper, MessageSquare, Settings } from 'lucide-react';
import SignOutButton from './SignOutButton';

const NAV = [
  { href: '/dashboard',          label: 'Home',     icon: Home },
  { href: '/dashboard/schedule', label: 'Schedule', icon: Calendar },
  { href: '/dashboard/billing',  label: 'Billing',  icon: Receipt },
  { href: '/dashboard/posts',    label: 'News',     icon: Newspaper },
  { href: '/dashboard/contact',  label: 'Contact',  icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function PortalNav({ email }: { email?: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-brand-gray-900 border-r border-white/10 min-h-screen flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">SA</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">Shakhtar</p>
              <p className="text-brand-gray-400 text-xs mt-0.5">Parent Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-brand-orange/15 text-brand-orange'
                  : 'text-brand-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          {email && (
            <p className="px-3 text-xs text-brand-gray-400 truncate">{email}</p>
          )}
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-brand-gray-900 border-t border-white/10 flex z-50">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors ${
              isActive(href) ? 'text-brand-orange' : 'text-brand-gray-400'
            }`}
          >
            <Icon size={20} className="mb-0.5" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
