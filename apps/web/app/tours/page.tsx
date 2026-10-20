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
    icon: Compass,
    title: "Carefully Curated Experiences",
    description: "Every tour is thoughtfully selected to combine must-see attractions with authentic experiences, culture, nature, adventure and local discovery.",
  },
  {
    icon: ShieldCheck,
    title: "Designed Around You",
    description: "Whether you’re travelling solo, as a couple, with family, friends or as a group, we offer experiences that can be tailored to your interests, pace and travel style.",
  },
  {
    icon: MapPin,
    title: "Authentic Local Experiences",
    description: "Go beyond the typical tourist itinerary and discover destinations through their culture, history, cuisine, people and unique stories.",
  },
  {
    icon: Plane,
    title: "Expertly Planned Itineraries",
    description: "From activities and sightseeing to transportation and timing, we take care of the important details so you can focus on enjoying your journey.",
  },
  {
    icon: Building2,
    title: "Trusted Local Partners",
    description: "We work with carefully selected guides, drivers, activity providers and hospitality",
  },
];

export default async function ToursPage() {
  const tours = await getTours().catch(() => []);

  return (
    <>
      <PageHero
        title="Curated Tour Packages & Day Escapes"
        subtitle="Explore More. Experience More. Travel Better. Discover carefully curated Tour Packages & Day Escapes with Dellics Travels�designed to make exploring new destinations easy, convenient and memorable."
        image="/images/africa/serengeti-national-park.jpg"
        breadcrumbs={[{ label: "Tours & Holidays" }]}
      >
        <ViatorTourSearch />
      </PageHero>

      {/* Signature Tour Packages Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">

        <SectionHeading
          eyebrow="Dellics Signature & Global Experiences"
          title="Curated Tour Packages & Day Escapes"
          subtitle="Explore More. Experience More. Travel Better.
Discover carefully curated Tour Packages & Day Escapes with Dellics Travels—designed to make exploring new destinations easy, convenient and memorable.

Book your next experience with Dellics Travels."
        />

        <TourList tours={tours} />
      </section>

      {/* Why Book Tour Packages with Dellics */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Dellics Guarantee"
            title="What Makes Our Tours Exceptional?"
            subtitle={`Travel Beyond the Ordinary. Experience More.\n\nAt Dellics Travels, we don’t just create tours—we curate memorable experiences designed around the way you want to travel.`}
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Diaspora Tours */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-navy p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden border border-navy-300/20">
          <div className="absolute inset-0 bg-brand-orange/5 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Why Book Curated Diaspora Tours with Dellics?
            </h2>
            <p className="text-brand-orange font-bold text-lg mb-6 tracking-wide">
              Reconnect. Rediscover. Remember.
            </p>
            <p className="text-slate-300 leading-relaxed sm:text-lg">
              Our Curated Diaspora Tours take you beyond traditional sightseeing into meaningful journeys of heritage, culture, history, and connection. From ancestral landmarks and cultural communities to local cuisine, traditions, and authentic encounters, every experience is thoughtfully designed to help you discover the destination—and your connection to it.
            </p>
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


