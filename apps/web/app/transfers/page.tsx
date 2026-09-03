import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Luggage,
  Users,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { TransferSearchWidget } from "@/components/transfers/transfer-search-widget";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Airport Transfers & Executive Transit Services",
  description:
    "Professional airport transfers in Ghana with Dellics Travels. Kotoka International Airport (ACC) meet-and-greet, luxury SUVs, sedans, and intercity transit.",
};

const FLEET = [
  {
    name: "Executive Saloon / Sedan",
    category: "Solo & Business Travel",
    passengers: "1–3 Passengers",
    luggage: "2 Standard Suitcases",
    rate: "From $35 / 450 GHS",
    image: "/images/services/airport-transfer-services.jpg",
    features: [
      "Climate-controlled air conditioning",
      "Complimentary bottled mineral water",
      "Mobile device charging ports",
      "Flight delay tracking included",
    ],
  },
  {
    name: "Luxury 4x4 SUV (Prado / Land Cruiser)",
    category: "VIP & Family Travel",
    passengers: "1–6 Passengers",
    luggage: "4 Large Suitcases",
    rate: "From $70 / 900 GHS",
    image: "/images/services/hotel-and-airbnb.jpg",
    features: [
      "Premium comfort on all road terrains",
      "Onboard high-speed 4G Wi-Fi hotspot",
      "Executive leather seating",
      "Intercity travel to Cape Coast / Kumasi",
    ],
  },
  {
    name: "VIP Executive Passenger Van",
    category: "Small Groups & Delegations",
    passengers: "7–15 Passengers",
    luggage: "10+ Large Suitcases",
    rate: "From $110 / 1,400 GHS",
    image: "/images/services/corporate-travel-management.jpg",
    features: [
      "High roof with spacious headroom",
      "Dedicated luggage trailer upon request",
      "Individual reclining cloth seats",
      "Professional uniformed chauffeur",
    ],
  },
  {
    name: "Luxury Tour Coach",
    category: "Large Groups & Corporate Retreats",
    passengers: "16–30+ Passengers",
    luggage: "30+ Suitcases in Cargo Bay",
    rate: "Custom Quote",
    image: "/images/services/kenya-safari-adventure.jpg",
    features: [
      "PA microphone audio system",
      "Under-floor luggage storage",
      "Comfortable intercity touring suspension",
      "Full day chauffeur standby options",
    ],
  },
];

const STEPS = [
  {
    step: "01",
    title: "Reserve Online",
    description: "Provide your flight number, arrival date, and drop-off destination (Hotel, Residence or Region).",
  },
  {
    step: "02",
    title: "Live Flight Tracking",
    description: "We monitor your inbound flight in real time. If your flight lands early or gets delayed, our driver adjusts automatically.",
  },
  {
    step: "03",
    title: "Arrivals Meet & Greet",
    description: "Your uniformed chauffeur waits right outside the terminal with a personalized Dellics name board to assist with luggage.",
  },
  {
    step: "04",
    title: "Relaxing Direct Transfer",
    description: "Step into a sanitized, chilled vehicle and enjoy a safe, smooth drive directly to your destination.",
  },
];

export default function TransfersPage() {
  return (
    <>
      <PageHero
        image="/images/services/airport-transfer-services.jpg"
        breadcrumbs={[{ label: "Transfers" }]}
      >
        <TransferSearchWidget />
      </PageHero>

      {/* Fleet Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Our Fleet"
          title="Executive Fleet For Every Group Size"
          subtitle="All vehicles undergo strict routine safety checks and are driven by seasoned, licensed chauffeurs."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {FLEET.map((vehicle) => (
            <div
              key={vehicle.name}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-md">
                  {vehicle.category}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-navy-dark/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {vehicle.rate}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-navy">
                  {vehicle.name}
                </h3>

                <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <Users className="size-3.5 text-brand-orange" />
                    {vehicle.passengers}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <Luggage className="size-3.5 text-brand-orange" />
                    {vehicle.luggage}
                  </span>
                </div>

                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                  {vehicle.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Clock className="size-3.5" />
                    Instant Dispatch Available
                  </span>
                  <Link
                    href={`/inquire?service=transfers&vehicle=${encodeURIComponent(vehicle.name)}&passengers=${encodeURIComponent(vehicle.passengers)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>Book Vehicle</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Smooth Process"
            title="How Airport Meet & Greet Works"
            subtitle="Zero confusion at arrivals. Your driver is waiting for you before you clear customs."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm"
              >
                <span className="font-display text-3xl font-extrabold text-brand-orange/30">
                  {step.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Arriving at Kotoka Airport Soon?"
        copy="Send us your flight number and arrival time. We'll have a driver standing by with a name board when you step out."
        label="Book Airport Pickup"
        href="/inquire"
      />
    </>
  );
}
