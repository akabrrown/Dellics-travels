import type { Metadata } from "next/types";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { AccreditationStrip } from "@/components/accreditation-strip";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Industry Credentials, Licenses & Global Accreditations",
  description:
    "Dellics Travels accreditations: IATA Agent #5921820, Ghana Tourism Authority (GTA), RateHawk, Amadeus, Travelport, TOUGHA, Airalo, and Paystack secured.",
};

const CREDENTIALS = [
  {
    badge: "Official IATA Agency",
    name: "IATA Accredited",
    id: "Agent Code #5921820",
    logo: "/badges/iata.png",
    copy: "Globally recognized International Air Transport Association accreditation. Enables direct issuance of electronic tickets on all world scheduled airlines.",
    guarantee: "100% genuine GDS tickets issued without third-party brokers.",
  },
  {
    badge: "Government Regulatory License",
    name: "Ghana Tourism Authority (GTA)",
    id: "Licensed Travel Operator",
    logo: "/badges/gta.png",
    copy: "Officially certified and licensed by the Ministry of Tourism, Arts and Culture / Ghana Tourism Authority for inbound and outbound travel operations.",
    guarantee: "Complies with all statutory consumer protection laws in Ghana.",
  },
  {
    badge: "Industry Union Membership",
    name: "TOUGHA (Tour Operators Union of Ghana)",
    id: "Active Member",
    logo: "/badges/tougha.jpg",
    copy: "Proud member of the Tour Operators Union of Ghana, upholding strict ethical guidelines and highest standards of tour operation.",
    guarantee: "Vetted tour quality and professional code of conduct.",
  },
  {
    badge: "Global Inventory Partner",
    name: "RateHawk",
    id: "Direct API Partner",
    logo: "/badges/rate-hawk.png",
    copy: "B2B partnership providing instant booking access to over 2.5 million verified hotels, luxury apartments, and boutique stays across 190+ countries.",
    guarantee: "Wholesale room rates with verified instant confirmation.",
  },
  {
    badge: "Global Distribution System",
    name: "Amadeus IT Group",
    id: "Certified Ticketing",
    logo: "/badges/amadeus.png",
    copy: "Global travel technology platform providing live seat inventory, real-time schedule tracking, and automated airline fare calculations.",
    guarantee: "Real-time seat availability across 500+ global carriers.",
  },
  {
    badge: "GDS Travel Network",
    name: "Travelport",
    id: "Distribution Partner",
    logo: "/badges/travelport.jpg",
    copy: "Leading distribution system powering direct multi-leg flight ticketing, hotel reservations, and ancillary airline baggage add-ons.",
    guarantee: "Unrestricted access to regional African and transatlantic routes.",
  },
  {
    badge: "Experiences Platform",
    name: "Viator Travel Agents",
    id: "Official Partner",
    logo: "/badges/viator.png",
    copy: "World leader in curated destination excursions, museum fast-track tickets, and private guided excursions in over 2,500 cities.",
    guarantee: "Pre-screened English-speaking local tour guides.",
  },
  {
    badge: "Group Tour Management",
    name: "WeTravel",
    id: "Group Logistics",
    logo: "/badges/wetravel.png",
    copy: "Specialized group retreat logistics and payment management platform for family delegations and corporate retreats.",
    guarantee: "Flexible split payments for group tour members.",
  },
  {
    badge: "Global Connectivity",
    name: "Airalo eSIM",
    id: "Authorized Partner",
    logo: "/badges/airalo.jpg",
    copy: "Global digital eSIM provider ensuring Dellics travelers enjoy affordable, high-speed mobile internet immediately upon landing in 200+ countries.",
    guarantee: "Instant data activation without changing physical SIM cards.",
  },
  {
    badge: "Secured Payment Infrastructure",
    name: "Paystack Payments",
    id: "PCI-DSS Level 1",
    logo: "/badges/pay-stack.png",
    copy: "Secured payment gateway enabling convenient checkout via MTN Mobile Money, Telecel Cash, Visa, Mastercard, and international bank cards.",
    guarantee: "End-to-end 256-bit encrypted checkout with instant receipts.",
  },
];

export default function CredentialsPage() {
  return (
    <>
      <PageHero
        title="Licenses, Accreditations & Global Partnerships"
        subtitle="Dellics Travels is fully accredited and legally licensed by national and international aviation authorities, ensuring complete financial security and peace of mind."
        badge="IATA #5921820 · GTA Licensed"
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Credentials" }]}
      />

      {/* Credential Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Our Credentials"
          title="Verified Institutional Trust & Industry Partnerships"
          subtitle="We maintain direct technological integrations with the world's most prestigious travel networks."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CREDENTIALS.map((cred) => (
            <div
              key={cred.name}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-orange/30"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="relative h-12 w-28 overflow-hidden rounded-xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center">
                    <Image
                      src={cred.logo}
                      alt={cred.name}
                      width={100}
                      height={40}
                      className="max-h-8 max-w-full object-contain"
                    />
                  </div>
                  <span className="rounded-full bg-navy/5 px-3 py-1 text-[11px] font-bold text-navy">
                    {cred.badge}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-navy">
                  {cred.name}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-brand-orange">
                  {cred.id}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {cred.copy}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-[11px] font-medium text-emerald-700 flex items-start gap-1.5 bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-200/60">
                  <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                  <span>{cred.guarantee}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Partner Accreditation Strip */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/70">
        <AccreditationStrip />
      </section>

      <CtaBanner
        title="Ready to Plan Your Next Trip with a Licensed Partner?"
        copy="Work with a team backed by official IATA and GTA credentials. We guarantee transparent pricing and dependable on-ground service."
        label="Start Your Travel Plan"
        href="/inquire"
      />
    </>
  );
}
