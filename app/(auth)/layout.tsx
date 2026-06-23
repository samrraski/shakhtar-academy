import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-gray-900 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">SA</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Shakhtar Academy</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="mt-8 text-xs text-brand-gray-400">Parent &amp; Guardian Portal</p>
    </div>
  );
}
