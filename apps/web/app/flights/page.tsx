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
import { HeroSlider } from "@/components/home/hero-slider";
import { SectionHeading } from "@/components/section-heading";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { StripeFlightBookButton } from "@/components/flights/stripe-flight-book-button";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";
import { getLiveHomeDeals } from "@/lib/flights";
import { FLIGHT_HERO_SLIDES } from "@/data/home";

export const metadata: Metadata = {
  title: "Flight Booking & International Ticketing",
  description:
    "Book domestic and international flights with Dellics Travels - IATA Accredited. Best fares on Emirates, Qatar, Delta, British Airways, KLM and more.",
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
    image: "/images/africa/safari.jpg",
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
    title: "Official IATA Accredited",
    description: "Your bookings are issued directly through accredited airline Global Distribution Systems (GDS) with verifiable airline PNR references.",
  },
  {
    icon: Clock,
    title: "Dedicated Ticketing Desk",
    description: "Get prompt human assistance for date changes, emergency cancellations, baggage add-ons, and re-routing.",
  },
  {
    icon: Luggage,
    title: "Full Baggage Allowance Guarantees",
    description: "We verify transparent 2x23kg or 2x32kg luggage limits so you never get surprised by airport excess baggage fees.",
  },
  {
    icon: Tag,
    title: "Unpublished Corporate & Group Fares",
    description: "Access discounted private fares for families (3+ travelers), church groups, student admissions, and corporate delegations.",
  },
];

