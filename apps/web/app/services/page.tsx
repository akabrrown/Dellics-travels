import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Building2,
  Compass,
  Car,
  FileCheck2,
  Briefcase,
  Heart,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Travel Services & Concierge Solutions",
  description:
    "Dellics Travels full service travel offerings — IATA flight ticketing, 2.5M+ hotels, international tour packages, VIP airport transfers, visa assistance, and corporate accounts.",
};

const ALL_SERVICES = [
  {
    title: "International Flight Ticketing",
    badge: "Official IATA Agency",
    icon: Plane,
    image: "/images/services/plane.jpg",
    href: "/flights",
    summary:
      "Direct GDS ticketing with all major global airlines including Emirates, Qatar Airways, Delta Air Lines, British Airways, KLM, Ethiopian Airlines, and RwandAir.",
    features: [
      "Same-day electronic ticket issuance",
      "Special wholesale group and family fares",
      "Seat selection & extra baggage allowance concierge",
      "24/7 schedule rebooking & flight disruption support",
    ],
  },
  {
    title: "Hotels & Airbnb Stays Worldwide",
    badge: "RateHawk Live Network",
    icon: Building2,
    image: "/images/services/hotel-and-airbnb.jpg",
    href: "/hotels",
    summary:
      "Over 2.5 million verified luxury hotels, boutique serviced apartments, beach resorts, and private villas across 190+ countries with best rate guarantee.",
    features: [
      "Zero hidden resort fees or unexpected city taxes",
      "Verified guest reviews and pre-screened cleanliness",
      "Instant server-side booking confirmation",
      "Flexible cancellation and date modification options",
    ],
  },
  {
    title: "Curated International Tour Packages",
    badge: "Handcrafted Itineraries",
    icon: Compass,
    image: "/images/africa/serengeti-national-park.jpg",
    href: "/tours",
    summary:
      "Signature guided safari holidays, romantic escapes, cultural heritage expeditions, and shopping breaks across Africa, Europe, the Middle East, and Asia.",
    features: [
      "Guaranteed departures with certified local guides",
      "All-inclusive packages (flights, stays, tours & transfers)",
      "Cape Town, Safari Valley, Dubai, Zanzibar, Kenya & Paris",
      "Custom private group & corporate retreat itineraries",
    ],
  },
  {
    title: "VIP Airport Transfers & Fleet Hire",
    badge: "Flight-Tracked Fleet",
    icon: Car,
    image: "/images/services/airport-transfer-services.jpg",
    href: "/transfers",
    summary:
      "Punctual, stress-free meet-and-greet airport pickups at Kotoka International Airport (ACC) and executive intercity transit throughout Ghana.",
    features: [
      "Real-time flight delay tracking & automatic adjustment",
      "Executive sedans, luxury 4x4 SUVs, and VIP mini coaches",
      "Sanitized, chilled AC vehicles with bottled water & Wi-Fi",
      "Fixed upfront transparent rates without hidden fees",
    ],
  },
  {
    title: "Visa Assistance & Advisory",
    badge: "99.4% Approval Record",
    icon: FileCheck2,
    image: "/images/services/documentation-support.jpg",
    href: "/visa",
    summary:
      "Professional visa document curation, financial profile assessment, embassy appointment booking, and mock consular interview coaching.",
    features: [
      "UK, USA B1/B2, Canada TRV & Schengen short-stay visas",
      "Dubai 30/60 days & South Africa electronic visas",
      "Thorough financial & employment paperwork audit",
      "Ethical, compliant, and transparent legal advisory",
    ],
  },
  {
    title: "Corporate Travel Management",
    badge: "Enterprise Business Accounts",
    icon: Briefcase,
    image: "/images/services/corporate-travel-management.jpg",
    href: "/corporate",
    summary:
      "Comprehensive business travel solutions for Ghanaian enterprises, multinational corporations, diplomatic missions, and NGOs.",
    features: [
      "Dedicated corporate travel account manager 24/7",
      "Consolidated monthly invoicing & transparent reporting",
      "Strict corporate travel budget and policy enforcement",
      "Trade mission & multi-city conference group logistics",
    ],
  },
  {
    title: "Diaspora Homecoming & Heritage Tourism",
    badge: "Beyond The Return Partner",
    icon: Heart,
    image: "/images/africa/cape-coast-castle.jpg",
    href: "/diaspora",
    summary:
      "Deeply meaningful, transformative ancestral pilgrimages designed for the African diaspora to reconnect with their roots, history, and people in Ghana.",
    features: [
      "Cape Coast & Elmina Castle Door of Return pilgrimage",
      "Assin Manso Slave River sacred bath & memorial",
      "Authentic traditional naming ceremony by village chiefs",
      "Ashanti Kingdom, Bonwire Kente weaving & cultural stays",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Comprehensive World-Class Travel Services"
        subtitle="One accredited partner for every travel need — flights, luxury stays, guided safaris, airport chauffeurs, visas, and corporate management."
        badge="Accredited Travel Solutions"
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Services" }]}
      />

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Our Expertise"
          title="Engineered For Comfort & Complete Reliability"
          subtitle="Explore our specialized travel verticals designed to deliver unmatched value and peace of mind."
        />

        <div className="mt-14 space-y-12">
          {ALL_SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={srv.title}
                className={`flex flex-col lg:flex-row gap-8 items-center rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Section */}
                <div className="relative h-64 lg:h-80 w-full lg:w-1/2 overflow-hidden rounded-2xl bg-slate-100 shrink-0">
                  <Image
                    src={srv.image}
                    alt={srv.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3.5 py-1 text-xs font-bold text-white shadow-md">
                    {srv.badge}
                  </span>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-navy">
                        {srv.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {srv.summary}
                    </p>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
                        Key Service Features:
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-700">
                        {srv.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                    <Button asChild className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold">
                      <Link href={srv.href} className="flex items-center gap-2">
                        <span>Learn More</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Link
                      href={`/inquire?service=${encodeURIComponent(srv.title.toLowerCase().replace(/\s+/g, "_"))}&title=${encodeURIComponent(srv.title)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-navy transition-colors"
                    >
                      <span>Request Custom Quote</span>
                      <ArrowRight className="size-3.5 text-brand-orange" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBanner
        title="Need a Combination of Multiple Services?"
        copy="Our travel specialists can bundle your international flights, luxury hotel stays, guided day tours, airport chauffeur pickups, and visa consultation under one unified quote."
        label="Request Multi-Service Package"
        href="/inquire"
      />
    </>
  );
}
