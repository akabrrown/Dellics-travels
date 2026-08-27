import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Star,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { HotelSearch } from "@/components/hotels/hotel-search";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hotels & Airbnb Stays Worldwide",
  description:
    "Search over 2.5 million verified luxury hotels, boutique apartments & beach resorts worldwide with Dellics Travels' RateHawk partnership.",
};

const FEATURED_COLLECTIONS = [
  {
    title: "Luxury Dubai Marina Penthouse & Suites",
    location: "Dubai Marina, UAE",
    stars: 5,
    price: "$280 / night",
    image: "/images/services/dubai-marina-apartment.jpg",
    amenities: ["Infinity Pool", "Marina Skyline View", "Free High-Speed Wi-Fi", "Daily Breakfast Included"],
    badge: "5-Star Luxury",
  },
  {
    title: "Cape Town Oceanfront Clifftop Villa",
    location: "Camps Bay, Cape Town, South Africa",
    stars: 5,
    price: "$340 / night",
    image: "/images/services/south-africa-cape-town-villa.jpg",
    amenities: ["Atlantic Ocean Views", "Private Heated Pool", "Dedicated Butler", "Table Mountain Backdrop"],
    badge: "Beachfront Villa",
  },
  {
    title: "Serengeti Luxury Safari Lodge & Tents",
    location: "Serengeti National Park, Tanzania",
    stars: 5,
    price: "$450 / night",
    image: "/images/services/kenya-safari-lodge.jpg",
    amenities: ["Big 5 Game Drives", "Full Board Gourmet Meals", "Sundowner Lounge", "Eco-Solar Powered"],
    badge: "Wilderness Safari",
  },
  {
    title: "Singapore Orchard Road Boutique Apartment",
    location: "Orchard Road, Singapore",
    stars: 4,
    price: "$210 / night",
    image: "/images/services/singapore-city-apartment.jpg",
    amenities: ["Central Shopping Access", "Rooftop Jacuzzi", "Kitchenette", "Airport Shuttle"],
    badge: "City Center",
  },
  {
    title: "Zanzibar Nungwi Beachfront Bungalows",
    location: "Nungwi Beach, Zanzibar",
    stars: 5,
    price: "$190 / night",
    image: "/images/services/zanzibar-beach-villa.jpg",
    amenities: ["White Sand Beach", "Fresh Seafood Dining", "Scuba & Snorkeling", "Spa Treatments"],
    badge: "Island Paradise",
  },
];

const HOTEL_PERKS = [
  {
    title: "Direct Wholesale Rates",
    description: "Enjoy exclusive agency pricing negotiated with over 2.5 million properties globally without inflated retail surcharges.",
  },
  {
    title: "100% Verified Accommodation",
    description: "Every hotel and Airbnb partner is pre-screened for cleanliness, verified location accuracy, safety, and amenities.",
  },
  {
    title: "Zero Hidden City Taxes",
    description: "Transparent pricing upfront — all tourism taxes, service charges, and resort fees are clearly detailed before confirmation.",
  },
  {
    title: "Flexible Date Rescheduling",
    description: "Need to alter travel dates? Our direct concierge hotline coordinates hotel date amendments without hassle.",
  },
];

export default function HotelsPage() {
  return (
    <>
      <PageHero
        title="Luxury Hotels & Curated Stays Worldwide"
        subtitle="Search live availability across 2.5+ million hotels, boutique Airbnbs, safari lodges, and private beach villas with best rate guarantee."
        badge="Verified Global Stays"
        image="/images/services/hotel-and-airbnb.jpg"
        breadcrumbs={[{ label: "Hotels & Airbnb" }]}
      />

      {/* Live Hotel Search Engine Container */}
      <section className="mx-auto -mt-14 max-w-6xl px-4 sm:px-6 lg:px-8 relative z-20">
        <HotelSearch />
      </section>

      {/* Curated Luxury Collections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Curated Stays"
          title="Featured Handpicked Collections"
          subtitle="From romantic honeymoons to executive suites and family retreats, discover our most requested properties."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COLLECTIONS.map((stay) => (
            <div
              key={stay.title}
              className="group overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={stay.image}
                  alt={stay.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-md">
                  {stay.badge}
                </span>
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-500 backdrop-blur-md shadow-sm">
                  <Star className="size-3.5 fill-current" />
                  {stay.stars}.0
                </span>
                <span className="absolute left-4 bottom-3 text-sm font-extrabold text-white">
                  {stay.price}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-orange mb-1">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>{stay.location}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-navy">
                  {stay.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                  {stay.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    Instant Confirmation
                  </span>
                  <Link
                    href={`/inquire?service=hotels&hotel=${encodeURIComponent(stay.title)}&location=${encodeURIComponent(stay.location)}&price=${encodeURIComponent(stay.price)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>Reserve Stay</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hotel Perks Strip */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Book With Dellics"
            title="Verified Accommodation Guarantee"
            subtitle="Never worry about misleading photos, cancelled host reservations, or surprise checkout fees."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOTEL_PERKS.map((perk) => (
              <div
                key={perk.title}
                className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                  <Building2 className="size-6" />
                </div>
                <h3 className="font-display text-base font-bold text-navy mb-2">
                  {perk.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Planning a Long Stay, Corporate Retreat or Villa Booking?"
        copy="Our hospitality desk negotiates discounted monthly rates for corporate expatriates and private villa rentals with full staff."
        label="Inquire About Custom Stays"
        href="/inquire"
      />
    </>
  );
}
