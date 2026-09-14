"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Plane,
  Hotel,
  Compass,
  Palmtree,
  Smartphone,
  Layers,
  ShieldCheck,
  Award,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { AccreditationsModal, ACCREDITATION_BADGES } from "@/components/accreditations-modal";

const OTA_CATEGORY_STRIP = [
  { label: "Flights", href: "/flights", icon: Plane },
  { label: "Hotels", href: "/hotels", icon: Hotel },
  { label: "Tours", href: "/tours", icon: Compass },
  { label: "Packages/Diaspora Tours", href: "/diaspora", icon: Palmtree },
  { label: "eSIM", href: "/esim", icon: Smartphone },
  { label: "Services", href: "/services", icon: Layers },
];

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
  { label: "Help Centre", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function SiteFooter() {
  const [accreditationsOpen, setAccreditationsOpen] = useState(false);
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
    <>
      <footer className="bg-navy-dark text-white">
        {/* Dedicated Accreditations & Partners Showcase Banner Button in Footer */}
        <div className="border-b border-white/10 bg-navy/60 px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white/80">
              <Award className="size-4 text-brand-orange shrink-0" />
              <span className="font-semibold text-white">
                Official Certifications:
              </span>
              <span className="text-white/70">
                Ghana Tourism Authority (GTA) · IATA · TOUGHA · Amadeus · RateHawk · Paystack
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAccreditationsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/20 hover:bg-brand-orange text-brand-orange hover:text-white px-3.5 py-1 text-xs font-bold border border-brand-orange/40 transition-all duration-200 cursor-pointer"
            >
              <ShieldCheck className="size-3.5" />
              <span>Show Partner Logos ({ACCREDITATION_BADGES.length})</span>
            </button>
          </div>
        </div>

        {/* OTA Quick Category Strip */}
        <div className="border-b border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <nav
              aria-label="Quick Category Navigation"
              className="flex flex-wrap items-center justify-center gap-y-2 text-xs sm:text-sm font-medium text-white/80"
            >
              {OTA_CATEGORY_STRIP.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={category.href} className="flex items-center">
                    <Link
                      href={category.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-white/85 hover:text-brand-orange hover:bg-white/5 transition-colors"
                    >
                      <Icon className="size-3.5 text-brand-orange" />
                      <span>{category.label}</span>
                    </Link>
                    {index < OTA_CATEGORY_STRIP.length - 1 && (
                      <span className="hidden sm:inline-block text-white/20 select-none px-1">
                        |
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

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

              {/* Dedicated Button for Accreditations in Brand Column */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccreditationsOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/90 hover:text-brand-orange transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="size-4 text-brand-orange" />
                  <span>View Official Accreditations &amp; Partner Logos</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <MapPin className="size-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Ghana HQ:</span>{" "}
                    Community 25, Devtraco Estate, Tema, Greater Accra
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <MapPin className="size-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">USA Office:</span>{" "}
                    30 N Gould ST, STER, SHERIDAN, WY 82801
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
                  <span>Mon – Sat: 8:00 AM – 6:00 PM GMT · 24/7 Concierge</span>
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
              © {new Date().getFullYear()} Dellics Travels Online Travel Company.
              All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setAccreditationsOpen(true)}
                className="hover:text-brand-orange flex items-center gap-1.5 transition-colors cursor-pointer text-white/80"
              >
                <ShieldCheck className="size-3.5 text-brand-orange" />
                <span>Accreditations &amp; Logos</span>
              </button>
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

      {/* Dedicated Accreditations Modal Dialog */}
      <AccreditationsModal
        isOpen={accreditationsOpen}
        onClose={() => setAccreditationsOpen(false)}
      />
    </>
  );
}
