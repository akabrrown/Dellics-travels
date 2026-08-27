import Link from "next/link";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-navy-dark via-navy to-ink text-white/90 text-xs py-2 px-4 border-b border-white/10">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            IATA Accredited #5921820
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-white/80">
            <ShieldCheck className="size-3.5 text-brand-orange" />
            Licensed by Ghana Tourism Authority
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
          <span className="text-white/30 hidden sm:inline">•</span>
          <Link
            href="/credentials"
            className="text-white/80 hover:text-brand-orange transition-colors underline decoration-brand-orange/40 underline-offset-2"
          >
            Verify Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
