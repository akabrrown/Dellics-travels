import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
  hideText?: boolean;
}

export function PageHero({
  title,
  subtitle,
  image,
  breadcrumbs,
  className,
  children,
  hideText = false,
}: PageHeroProps) {
  const isFeatureHero = Boolean(children || hideText);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-navy-dark text-white flex items-center justify-center",
        isFeatureHero
          ? "min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] py-6 sm:py-8"
          : "py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      {/* Background Image & Overlay */}
      {image ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title || "Dellics Travels"}
            fill
            className="object-cover opacity-80 scale-105 transform motion-safe:animate-subtle-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0060]/85 via-[#0A0060]/40 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0060]/50 via-transparent to-[#0A0060]/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0060] via-[#140882] to-[#0A0060] opacity-95">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent" />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
            <Link href="/" className="hover:text-brand-orange transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3 text-white/40" />
                {crumb.href && idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-brand-orange transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-brand-orange font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {/* Text is only rendered if not in feature hero mode */}
        {!isFeatureHero && title ? (
          <>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
              {title}
            </h1>

            {subtitle ? (
              <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed font-light">
                {subtitle}
              </p>
            ) : null}
          </>
        ) : null}

        {children ? <div className="w-full mt-2 flex justify-center">{children}</div> : null}
      </div>
    </section>
  );
}
