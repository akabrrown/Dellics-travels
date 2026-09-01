import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import {
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Plane,
  Building2,
  Car,
  ExternalLink,
  Compass,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { ViatorTourSearch } from "@/components/tours/viator-tour-search";
import { TourList } from "@/components/tours/tour-list";
import { SITE } from "@/lib/site";
import { getTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "International Tour Packages & Safari Holidays",
  description:
    "Book luxury guided international tours with Dellics Travels. South Africa Cape Town, Dubai, Kenya, Zanzibar, Safari Valley Ghana and more.",
};

const TOUR_PROMISES = [
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Departures",
    description: "Once your booking is confirmed, your tour is guaranteed to operate without sudden minimum-group cancellations.",
  },
  {
    icon: Plane,
    title: "All-Inclusive Flight & Visa Options",
    description: "Unlike standard tour companies, we handle your return flights, transit logistics, and visa processing directly under one booking.",
  },
  {
    icon: Building2,
    title: "Hand-Picked 4 & 5-Star Accommodations",
    description: "Every hotel and safari lodge in our packages is vetted for cleanliness, security, scenic location, and world-class hospitality.",
  },
  {
    icon: Car,
    title: "Private Executive Fleet & Local Hosts",
    description: "Enjoy private air-conditioned transport and licensed local English-speaking guides who know the culture and hidden gems intimately.",
  },
];

export default async function ToursPage() {
  const tours = await getTours().catch(() => []);

  return (
    <>
      <PageHero
        title="Curated International Tour Packages"
        subtitle="Experience world-class safari expeditions, luxury city breaks, and tropical beach retreats with all flights, stays, and transfers included."
        image="/images/africa/serengeti-national-park.jpg"
        breadcrumbs={[{ label: "Tours & Holidays" }]}
      />

      {/* Signature Tour Packages Grid & Viator Search */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <ViatorTourSearch />

        <SectionHeading
          eyebrow="Dellics Signature & Partner Experiences"
          title="Curated Tour Packages & Day Escapes"
          subtitle="Book Dellics Signature Tours directly on our website via Paystack (Mobile Money & Cards), or explore 300,000+ verified worldwide day-trips through our Viator partner integration."
        />

        <TourList tours={tours} />
      </section>

      {/* Why Book Tour Packages with Dellics */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Dellics Guarantee"
            title="What Makes Our Tours Exceptional"
            subtitle="Every detail from your first airport welcome to your return departure is managed with care."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TOUR_PROMISES.map((promise) => {
              const Icon = promise.icon;
              return (
                <div
                  key={promise.title}
                  className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    {promise.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {promise.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need a Fully Customized Tour Package?"
        copy="We build personalized private itineraries tailored to your exact dates, group size, budget and interests. Tell us your dream destination and we will handle the rest."
        label="Design My Custom Tour"
        href="/inquire"
      />
    </>
  );
}
