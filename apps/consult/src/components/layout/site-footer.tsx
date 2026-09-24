import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

const SERVICE_LINKS = [
  { label: "University Admissions", href: "/services#admissions" },
  { label: "Visa Assistance", href: "/services#visa" },
  { label: "Scholarship Guidance", href: "/services#scholarship" },
  { label: "Travel & Tour", href: "/services#travel" },
  { label: "Online Counselling", href: "/services#online" },
  { label: "Test Preparation", href: "/services#test" },
];

const DEST_LINKS = [
  { label: "Study in UK", href: "/destinations#uk" },
  { label: "Study in Canada", href: "/destinations#canada" },
  { label: "Study in USA", href: "/destinations#usa" },
  { label: "Study in Australia", href: "/destinations#australia" },
  { label: "Study in Europe", href: "/destinations#europe" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Contact Us", href: "/contact" },
  { label: "Student Portal", href: "/portal" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-navy-dark text-white pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.jpg"
                  alt="Dellics Education Consult"
                  width={120}
                  height={120}
                  className="rounded-lg object-contain bg-white p-1"
                  unoptimized
                />
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Ghana's trusted partner for international education. We turn
                study abroad aspirations into reality with end-to-end support.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400">
                    Tema Community 25, Devtraco Estate, Greater Accra, Ghana
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400">+233 55 205 4174</span>
                </div>
                <div className="flex gap-3 items-start">
                  <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400">info@dellics.com</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-6">
                Our Services
              </h4>
              <ul className="space-y-3">
                {SERVICE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-semibold text-white mb-6">
                Destinations
              </h4>
              <ul className="space-y-3">
                {DEST_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Ecosystem Crosslink */}
              <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-3">
                  Part of the Dellics Ecosystem
                </p>
                <a
                  href="https://dellicstravels.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-orange transition-colors"
                >
                  Dellics Travels <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center md:text-left">
              &copy; {currentYear} Dellics Education Consult. All Rights
              Reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/about"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/about"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
