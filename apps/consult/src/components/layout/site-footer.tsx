import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

const OUR_SERVICES = [
  { label: "University Admissions", href: "/services/admissions" },
  { label: "Visa Assistance", href: "/services/visa" },
  { label: "Scholarship Guidance", href: "/services/scholarship" },
  { label: "Online Counselling", href: "/services/online" },
  { label: "Test Preparation", href: "/services/test" },
];

const STUDY_DESTINATIONS = [
  { label: "United Kingdom", href: "/destinations/uk" },
  { label: "Canada", href: "/destinations/canada" },
  { label: "United States", href: "/destinations/usa" },
  { label: "Australia", href: "/destinations/australia" },
  { label: "Europe", href: "/destinations#europe" },
];

const EXPLORE_DELLICS = [
  { label: "About Us", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Student Portal", href: "/portal" },
  { label: "Contact Us", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "FAQs & Knowledgebase", href: "/#faq" },
  { label: "WhatsApp Concierge", href: "https://wa.me/233552054174" },
  { label: "Help Centre", href: "/contact" },
  { label: "Contact Support", href: "/contact" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
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
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Ghana’s trusted partner for international education. We turn
              study abroad aspirations into reality with end-to-end support.
            </p>
            <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <span>Tema Community 25, Devtraco Estate, Greater Accra, Ghana</span>
            </div>

            {/* Ecosystem Crosslink */}
            <div className="pt-2">
              <a
                href="https://dellicstravels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-brand-orange transition-colors"
              >
                Part of Dellics Travels <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 1: Our Services */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {OUR_SERVICES.map((link) => (
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

          {/* Column 2: Study Destinations */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Study Destinations
            </h4>
            <ul className="space-y-3">
              {STUDY_DESTINATIONS.map((link) => (
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

          {/* Column 3: Explore Dellics */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Explore Dellics
            </h4>
            <ul className="space-y-3">
              {EXPLORE_DELLICS.map((link) => (
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

          {/* Column 4: Support */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Privacy, Cookie Policy, Terms of Service */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {currentYear} Dellics Education Consult. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-slate-400 hover:text-brand-orange transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-slate-400 hover:text-brand-orange transition-colors font-semibold"
            >
              COOKIE POLICY
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-400 hover:text-brand-orange transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


