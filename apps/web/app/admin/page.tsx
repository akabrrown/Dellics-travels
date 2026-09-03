import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Administrative Control Portal",
  description: "Dellics Travels enterprise administration and operations dispatch portal.",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <section className="min-h-[75vh] bg-navy-dark px-4 py-28 text-center text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        <div className="size-20 rounded-3xl bg-white p-2 shadow-2xl border border-white/20 mx-auto flex items-center justify-center">
          <Image
            src="/logo.jpeg"
            alt="Dellics Travels"
            width={72}
            height={72}
            className="size-full object-contain"
            priority
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <ShieldCheck className="size-3.5" />
            <span>Operations & Command</span>
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
            Administrative Portal
          </h1>
          <p className="mt-3 text-sm text-white/75 leading-relaxed">
            The Dellics Travels Operations Control Center is hosted in a restricted administrative environment with multi-factor authentication (TOTP/2FA).
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3000"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white font-bold px-8 py-3 text-sm shadow-lg transition-all"
          >
            <span>Launch Admin Console</span>
            <ArrowRight className="size-4" />
          </a>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="size-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