const FAQS = [
  {
    q: "How do I book a flight on Dellics Travels?",
    a: "Search for your departure and destination, select your preferred flight, enter passenger details exactly as shown on the travel document, and complete payment. Once the ticket is successfully issued, your booking confirmation and e-ticket will be sent to your email."
  },
  {
    q: "Can I book a one-way or round-trip flight?",
    a: "Yes. Dellics Travels allows customers to search and book one-way and round-trip flights, subject to airline availability."
  },
  {
    q: "Which airlines can I book through Dellics Travels?",
    a: "Dellics Travels provides access to flights from participating airlines and airline content available through its booking systems. Airline availability varies by route, date and inventory."
  },
  {
    q: "Are the prices displayed on the website final?",
    a: "Displayed fares are subject to availability and can change until the booking is confirmed and the ticket is issued. Airline fares and inventory can change in real time."
  },
  {
    q: "What is included in the flight price?",
    a: "The fare inclusions depend on the airline and fare type. Depending on the selected fare, the price may include taxes and certain baggage allowances, while checked baggage, seats, meals and other optional services may cost extra."
  },
  {
    q: "How do I know my baggage allowance?",
    a: "Your baggage allowance is determined by the airline and the fare purchased. Always check the baggage information displayed during booking and on your e-ticket."
  },
  {
    q: "Can I choose my seat?",
    a: "Seat selection depends on the airline and fare. Some airlines allow free seat selection, while others charge an additional fee."
  },
  {
    q: "Can I change my flight after booking?",
    a: "In many cases, yes, but changes depend on the airline’s fare rules. Additional airline fees and any fare difference may apply."
  },
  {
    q: "Can I cancel my flight and get a refund?",
    a: "Refund eligibility depends on the airline’s fare conditions and the type of ticket purchased. Some fares are refundable, while others may be partially refundable or non-refundable."
  },
  {
    q: "How do I request a refund or cancellation?",
    a: "Contact Dellics Travels with your booking reference/PNR, passenger name and ticket details. We will review the applicable airline fare rules and advise you of the available options."
  },
  {
    q: "How long does a refund take?",
    a: "Refund processing time depends on the airline and payment method. Dellics Travels will process eligible refunds according to the applicable airline and booking conditions."
  },
  {
    q: "What happens if the airline cancels my flight?",
    a: "If an airline cancels or significantly changes a flight, the options available will depend on the airline’s policy and applicable passenger-rights rules. Dellics Travels can assist you with available rebooking or refund options."
  },
  {
    q: "What happens if my flight is delayed?",
    a: "Flight delays are generally handled according to the operating airline’s procedures and applicable passenger-rights regulations. Dellics Travels can assist with available information and rebooking options where applicable."
  },
  {
    q: "Can I correct a passenger’s name after booking?",
    a: "Name corrections are subject to the airline’s rules. Changing the ticket from one passenger to another is generally not the same as correcting a spelling error. Customers should carefully verify all passenger names before payment and ticket issuance."
  },
  {
    q: "What if I entered the wrong passenger details?",
    a: "Contact Dellics Travels immediately before the ticket is issued. Once a ticket has been issued, correction options may be limited and airline charges may apply."
  },
  {
    q: "Will I receive an e-ticket?",
    a: "Yes. After successful ticket issuance, the applicable booking confirmation and e-ticket information will be sent to the email address provided during booking."
  },
  {
    q: "What is a PNR or booking reference?",
    a: "A PNR/booking reference is the code associated with your flight reservation. You may need it when checking your booking, contacting the airline or requesting assistance from Dellics Travels."
  },
  {
    q: "Can I book a flight for another person?",
    a: "Yes. You can book a ticket for another passenger. However, ensure that the passenger’s name and other required information are entered exactly as shown on their travel document."
  },
  {
    q: "Do I need a visa to travel?",
    a: "Flight booking does not automatically guarantee permission to enter a country. Visa, passport, transit and other entry requirements depend on your nationality, destination and itinerary. Customers should verify the applicable requirements before travelling. IATA notes that travel-document rules can change frequently."
  },
  {
    q: "Can Dellics Travels help me with visa requirements?",
    a: "Yes. Dellics Travels can provide visa assistance and travel-document guidance as an additional service. However, visa approval is determined by the relevant embassy, consulate or immigration authority."
  },
  {
    q: "What if I miss my flight?",
    a: "Contact Dellics Travels and/or the airline as soon as possible. Your options depend on the airline’s fare rules and no-show policy. Failure to cancel or change before departure can result in loss of the ticket value under some fares."
  },
  {
    q: "Can I book flights for children or infants?",
    a: "Yes, subject to the airline’s rules. Passenger categories, fares, documentation and seating requirements may differ for infants and children."
  },
  {
    q: "Can I request special assistance?",
    a: "Yes. Special assistance requests can be submitted where supported by the airline. Customers should make requests as early as possible because requirements and procedures vary between airlines."
  },
  {
    q: "Can I add extra baggage after booking?",
    a: "For many airlines, additional baggage can be purchased after booking, subject to airline availability and applicable charges."
  },
  {
    q: "How can I contact Dellics Travels about my flight?",
    a: "Customers should provide their booking reference, passenger name and travel date when contacting support so that the booking can be identified quickly."
  }
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
      <HeroSlider
        slides={FLIGHT_HERO_SLIDES}
        breadcrumbs={[{ label: "Flights" }]}
      >
        <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white/85 backdrop-blur-xl p-4 sm:p-5 shadow-2xl border border-white/60 ring-1 ring-black/5 text-left">
          <FlightSearchWidget />
        </div>
      </HeroSlider>

      {/* Popular Flight Routes Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Top Routes"
          title="Popular Flight Deals"
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/inquire?service=flights&from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&airline=${encodeURIComponent(route.airline)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-navy"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="size-3" />
                  </Link>

                  <StripeFlightBookButton
                    compact
                    origin={route.from.match(/\(([^)]+)\)/)?.[1] || "ACC"}
                    destination={route.iata || route.to.match(/\(([^)]+)\)/)?.[1] || "LHR"}
                    airline={route.airline}
                    price={parseInt(route.price.replace(/[^0-9]/g, ""), 10) || 850}
                  />
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
            subtitle="More than an algorithm - you get a dedicated travel concierge defending your interests at every step."
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
