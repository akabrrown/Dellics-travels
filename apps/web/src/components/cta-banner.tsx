import Link from "next/link";
import { PhoneCall, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

interface CtaBannerProps {
  title: string;
  copy?: string;
  label?: string;
  href?: string;
  showWhatsapp?: boolean;
}

export function CtaBanner({
  title,
  copy,
  label = "Start an inquiry",
  href = "/inquire",
  showWhatsapp = true,
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-ink px-4 py-20 text-center text-white sm:px-6 lg:px-8">
      {/* Decorative ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-pill bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange backdrop-blur-md border border-white/10">
          <ShieldCheck className="size-3.5" />
          Bespoke Planning
        </div>

        <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed font-light">
            {copy}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-pill bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-xl hover:shadow-2xl transition-all"
          >
            <Link href={href} className="inline-flex items-center gap-2">
              <span>{label}</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          {showWhatsapp ? (
            <a
              href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I would like to plan a trip with an expert.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md border border-white/10 transition-colors"
            >
              <PhoneCall className="size-4 text-emerald-400" />
              <span>WhatsApp Concierge (24/7)</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
