import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-brand-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Shakhtar <span className="text-brand-orange">Academy</span>
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
