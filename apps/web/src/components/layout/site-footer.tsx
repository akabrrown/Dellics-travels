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

const BOOK_LINKS = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Tours", href: "/tours" },
  { label: "Transfers", href: "/transfers" },
  { label: "Cars", href: "/transfers#car-rental" },
  { label: "eSIM", href: "/esim" },
];

const TRAVEL_SERVICES_LINKS = [
  { label: "Visa Advisory", href: "/visa" },
  { label: "Corporate Travel", href: "/corporate" },
  { label: "Travel Insurance", href: "/services#insurance" },
  { label: "Concierge", href: "/services#concierge" },
  { label: "Accreditations & Credentials", href: "/credentials" },
  { label: "FAQs & Knowledgebase", href: "/faq" },
];

const EXPERIENCES_LINKS = [
  { label: "Ghana Tours", href: "/tours" },
  { label: "Diaspora", href: "/diaspora" },
  { label: "Africa", href: "/destinations/africa" },
  { label: "International Packages", href: "/destinations" },
];

const MY_TRIP_LINKS = [
  { label: "Manage Booking", href: "/profile" },
  { label: "My Account", href: "/profile" },
];

const SUPPORT_LINKS = [
  {
    label: "WhatsApp Concierge",
    href: `https://wa.me/${SITE.whatsappNumber}`,
    external: true,
  },
  { label: "Contact", href: "/contact" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "Help Centre & Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function SiteFooter() {
  const pathname = usePathname();

  if (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return null;
  }

  return (
    <footer className="bg-navy-dark text-white">

        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Column 1: Brand & Contact Info */}
            <div className="lg:col-span-4 space-y-6">
              <Link
                href="/"
                className="inline-flex items-center group"
                aria-label="Dellics Travels Home"
              >
                <div className="relative h-16 w-24 shrink-0 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.jpeg"
                    alt={`${SITE.name} logo`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </Link>
              <div className="space-y-2 text-sm leading-relaxed text-white/75 max-w-sm">
                <p className="font-medium text-white/90">
                  Africa’s trusted Online Travel Company.
                </p>
                <p>
                  We provide Flights, Hotels, Tour &amp; Holiday Packages, eSIM, and
                  Diaspora Tourism services worldwide.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <MapPin className="size-4 text-brand-orange shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">Dellics Travels Ghana - Headquarters</p>
                    <p className="text-white/75">GN-0490-2450, Tema, Greater Accra</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <MapPin className="size-4 text-brand-orange shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">Dellics Travels LLC - United States</p>
                    <p className="text-white/75">30 N Gould ST, STER, SHERIDAN, WY 82801</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <Phone className="size-4 text-brand-orange shrink-0" />
                  <a
                    href={`tel:${SITE.whatsappNumber}`}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <Mail className="size-4 text-brand-orange shrink-0" />
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {SITE.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <Clock className="size-4 text-brand-orange shrink-0" />
                  <span>24/7 Supports and Chat with Travel Consultant</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/inquire"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-5 text-xs shadow-md transition-colors"
                >
                  <ArrowRight className="size-3.5" />
                  <span>Start an Inquiry</span>
                </Link>
              </div>
            </div>

            {/* Columns 2-6: Structured OTA Navigation */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {/* 1. BOOK */}
              <div className="space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Book
                </h4>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {BOOK_LINKS.map((link) => (
                    <li key={link.label}>
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

              {/* 2. TRAVEL SERVICES */}
              <div className="space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Travel Services
                </h4>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {TRAVEL_SERVICES_LINKS.map((link) => (
                    <li key={link.label}>
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

              {/* 3. EXPERIENCES */}
              <div className="space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Experiences
                </h4>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {EXPERIENCES_LINKS.map((link) => (
                    <li key={link.label}>
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

              {/* 4. MY TRIP */}
              <div className="space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                  My Trip
                </h4>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {MY_TRIP_LINKS.map((link) => (
                    <li key={link.label}>
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

              {/* 5. SUPPORT */}
              <div className="space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Support
                </h4>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {SUPPORT_LINKS.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white hover:underline transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="hover:text-white hover:underline transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <p>
              © {new Date().getFullYear()} Dellics Travels Online Travel Agency.
              All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {LEGAL_LINKS.map((item) => (
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
