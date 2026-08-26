import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { REGIONS } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore Dellics Travels destinations across Africa, Asia, Europe, the Middle East and North America.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        title="Destinations"
        subtitle="Five continents, one trusted travel partner."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((region) => (
          <Link
            key={region.slug}
            href={`/destinations/${region.slug}`}
            className="group relative h-72 overflow-hidden rounded-card"
          >
            {region.highlights[0] ? (
              <Image
                src={region.highlights[0].image}
                alt={region.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-display text-2xl font-semibold text-white">
                {region.name}
              </h2>
              <p className="mt-1 text-sm text-white/75">{region.tagline}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
