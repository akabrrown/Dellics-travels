import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ContentSections } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { REGIONS, getRegion } from "@/data/destinations";

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
    title: `${data.name} Destinations`,
    description: data.tagline,
  };
}

export default async function RegionPage({ params }: RouteParams) {
  const { region } = await params;
  const data = getRegion(region);
  if (!data) notFound();

  return (
    <>
      <PageHero title={data.name} subtitle={data.tagline} />
      <ContentSections sections={[{ paragraphs: data.intro }]} />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.highlights.map((highlight) => (
            <figure
              key={highlight.name}
              className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm"
            >
              <div className="relative h-52">
                <Image
                  src={highlight.image}
                  alt={highlight.name}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-display font-semibold text-navy">
                  {highlight.name}
                </p>
                {highlight.caption ? (
                  <p className="mt-1 text-sm text-slate-body">
                    {highlight.caption}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-pill">
            <Link href="/destinations">All destinations</Link>
          </Button>
        </div>
      </section>
      <CtaBanner
        title={`Planning a trip to ${data.name}?`}
        copy="Tell us your dates and budget — we handle flights, stays and experiences."
      />
    </>
  );
}
