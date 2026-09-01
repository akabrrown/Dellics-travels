import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { REGIONS, getRegion } from "@/data/destinations";
import { SITE } from "@/lib/site";

interface RouteParams {
  params: Promise<{ region: string }>;
}

export function generateStaticParams() {
  return REGIONS.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { region } = await params;
  const data = getRegion(region);
  if (!data) return {};
  return {
    title: `${data.name} Luxury Travel Destinations & Holidays`,
    description: `${data.tagline}. Discover landmarks, flights, luxury stays, and curated tour itineraries with Dellics Travels.`,
  };
}

export default async function RegionPage({ params }: RouteParams) {
  const { region } = await params;
  const data = getRegion(region);
  if (!data) notFound();

  const heroImage = data.highlights[0]?.image ?? "/images/services/plane.jpg";

  return (
    <>
      <PageHero
        title={`${data.name} Travel & Holiday Experiences`}
        subtitle={data.tagline}
        image={heroImage}
        breadcrumbs={[
          { label: "Destinations", href: "/destinations" },
          { label: data.name },
        ]}
      />

      {/* Regional Introduction & Travel Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-sm">
          <SectionHeading
            align="left"
            eyebrow={`Experience ${data.name}`}
            title={`Discover The Magic of ${data.name}`}
            subtitle="From legendary UNESCO World Heritage sites to vibrant culinary scenes and luxury resorts."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.intro.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange mt-0.5">
                  <CheckCircle2 className="size-4" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landmarks & Highlights Catalog */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <SectionHeading
            align="left"
            eyebrow="Iconic Places"
            title={`Must-Visit Landmarks in ${data.name}`}
            subtitle={`Explore our top-rated guided destinations and attractions across ${data.name}.`}
          />
          <Button asChild variant="outline" className="rounded-full shrink-0">
            <Link href="/destinations" className="flex items-center gap-2">
              <span>All Continents</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.highlights.map((highlight) => (
            <article
              key={highlight.name}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={highlight.image}
                  alt={highlight.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur-md shadow-sm">
                  {data.name}
                </span>
                <span className="absolute left-4 bottom-3 text-sm font-bold text-white flex items-center gap-1">
                  <MapPin className="size-3.5 text-brand-orange" />
                  {highlight.name}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-navy">
                    {highlight.name}
                  </h3>
                  {highlight.caption ? (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {highlight.caption}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Custom Itinerary Available
                  </span>
                  <Link
                    href={`/inquire?service=destination&destination=${encodeURIComponent(highlight.name)}&region=${encodeURIComponent(data.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>Inquire Place</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        title={`Ready to Experience ${data.name}?`}
        copy={`Our destination specialists build custom itineraries with return flights, luxury stays, and private transfers across ${data.name}.`}
        label={`Plan My ${data.name} Trip`}
        href="/inquire"
      />
    </>
  );
}
