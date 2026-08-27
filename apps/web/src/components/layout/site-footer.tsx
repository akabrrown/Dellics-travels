import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { AccreditationStrip } from "@/components/accreditation-strip";

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Admin Portal", href: "/admin" },
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
  return (
    <footer className="bg-navy-dark text-white">
      {/* Accreditation Banner */}
      <AccreditationStrip />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-5 md:grid-cols-2">
          {/* Column 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-48">
                <Image
                  src="/logo.png"
                  alt={`${SITE.name} logo`}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/75 max-w-md">
              Dellics Travels & Tours is an IATA Certified luxury travel management agency. We organize international flight tickets, corporate itineraries, visa advisory, and curated vacation packages across 5 continents.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-white/80">
                <MapPin className="size-5 text-brand-orange shrink-0 mt-0.5" />
                <span>{SITE.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="size-5 text-brand-orange shrink-0" />
                <a href={`tel:${SITE.whatsappNumber}`} className="hover:text-brand-orange transition-colors">
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="size-5 text-brand-orange shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-brand-orange transition-colors">
                  {SITE.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Clock className="size-5 text-brand-orange shrink-0" />
                <span>Mon – Fri: 8:00 AM – 6:00 PM · 24/7 Emergency Support</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-orange mb-4">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-brand-orange hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                  >
                    <ArrowRight className="size-3 text-brand-orange/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-orange mb-4">
              Destinations
            </h3>
            <ul className="space-y-2.5 text-sm">
              {DESTINATIONS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-brand-orange hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                  >
                    <ArrowRight className="size-3 text-brand-orange/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: About, Gallery, Contact & WhatsApp */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-orange mb-4">
              Explore & Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-brand-orange hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                  >
                    <ArrowRight className="size-3 text-brand-orange/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* WhatsApp Us Action Box */}
            <div className="mt-6 rounded-2xl bg-emerald-950/60 p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <MessageCircle className="size-3.5" />
                <span>WhatsApp Us (24/7)</span>
              </div>
              <p className="text-xs text-white/75 mb-3 leading-relaxed">
                Connect directly with certified travel experts on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I would like to inquire about your travel services.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-lg transition-colors"
              >
                <PhoneCall className="size-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-white/10 bg-black/20 py-6 text-center text-xs text-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {LEGAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-brand-orange transition-colors"
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
