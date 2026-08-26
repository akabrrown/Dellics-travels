import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ContentSections, type ContentSection } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Dellics Travels Ghana services — affordable flights, Ghana heritage tours, hotel booking, airport transfers, corporate travel management and travel insurance. One agency, all your travel needs.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Complete Travel Solutions Under One Roof",
    paragraphs: [
      "From your first flight to your last transfer home — Dellics Travels takes care of every detail so you can enjoy every moment",
    ],
  },
  {
    heading: "Affordable Flight Booking",
    paragraphs: [
      "We compare prices across all major airlines to get you the best rate on domestic and international flights. Economy, business and first class — we handle it all. Our agents are available 24/7 for any flight emergencies.",
    ],
    bullets: [
      "Best price guarantee",
      "All major airlines covered",
      "Group & corporate bookings",
    ],
  },
  {
    heading: "Ghana Heritage Tours",
    paragraphs: [
      "Cape Coast Castle, Kakum Canopy Walk, Nkrumah Mausoleum, Slave River — our expert local guides bring Ghana's rich history and natural beauty alive with authentic, deeply personal storytelling.",
    ],
    bullets: [
      "Expert local guides",
      "Custom & group tour packages",
      "All entry fees & transport included",
    ],
  },
  {
    heading: "Perfect Accommodation",
    paragraphs: [
      "Whether you need a luxury hotel in Accra, a charming Airbnb near Cape Coast or a budget guesthouse in Tema — we find you the best stay at the best price. Worldwide coverage included.",
    ],
    bullets: [
      "Luxury, boutique & budget options",
      "Ghana & worldwide coverage",
      "Best rate guarantee",
    ],
  },
  {
    heading: "Airport Transfers",
    paragraphs: [
      "Professional meet-and-greet at Kotoka International Airport. Comfortable, punctual vehicles for individuals and groups — all sizes catered for.",
    ],
  },
  {
    heading: "Corporate Travel",
    paragraphs: [
      "End-to-end business travel management — multi-destination bookings, visa support, hotel coordination and a dedicated account manager for your company.",
    ],
  },
  {
    heading: "Visa Assistance",
    paragraphs: [
      "Expert visa processing and consultation for all destinations. We handle documentation, appointments and embassy submissions for hassle-free travel.",
    ],
  },
  {
    heading: "Diaspora Tourism",
    paragraphs: [
      "Specialized heritage tours for the African diaspora. Connect with your roots through authentic cultural experiences and historical journeys.",
    ],
  },
];

const SERVICE_CARDS = [
  { title: "Flight Booking", copy: "Best fares on all major airlines, issued same day.", href: "/flights", image: "/images/services/plane.jpg" },
  { title: "Hotels & Airbnb", copy: "Verified stays for every budget, booked server-side.", href: "/hotels", image: "/images/services/hotel-and-airbnb.jpg" },
  { title: "Tours & Packages", copy: "Group and private tours across five continents.", href: "/tours", image: "/images/services/kenya-safari-adventure.jpg" },
  { title: "Airport Transfers", copy: "On-time pickups with professional drivers.", href: "/transfers", image: "/images/services/airport-transfer-services.jpg" },
  { title: "Visa Assistance", copy: "Document guidance and appointment support.", href: "/visa", image: "/images/services/documentation-support.jpg" },
  { title: "Corporate Travel", copy: "Managed travel programmes for teams.", href: "/corporate", image: "/images/services/corporate-travel-management.jpg" },
  { title: "Diaspora Tourism", copy: "Heritage journeys connecting you with your roots.", href: "/diaspora", image: "/images/africa/cape-coast-castle.jpg" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Travel Services"
        subtitle="Everything you need for an unforgettable journey — flights, tours, hotels, transfers, corporate travel and insurance"
      />
      <ContentSections sections={SECTIONS} />

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionHeading eyebrow="What We Do" title="Explore Our Services" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative h-44">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-navy">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-body">{service.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Ready to Plan Your Trip?"
        copy="Contact our travel experts today and let us build you the perfect travel experience at an unbeatable price."
      />
    </>
  );
}
