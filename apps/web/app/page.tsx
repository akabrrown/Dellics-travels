import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { QuickBook } from "@/components/home/quick-book";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { TrustSection } from "@/components/home/trust-section";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/data/home";
import { getLiveHomeDeals } from "@/lib/flights";
import { getTours } from "@/lib/tours";
import { getFeaturedReviews } from "@/lib/reviews";

const DEFAULT_DESTINATIONS = [
  {
    name: "Dubai & Middle East",
    country: "United Arab Emirates",
    tag: "Luxury & Shopping",
    image: "/images/middle-east/burj-khalifa.jpg",
    href: "/destinations/middle-east",
    price: "From $1,650",
    iata: "DXB",
    highlights: ["Burj Khalifa", "Desert Safari", "Marina Yacht Cruise"],
  },
  {
    name: "Cape Town & South Africa",
    country: "South Africa",
    tag: "Scenic & Adventure",
    image: "/images/africa/cape-town-and-table-mountain.jpg",
    href: "/destinations/africa",
    price: "From $1,450",
    iata: "CPT",
    highlights: ["Table Mountain", "Cape Point", "Kruger Safari"],
  },
  {
    name: "Zanzibar & Tanzania",
    country: "Tanzania",
    tag: "Tropical Beaches",
    image: "/images/africa/serengeti-national-park.jpg",
    href: "/destinations/africa",
    price: "From $1,850",
    iata: "ZNZ",
    highlights: ["Nungwi Beach", "Stone Town", "Spice Plantation"],
  },
  {
    name: "Paris & Western Europe",
    country: "France & Italy",
    tag: "Culture & Romance",
    image: "/images/europe/paris-and-eiffel-tower.jpg",
    href: "/destinations/europe",
    price: "From $2,200",
    iata: "CDG",
    highlights: ["Eiffel Tower", "Amalfi Coast", "Louvre Museum"],
  },
];

