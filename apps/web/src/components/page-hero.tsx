import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({
  title,
  subtitle,
  badge,
  image,
  breadcrumbs,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-navy-dark text-white py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      {/* Background Image & Overlay */}
      {image ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-25 scale-105 transform motion-safe:animate-subtle-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/80 to-navy/70" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-ink opacity-95">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-1.5 text-xs text-white/60">
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

        {/* Badge */}
        {badge ? (
          <div className="mb-4 inline-flex items-center gap-2 rounded-pill bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange backdrop-blur-md border border-white/10">
            <span className="size-1.5 rounded-full bg-brand-orange animate-pulse" />
            {badge}
          </div>
        ) : null}

        {/* Headline */}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed font-light">
            {subtitle}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
