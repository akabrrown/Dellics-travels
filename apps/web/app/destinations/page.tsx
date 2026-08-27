import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  Globe2,
  ArrowRight,
  Plane,
  Building2,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { REGIONS } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Global Travel Destinations across 5 Continents",
  description:
    "Explore Dellics Travels curated destinations across Africa, Asia, Europe, Middle East and North America. Custom holiday itineraries and flights.",
};

const REGION_META: Record<string, { destinations: string; startingPrice: string; cities: string[] }> = {
  africa: {
    destinations: "12+ Iconic Parks & Coastlines",
    startingPrice: "From $1,450",
    cities: ["Cape Town", "Zanzibar", "Nairobi", "Accra", "Serengeti"],
  },
  asia: {
    destinations: "8+ Tropical & Modern Cities",
    startingPrice: "From $1,950",
    cities: ["Singapore", "Bali", "Kuala Lumpur", "Penang", "Sentosa"],
  },
  europe: {
    destinations: "15+ Cultural & Historic Capitals",
    startingPrice: "From $2,200",
    cities: ["Paris", "Rome", "Venice", "Berlin", "Amalfi Coast"],
  },
  "middle-east": {
    destinations: "6+ Luxury & Desert Escapes",
    startingPrice: "From $1,650",
    cities: ["Dubai", "Abu Dhabi", "Palm Jumeirah", "Desert Dunes"],
  },
  "north-america": {
    destinations: "10+ Grand Cities & Wilderness",
    startingPrice: "From $2,600",
    cities: ["New York", "Toronto", "Los Angeles", "Banff", "Miami"],
  },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        title="Global Destinations Across Five Continents"
        subtitle="Where do you dream of going next? Discover our handpicked luxury holiday itineraries, flight routes, and local guided experiences."
        badge="40+ World-Class Destinations"
        image="/images/africa/cape-town-and-table-mountain.jpg"
        breadcrumbs={[{ label: "Destinations" }]}
      />

      {/* Continents Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Explore Continents"
          title="Select Your Region of Wonder"
          subtitle="Click on any continent to explore famous landmarks, photo galleries, flight routes, and bespoke travel packages."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((region) => {
            const meta = REGION_META[region.slug] ?? {
              destinations: "Multiple Locations",
              startingPrice: "Inquire for Rates",
              cities: [],
            };
            const heroImage = region.highlights[0]?.image ?? "/images/services/plane.jpg";

            return (
              <Link
                key={region.slug}
                href={`/destinations/${region.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={heroImage}
                    alt={region.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0060]/80 via-[#0A0060]/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur-md">
                    {meta.destinations}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-extrabold text-white shadow-sm">
                    {meta.startingPrice}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h2 className="font-display text-2xl font-bold">
                      {region.name}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-xs text-white/80">
                      {region.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-navy mb-2">
                      Featured Places:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {meta.cities.map((city) => (
                        <span
                          key={city}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-orange">
                    <span>Explore {region.name} Highlights</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dellics Destination Promise */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Dellics Difference"
            title="Why Explore The World With Us"
            subtitle="Local knowledge on a global scale. We guarantee smooth logistics in every timezone."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                <Globe2 className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy mb-2">
                Certified Local Guides
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                Skip standard tourist traps. We partner with licensed, English-speaking local guides who share rich historical insights and hidden gems.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                <Plane className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy mb-2">
                End-to-End Flight & Stays
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                We coordinate multi-leg airline routes, private airport transfers, and 4/5-star accommodation bookings under one single booking reference.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                <Building2 className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy mb-2">
                Emergency On-Ground Help
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                Travel with peace of mind. Our 24/7 emergency concierge helpline is reachable worldwide on WhatsApp throughout your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Can't Decide on Your Next Vacation?"
        copy="Tell our senior travel designers what kind of holiday you love (beach relaxation, wildlife safari, cultural history or shopping) and let us surprise you."
        label="Get Travel Recommendations"
        href="/inquire"
      />
    </>
  );
}