export default async function HomePage() {
    // Hardcode testimonials to empty to forcefully hide dummy reviews
  let [homeDealsData, popularTours, testimonials] = await Promise.all([
    getLiveHomeDeals("ACC").catch(() => null),
    getTours({ featured: true }).catch(() => []),
        getFeaturedReviews().catch(() => []),
  ]);
  
  testimonials = []; // Force hide reviews

  // Enrich featured destinations with live lowest fares if available
  const trendingMap = new Map(
    homeDealsData?.trending?.map((t) => [t.iata?.toUpperCase(), t.price]) || [],
  );

  const featuredDestinations = DEFAULT_DESTINATIONS.map((dest) => {
    const liveFare = trendingMap.get(dest.iata);
    return {
      ...dest,
      price: liveFare ? `Fares ${liveFare}` : dest.price,
    };
  });

  return (
    <>
      {/* 1. Cinematic Hero Slider with Transparent Booking Engine */}
      <HeroSlider slides={HERO_SLIDES}>
        <div className="w-full flex flex-col items-center text-center">
          <div className="mb-3 sm:mb-5 max-w-3xl">
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              Explore The World With Confidence
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-white/90 max-w-xl mx-auto font-light drop-shadow">
              Flights for Every Budget. Hotels for Every Journey. Experiences Worth Remembering.
            </p>
          </div>
          <QuickBook />
        </div>
      </HeroSlider>

            {/* 5. Featured Destinations Showcase */}
      {featuredDestinations.length > 0 && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <SectionHeading
            align="left"
            eyebrow="Global Destinations"
            title="Explore The World's Most Iconic Places"
            subtitle="From the golden dunes of Dubai to the scenic coastline of Cape Town and romantic European capitals."
          />
          <Button asChild className="rounded-full bg-navy hover:bg-navy-light text-white shrink-0">
            <Link href="/destinations" className="flex items-center gap-2">
              <span>View All 40+ Destinations</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={dest.href}
              className="group relative h-96 overflow-hidden rounded-3xl shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0060]/85 via-[#0A0060]/20 to-transparent" />

              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur-md">
                {dest.tag}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                  {dest.country}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold">
                  {dest.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {dest.highlights.map((h) => (
                    <span key={h} className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm">
                      {h}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs">
                  <span className="font-medium text-white/80">Packages</span>
                  <span className="font-bold text-brand-orange">{dest.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* 6. Popular Tour Packages */}
      {popularTours.length > 0 && (
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Curated Holidays"
            title="Handcrafted International Tour Packages"
            subtitle="All packages include return flights, luxury stays, guided city sightseeing, airport transfers, and visa advisory."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {popularTours.slice(0, 3).map((tour) => {
              const features = tour.includes || (tour as any).features || [];
              const inquireLink = `/inquire?service=tours&package=${encodeURIComponent(tour.name)}&price=${encodeURIComponent(tour.price)}`;
              return (
                <div
                  key={tour.id || tour.name}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-md">
                      {tour.badge}
                    </span>
                    <span className="absolute right-4 top-4 rounded-full bg-navy-dark/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {tour.duration}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-navy">
                      {tour.name}
                    </h3>

                    <ul className="mt-4 space-y-2 text-xs text-slate-600">
                      {features.slice(0, 4).map((feat: string) => (
                        <li key={feat} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <span className="block text-[11px] text-slate-500 uppercase tracking-wider">Per Person</span>
                        <span className="font-display text-xl font-bold text-brand-orange">{tour.price}</span>
                      </div>
                      <Button asChild size="sm" className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold">
                        <Link href={inquireLink}>Book Tour</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full bg-navy hover:bg-navy-light text-white font-bold px-8">
              <Link href="/tours">Browse All 8+ Tour Itineraries</Link>
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* 7. Trust & Reliability */}
      <TrustSection />

      {/* 8. Traveler Reviews & Testimonials */}
      <section className="bg-slate-50 py-24 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Social Proof"
            title="What Our Travelers Say"
            subtitle="Read verified reviews from executives, families, and solo adventurers who booked with Dellics Travels."
          />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 pb-8 border-b border-slate-200/60 max-w-4xl mx-auto">

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-white shadow-sm border border-slate-100 font-bold text-xl text-blue-600">G</div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 leading-tight">Google</span>
                <div className="flex text-amber-400 text-sm tracking-widest">
                  ★★★★★
                </div>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-300 hidden sm:block"></div>
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-bold text-slate-800 leading-tight">Excellent 4.9 out of 5</span>
              <span className="text-sm text-slate-500">Based on 250+ verified reviews</span>
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((review) => (
              <div
                key={review.id || review.name}
                className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const r = Number(review.rating) || 5;
                        const starColor = 'text-amber-400';
                        if (r >= starIndex) {
                          return <Star key={starIndex} className={`size-4 fill-current ${starColor}`} />;
                        } else if (r >= starIndex - 0.5) {
                          return (
                            <span key={starIndex} className="relative inline-block size-4">
                              <Star className="absolute inset-0 size-4 text-slate-200 fill-slate-200" />
                              <span className="absolute inset-0 w-1/2 overflow-hidden">
                                <Star className={`size-4 fill-current ${starColor}`} />
                              </span>
                            </span>
                          );
                        } else {
                          return <Star key={starIndex} className="size-4 text-slate-200 fill-slate-200" />;
                        }
                      })}
                    </div>
                    <span className="text-xs font-bold text-slate-700 ml-1 font-mono">
                      {(Number(review.rating) || 5).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 italic">
                    &quot;{review.quote}&quot;
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-end justify-between">
                  <div>
                    <p className="font-display text-sm font-bold text-navy">
                      {review.name}
                    </p>
                    <p className="text-xs text-brand-orange font-medium mt-0.5">
                      {review.destination}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.role} · {review.location}
                    </p>
                  </div>

                  {review.source === 'GOOGLE' && (
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-slate-700 text-[11px] font-bold px-2 py-0.5 border border-slate-200 rounded-sm flex items-center gap-1 bg-white shadow-sm">
                        <span className="text-blue-600 font-extrabold text-[12px]">G</span> Google
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><CheckCircle2 className="size-3 text-blue-500" /> Verified</span>
                    </div>
                  )}
                  {(!review.source || review.source === 'INTERNAL') && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><CheckCircle2 className="size-3 text-brand-orange" /> Verified Booking</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      )}

      {/* 9. Full Width CTA Banner */}
      <CtaBanner
        title="Ready To Plan Your Next Trip?"
        copy="Talk to a certified travel consultant today. We provide transparent quotes, same-day electronic flight tickets, and customized itineraries."
        label="Start Your Free Consultation"
        href="/inquire"
      />
    </>
  );
}




