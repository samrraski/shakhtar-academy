import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <Image src="/brand/shakhtar-crest.png" alt="Shakhtar Academy" width={207} height={321} className="h-12 w-auto" />
        <div className="leading-none">
          <p className="text-white font-black text-lg uppercase tracking-tight">Shakhtar</p>
          <p className="text-brand-orange font-bold text-sm uppercase">Academy Calgary</p>
        </div>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
