import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Luggage,
  Tag,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";
import { getLiveHomeDeals } from "@/lib/flights";

export const metadata: Metadata = {
  title: "Flight Booking & International Ticketing",
  description:
    "Book domestic and international flights with Dellics Travels — IATA Certified agency. Best fares on Emirates, Qatar, Delta, British Airways, KLM and more with 24/7 WhatsApp ticketing.",
};

const DEFAULT_ROUTES = [
  {
    from: "Accra (ACC)",
    to: "London (LHR)",
    iata: "LHR",
    airline: "British Airways / KLM / Virgin",
    price: "From $850",
    duration: "6h 40m Non-stop",
    image: "/images/europe/paris-and-eiffel-tower.jpg",
  },
  {
    from: "Accra (ACC)",
    to: "Dubai (DXB)",
    iata: "DXB",
    airline: "Emirates / Ethiopian Airlines",
    price: "From $720",
    duration: "8h 15m",
    image: "/images/middle-east/burj-khalifa.jpg",
  },
  {
    from: "Accra (ACC)",
    to: "New York (JFK)",
    iata: "JFK",
    airline: "Delta Air Lines",
    price: "From $1,150",
    duration: "10h 30m Direct",
    image: "/images/services/plane.jpg",
  },
  {
    from: "Accra (ACC)",
    to: "Johannesburg (JNB)",
    iata: "JNB",
    airline: "South African Airways / ASKY",
    price: "From $620",
    duration: "5h 55m Direct",
    image: "/images/africa/cape-town-and-table-mountain.jpg",
  },
  {
    from: "Accra (ACC)",
    to: "Amsterdam (AMS)",
    iata: "AMS",
    airline: "KLM Royal Dutch Airlines",
    price: "From $890",
    duration: "6h 50m Direct",
    image: "/images/europe/amalfi-coast.jpg",
  },
  {
    from: "Accra (ACC)",
    to: "Lagos (LOS)",
    iata: "LOS",
    airline: "Africa World Airlines / Air Peace",
    price: "From $240",
    duration: "1h 00m Direct",
    image: "/images/services/airport-transfer-services.jpg",
  },
];

const FLIGHT_BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Official IATA Certification",
    description: "Tickets are issued directly via Global Distribution Systems (Amadeus & Travelport) without intermediaries or hidden charges.",
  },
  {
    icon: Clock,
    title: "Instant 24/7 Rebooking & Support",
    description: "Flight delayed or missed connection? Our dedicated agents manage changes, cancellations, and ticket revalidation immediately.",
  },
  {
    icon: Luggage,
    title: "Extra Baggage & Seat Concierge",
    description: "We negotiate extra baggage allowances, secure preferred seating, and request special in-flight meal options on your behalf.",
  },
  {
    icon: Tag,
    title: "Unpublished Corporate & Group Fares",
    description: "Access discounted private fares for families (3+ travelers), church groups, student admissions, and corporate delegations.",
  },
];

const FAQS = [
  {
    q: "How does booking through Dellics Travels WhatsApp work?",
    a: "When you submit your itinerary, our certified ticketing agent queries live GDS inventory and presents you with 2–3 best flight combinations, timings, and prices. Once you confirm, we issue your official e-ticket and send the airline PNR reference immediately.",
  },
  {
    q: "Can I pay with Ghanaian Cedi (GHS) or Mobile Money?",
    a: "Yes! We accept Ghanaian Cedi via MTN Mobile Money, Telecel Cash, Bank Transfer, Visa, and Mastercard through our secured Paystack integration, as well as USD/EUR transfers.",
  },
  {
    q: "Do you assist with transit and entry visas for connecting flights?",
    a: "Absolutely. Our visa consulting team checks all transit visa requirements (e.g., UK DATV, Schengen Airport Transit, Dubai 48h/96h transit) for your route.",
  },
];

export default async function FlightsPage() {
  const dealsData = await getLiveHomeDeals("ACC").catch(() => null);

  const priceMap = new Map<string, string>();
  dealsData?.deals?.forEach((d) => priceMap.set(d.iata.toUpperCase(), d.price));
  dealsData?.trending?.forEach((t) => priceMap.set(t.iata.toUpperCase(), t.price));

  const popularRoutes = DEFAULT_ROUTES.map((route) => {
    const livePrice = priceMap.get(route.iata);
    return {
      ...route,
      price: livePrice ? `From ${livePrice}` : route.price,
    };
  });

  return (
    <>
      <PageHero
        title="International Flight Booking & Ticketing"
        subtitle="IATA Certified Agency. Best wholesale fares across major global airlines with same-day electronic ticketing."
        badge="IATA Certified"
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Flights" }]}
      />

      {/* Flight Search Engine Container */}
      <section className="mx-auto -mt-14 max-w-5xl px-4 sm:px-6 lg:px-8 relative z-20">
        <FlightSearchWidget />
      </section>

      {/* Popular Flight Routes Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Top Routes"
          title="Popular Flight Deals from Accra"
          subtitle="Explore our most frequently booked domestic, regional and international routes with guaranteed seat availability."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map((route) => (

            <div
              key={`${route.from}-${route.to}`}
              className="group overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur-md">
                  {route.duration}
                </span>
                <span className="absolute right-4 bottom-3 text-sm font-extrabold text-brand-orange">
                  {route.price}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-navy">
                    {route.from} → {route.to}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  {route.airline}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    Seats Available
                  </span>
                  <Link
                    href={`/inquire?service=flights&from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&airline=${encodeURIComponent(route.airline)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>Instant Quote</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flight Benefits */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Book With Dellics"
            title="The Advantage of an Accredited Travel Agency"
            subtitle="More than an algorithm — you get a dedicated travel concierge defending your interests at every step."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FLIGHT_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Got Questions?"
          title="Frequently Asked Questions About Flight Booking"
        />

        <div className="mt-12 space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm"
            >
              <h3 className="font-display text-base font-bold text-navy flex items-start gap-2.5">
                <HelpCircle className="size-5 text-brand-orange shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Need Group Flight Bookings or Special Itineraries?"
        copy="Our IATA ticketing desk specializes in corporate delegations, family groups (3+ passengers), and multi-leg round-the-world tickets."
        label="Request Group Fare Quote"
        href="/inquire"
      />
    </>
  );
}
