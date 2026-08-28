"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { AccreditationStrip } from "@/components/accreditation-strip";

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const SERVICES_LINKS = [
  { label: "Flight Ticketing", href: "/flights" },
  { label: "Hotels & Stays", href: "/hotels" },
  { label: "Tour Packages", href: "/tours" },
  { label: "Airport Transfers", href: "/transfers" },
  { label: "Visa Assistance", href: "/visa" },
  { label: "Corporate Travel", href: "/corporate" },
  { label: "Diaspora & Heritage", href: "/diaspora" },
];

const DESTINATIONS_LINKS = [
  { label: "Africa & Safaris", href: "/destinations/africa" },
  { label: "Europe & UK Escapes", href: "/destinations/europe" },
  { label: "Asia & Exotic Stays", href: "/destinations/asia" },
  { label: "Middle East & Dubai", href: "/destinations/middle-east" },
  { label: "North America", href: "/destinations/north-america" },
  { label: "All Destinations", href: "/destinations" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
  { label: "Start an Inquiry", href: "/inquire" },
  { label: "Client Login", href: "/signin" },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/signin" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <footer className="bg-navy-dark text-white">
      {/* Accreditation Banner */}
      <AccreditationStrip />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-5 md:grid-cols-2">
          {/* Column 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center group" aria-label="Dellics Travels Home">
              <div className="relative h-16 w-24 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/Logo.png"
                  alt={`${SITE.name} logo`}
                  fill
                  className="object-contain"
                  unoptimized
                />

              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/75 max-w-md">
              Dellics Travels LLC is an IATA Certified global luxury travel management agency. We organize international flight tickets, corporate itineraries, visa advisory, and curated vacation packages across 5 continents.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-white/80">
                <MapPin className="size-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Ghana HQ:</span> Community 25, Devtraco Estate, Tema, Greater Accra
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-white/80">
                <MapPin className="size-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">USA Office:</span> 30 N Gould ST, STER, SHERIDAN, WY 82801
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <Phone className="size-4 text-brand-orange shrink-0" />
                <a href={`tel:${SITE.whatsappNumber}`} className="hover:text-brand-orange transition-colors">
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <Mail className="size-4 text-brand-orange shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-brand-orange transition-colors">
                  {SITE.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <Clock className="size-4 text-brand-orange shrink-0" />
                <span>Mon – Sat: 8:00 AM – 6:00 PM GMT · 24/7 Concierge</span>
              </div>
            </div>
          </div>

          {/* Column 2: Travel Services */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-brand-orange">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-brand-orange">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {DESTINATIONS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Instant Support */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-brand-orange">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/inquire"
                className="flex items-center justify-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 text-xs shadow-md transition-colors"
              >
                <ArrowRight className="size-3.5" />
                <span>Start an Inquiry</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Dellics Travels & Tours Ltd. All rights reserved. IATA Certified Agency.</p>
          <div className="flex items-center gap-6">
            {LEGAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
