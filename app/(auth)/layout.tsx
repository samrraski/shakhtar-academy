import Image from "next/image";
import Link from "next/link";

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
            <Image src="/brand/shakhtar-crest.png" alt="" width={207} height={321} className="h-10 w-auto" />
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
