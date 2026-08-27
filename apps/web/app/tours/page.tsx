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
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
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
        badge="Tailor-Made Itineraries"
        image="/images/africa/serengeti-national-park.jpg"
        breadcrumbs={[{ label: "Tours & Holidays" }]}
      />

      {/* Signature Tour Packages Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Curated Experiences"
          title="Explore Our Signature Tour Packages"
          subtitle="Every tour is designed to give you an authentic, meaningful and hassle-free vacation with all logistics handled."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {tours.map((tour) => (
            <article
              key={tour.name}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3.5 py-1 text-xs font-bold text-white shadow-md">
                  {tour.badge}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-navy-dark/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {tour.duration}
                </span>
                <div className="absolute left-4 bottom-3 flex items-center gap-1 text-xs text-white/90 font-medium">
                  <MapPin className="size-3.5 text-brand-orange" />
                  <span>{tour.destination}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-navy">
                  {tour.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {tour.copy}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
                    Package Inclusions:
                  </p>
                  <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-slate-700">
                    {tour.includes.map((include) => (
                      <li key={include} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{include}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <span className="block text-[11px] text-slate-500 uppercase tracking-wider">Starting From</span>
                    <span className="font-display text-2xl font-extrabold text-brand-orange">{tour.price}</span>
                    <span className="text-xs text-slate-500 font-normal"> / person</span>
                  </div>

                  <Link
                    href={`/inquire?service=tours&tour=${encodeURIComponent(tour.name)}&destination=${encodeURIComponent(tour.destination)}&price=${encodeURIComponent(tour.price)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-2.5 text-sm shadow-md transition-all"
                  >
                    <span>Inquire Package</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
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
