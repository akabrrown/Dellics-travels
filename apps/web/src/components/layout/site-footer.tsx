import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { AccreditationStrip } from "@/components/accreditation-strip";

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const QUICK_LINKS = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels & Airbnb", href: "/hotels" },
  { label: "Tours", href: "/tours" },
  { label: "Transfers", href: "/transfers" },
  { label: "Visa Assistance", href: "/visa" },
  { label: "Destinations", href: "/destinations" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <AccreditationStrip />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/logo.png" alt={`${SITE.name} logo`} width={140} height={40} className="h-9 w-auto" />
          <p className="mt-4 text-sm text-white/70">
            Your trusted travel partner — flights, hotels, tours, transfers and visa
            assistance, handled by licensed experts.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-white/70 hover:text-white">About Us</Link></li>
            <li><Link href="/credentials" className="text-white/70 hover:text-white">Credentials</Link></li>
            <li><Link href="/gallery" className="text-white/70 hover:text-white">Gallery</Link></li>
            <li><Link href="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
            <li><Link href="/inquire" className="text-white/70 hover:text-white">Inquire</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{SITE.address}</li>
            <li>{SITE.phoneDisplay}</li>
            <li>{SITE.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.{" "}
        {LEGAL.map((item, index) => (
          <span key={item.href}>
            {index > 0 && " · "}
            <Link href={item.href} className="hover:text-white">{item.label}</Link>
          </span>
        ))}
      </div>
    </footer>
  );
}
