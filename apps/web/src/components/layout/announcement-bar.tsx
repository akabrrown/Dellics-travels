"use client";

import { usePathname } from "next/navigation";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { RegionalSelector } from "@/components/layout/regional-selector";

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname === "/signin" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <div className="bg-[#050038] text-white/90 text-xs py-1.5 px-4 border-b border-white/10 relative z-50">
      <div className="mx-auto max-w-7xl flex flex-row items-center justify-between gap-4">
        {/* Left Section: Accreditation & Contact Info */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="size-3 text-brand-orange" />
            IATA Certified
          </span>
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-white/80">
            <a
              href={`tel:${SITE.whatsappNumber}`}
              className="flex items-center gap-1 hover:text-brand-orange transition-colors"
            >
              <Phone className="size-3 text-brand-orange" />
              <span>{SITE.phoneDisplay}</span>
            </a>
            <span className="text-white/30">•</span>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-1 hover:text-brand-orange transition-colors"
            >
              <Mail className="size-3 text-brand-orange" />
              <span>{SITE.email}</span>
            </a>
          </div>
        </div>

        {/* Right Section: Regional Selector (EN | Flag GH | GHS ⌵) */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <RegionalSelector variant="announcement" />
        </div>
      </div>
    </div>
  );
}
