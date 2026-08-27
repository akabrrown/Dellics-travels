"use client";

import { usePathname } from "next/navigation";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname === "/signin" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <div className="bg-navy-dark text-white/90 text-xs py-2 px-4 border-b border-white/10">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="size-3 text-brand-orange" />
            IATA Certified
          </span>
          <span className="hidden md:inline-flex items-center text-white/80 text-[11px]">
            Worldwide Flights, Luxury Stays & Bespoke Holidays
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          <a
            href={`tel:${SITE.whatsappNumber}`}
            className="flex items-center gap-1 hover:text-brand-orange transition-colors"
          >
            <Phone className="size-3 text-brand-orange" />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <span className="text-white/30 hidden sm:inline">•</span>
          <a
            href={`mailto:${SITE.email}`}
            className="hidden sm:flex items-center gap-1 hover:text-brand-orange transition-colors"
          >
            <Mail className="size-3 text-brand-orange" />
            <span>{SITE.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
