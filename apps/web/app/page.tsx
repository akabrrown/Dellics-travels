import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Building2,
  Compass,
  Car,
  FileCheck2,
  Briefcase,
  Star,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { QuickBook } from "@/components/home/quick-book";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES, HOME_STATS, WHY_CHOOSE_US } from "@/data/home";
import { getLiveHomeDeals } from "@/lib/flights";
import { getTours } from "@/lib/tours";
import { getFeaturedReviews } from "@/lib/reviews";

const CORE_SERVICES = [
  {
    title: "Flight Ticketing",
    tag: "IATA Certified",
    copy: "Domestic & international flights across all global airlines with instant electronic ticketing, seat selection & baggage support.",
    href: "/flights",
    image: "/images/services/plane.jpg",
    icon: Plane,
    features: ["Emirates, Qatar, Delta, KLM & More", "Exclusive Competitive Fares", "24/7 Schedule Change Support"],

  },
  {
    title: "Hotels & Airbnb Stays",
    tag: "Verified Global Stays",
    copy: "Over 3.3 million verified luxury hotels, boutique apartments & beach resorts worldwide with best rate guarantee.",

    href: "/hotels",
    image: "/images/services/hotel-and-airbnb.jpg",
    icon: Building2,
    features: ["Instant Online Confirmation", "Free Cancellation Options", "Verified Guest Reviews"],
  },
  {
    title: "Tours & Holiday Packages",
    tag: "Curated Itineraries",
    copy: "Bespoke guided safaris, luxury city breaks, and cultural expeditions across Africa, Europe, Asia and the Americas.",
    href: "/tours",
    image: "/images/africa/serengeti-national-park.jpg",
    icon: Compass,
    features: ["Professional Local Guides", "All-Inclusive Options", "Custom Group & Family Dates"],
  },
  {
    title: "VIP Airport Transfers",
    tag: "Flight-Tracked Fleet",
    copy: "Punctual airport meet & greet and city transit in air-conditioned executive sedans, luxury SUVs and passenger coaches.",
    href: "/transfers",
    image: "/images/services/airport-transfer-services.jpg",
    icon: Car,
    features: ["Live Flight Delay Tracking", "Luggage Assistance", "Vetted Chauffeurs"],
  },
  {
    title: "Visa Assistance & Advisory",
    tag: "99.4% Approval",
    copy: "Comprehensive visa consultation, document preparation, appointment booking, and interview coaching for top destinations.",
    href: "/visa",
    image: "/images/services/documentation-support.jpg",
    icon: FileCheck2,
    features: ["UK, USA, Canada & Schengen", "Dubai & South Africa E-Visas", "Document Verification"],
  },
  {
    title: "Corporate Travel Solutions",
    tag: "Business Accounts",
    copy: "Streamlined corporate travel management, executive retreat logistics, monthly billing & dedicated travel managers.",
    href: "/corporate",
    image: "/images/services/corporate-travel-management.jpg",
    icon: Briefcase,
    features: ["Dedicated Account Manager", "Consolidated Monthly Invoicing", "VIP Concierge Priority"],
  },
];

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
  const [homeDealsData, popularTours, testimonials] = await Promise.all([
    getLiveHomeDeals("ACC").catch(() => null),
    getTours({ featured: true }).catch(() => []),
    getFeaturedReviews().catch(() => []),
  ]);

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
      {/* 1. Cinematic Hero Slider */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* 2. Interactive Quick Booking Search Engine */}
      <section className="relative z-30 -mt-20 sm:-mt-24 px-4 sm:px-6 lg:px-8">
        <QuickBook />
      </section>

      {/* 3. Core Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Our Expertise"
          title="World-Class Travel Services, Tailored For You"
          subtitle="Whether traveling for leisure, business, medical needs or family vacation, our licensed experts ensure unmatched comfort and peace of mind."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/70 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-brand-orange/40"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur-md shadow-sm">
                    {service.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-navy">
                      {service.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.copy}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-2">
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider hover:text-brand-orange-hover"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Verified Statistics & Trust Strip */}
      <section className="relative overflow-hidden bg-navy-dark py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {HOME_STATS.map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="font-display text-4xl sm:text-5xl font-extrabold text-brand-orange">
                  {stat.value}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Destinations Showcase */}
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
              />
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

      {/* 6. Popular Tour Packages */}
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
                    />
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

      {/* 7. Why Choose Us / Trust Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="The Dellics Standard"
          title="Why Discerning Travelers Choose Us"
          subtitle="We combine international industry accreditation with attentive personalized concierge care."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-brand-orange/30"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-sunrise-light text-brand-orange font-bold text-lg mb-4">
                0{idx + 1}
              </div>
              <h3 className="font-display text-base font-bold text-navy mb-2">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Traveler Reviews & Testimonials */}
      <section className="bg-slate-50 py-24 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Social Proof"
            title="What Our Travelers Say"
            subtitle="Read verified reviews from executives, families, and solo adventurers who booked with Dellics Travels."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((review) => (
              <div
                key={review.id || review.name}
                className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 italic">
                    &quot;{review.quote}&quot;
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="font-display text-sm font-bold text-navy">
                    {review.name}
                  </p>
                  <p className="text-xs text-brand-orange font-medium">
                    {review.destination}
                  </p>
                  <p className="text-xs text-slate-500">
                    {review.role} · {review.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


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
