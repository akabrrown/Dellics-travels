import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Tours & Packages",
  description:
    "Book international tours with Dellics Travels. South Africa Cape Town, Dubai, Kenya, Zanzibar, Safari Valley Ghana and more. Expert guides. Affordable prices.",
};

const TOURS = [
  {
    name: "5 Nights in Cape Town, South Africa",
    price: "$1,899",
    duration: "6 Days",
    badge: "Most Popular",
    image: "/images/africa/cape-town-and-table-mountain.jpg",
    copy: "Discover the Mother City — Where Adventure Meets Luxury! From majestic mountains and pristine beaches to wildlife encounters, world-class shopping, and vibrant culture.",
    includes: [
      "Table Mountain Cableway",
      "Cape Point Tour",
      "Penguin Colony",
      "V&A Waterfront",
      "Luxury Accommodation",
      "Daily Breakfast",
    ],
  },
  {
    name: "Day Trip to Safari Valley",
    price: "$150",
    duration: "1 Day",
    badge: "Best Value",
    image: "/images/services/day-tip-to-safari-valley.jpg",
    copy: "SAFARI VALLEY ECO RESORT — FULL DAY ESCAPE. Experience Nature. Embrace Luxury. Create Unforgettable Memories. Ghana's premier luxury nature retreat.",
    includes: [
      "Resort Entrance Fee",
      "Buffet Lunch",
      "Swimming Pool Access",
      "Kayaking",
      "Professional Guide",
      "Transportation",
    ],
  },
  {
    name: "Winter Dubai",
    price: "$1,890",
    duration: "5 Days",
    badge: "Luxury",
    image: "/images/services/winter-dubai.jpg",
    copy: "Experience Dubai's luxury this March! Our 7-night package includes Emirates flights, guided shopping tours, daily breakfasts, hotel accommodation, airport transfers, visa, and tourism tax.",
    includes: [
      "Emirates Flights",
      "Guided Shopping Tours",
      "Daily Breakfast",
      "Hotel Accommodation",
      "Airport Transfers",
      "Visa & Tourism Tax",
    ],
  },
  {
    name: "Feel South Africa",
    price: "$1,450",
    duration: "5 Days",
    badge: "Adventure",
    image: "/images/services/south-africa.jpg",
    copy: "Explore the Beauty of South Africa! Whether you're looking for a wildlife safari, stunning beaches, or vibrant city life, our South Africa Tour Package has it all.",
    includes: [
      "Return Flight to Joburg",
      "Guided Daily Breakfast",
      "Return Airport Transfer",
      "4 Night Hotel Accommodation",
      "24/7 Travel Assistance",
    ],
  },
  {
    name: "Dubai Nairobi Mix",
    price: "$1,750",
    duration: "10 Days",
    badge: "Dual City",
    image: "/images/services/kenya-fun.jpg",
    copy: "The Ultimate Dual-City Adventure! Experience the perfect blend of modern luxury and African adventure with our Dubai & Nairobi Mix package!",
    includes: [
      "Round-trip Flights",
      "Airport Transfers",
      "Top-rated Hotels",
      "Daily Breakfast",
      "Guided Tours",
      "24/7 Travel Assistance",
    ],
  },
  {
    name: "Summer In Dubai",
    price: "$1,790",
    duration: "5 Days",
    badge: "Summer Special",
    image: "/images/services/dubai-fun.jpg",
    copy: "Summer in Dubai — The Ultimate Luxury Escape! From breathtaking skyscrapers to thrilling desert adventures, Dubai offers the perfect blend of luxury, adventure, and relaxation.",
    includes: [
      "Emirates Flight",
      "Tourism Guided Shopping",
      "Airport Transfer",
      "Hotel Accommodation",
      "City Tours",
      "Desert Safari",
    ],
  },
  {
    name: "Dubai Tour",
    price: "$1,650",
    duration: "6 Days",
    badge: "City Tour",
    image: "/images/services/dubai-tours.jpg",
    copy: "Experience the magic of Dubai with our comprehensive tour package. Visit iconic landmarks, enjoy shopping, and experience the best of Arabian hospitality.",
    includes: [
      "Flights",
      "Hotel Accommodation",
      "City Tours",
      "Shopping Tours",
      "Airport Transfers",
    ],
  },
  {
    name: "Zanzibar/Tanzania Tour",
    price: "$1,850",
    duration: "5 Days",
    badge: "Beach Paradise",
    image: "/images/services/zanzibar-beach-fun.jpg",
    copy: "Experience the magic of Zanzibar with pristine beaches, crystal clear waters, and rich cultural heritage. A perfect tropical getaway.",
    includes: [
      "Beach Resort",
      "Snorkeling",
      "Spice Tour",
      "Stone Town Tour",
      "Airport Transfers",
      "Meals",
    ],
  },
];

export default function ToursPage() {
  return (
    <>
      <PageHero
        title="International Tour Packages"
        subtitle="Expert-guided tours across Africa and beyond."
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Curated Experiences"
          title="Our Tour Packages"
          subtitle="Every tour is carefully crafted by our local experts to give you an authentic, meaningful and unforgettable international experience"
        />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {TOURS.map((tour) => (
            <article
              key={tour.name}
              className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative h-56">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-pill bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  {tour.badge}
                </span>
                <span className="absolute right-4 top-4 rounded-pill bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
                  {tour.duration}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-navy">{tour.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-body">{tour.copy}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tour.includes.map((include) => (
                    <span
                      key={include}
                      className="rounded-pill bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange"
                    >
                      {include}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                  <p className="font-display text-xl font-bold text-brand-orange">
                    {tour.price}
                    <span className="block text-xs font-normal text-slate-body">
                      per person
                    </span>
                  </p>
                  <Link
                    href="/inquire"
                    className="rounded-pill bg-brand-orange px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orange/90"
                  >
                    Inquire Now →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Need a Custom Tour?"
        copy="We build personalized international itineraries tailored to your dates, group size, interests and budget. Tell us what you want and we'll create the perfect experience."
        label="Plan My Custom Tour"
      />
    </>
  );
}
