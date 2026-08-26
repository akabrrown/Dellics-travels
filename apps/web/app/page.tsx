import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { QuickBook } from "@/components/home/quick-book";
import { SectionHeading } from "@/components/section-heading";
import { AccreditationStrip } from "@/components/accreditation-strip";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES, HOME_STATS } from "@/data/home";

const SERVICES = [
  { title: "Flight Booking", copy: "Best fares on all major airlines, issued same day.", href: "/flights", image: "/images/services/plane.jpg" },
  { title: "Hotels & Airbnb", copy: "Verified stays for every budget, booked server-side.", href: "/hotels", image: "/images/services/hotel-and-airbnb.jpg" },
  { title: "Tours & Packages", copy: "Group and private tours across five continents.", href: "/tours", image: "/images/services/kenya-safari-adventure.jpg" },
  { title: "Airport Transfers", copy: "On-time pickups with professional drivers.", href: "/transfers", image: "/images/services/airport-transfer-services.jpg" },
  { title: "Visa Assistance", copy: "Document guidance and appointment support.", href: "/visa", image: "/images/services/documentation-support.jpg" },
  { title: "Corporate Travel", copy: "Managed travel programmes for teams.", href: "/corporate", image: "/images/services/corporate-travel-management.jpg" },
];

const DESTINATION_TEASERS = [
  { name: "Africa", href: "/destinations/africa", image: "/images/africa/serengeti-national-park.jpg" },
  { name: "Europe", href: "/destinations/europe", image: "/images/europe/paris-and-eiffel-tower.jpg" },
  { name: "Asia", href: "/destinations/asia", image: "/images/asia/marina-bay-sands.jpg" },
  { name: "Middle East", href: "/destinations/middle-east", image: "/images/middle-east/burj-khalifa.jpg" },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={HERO_SLIDES} />

      <section className="relative z-10 -mt-16 px-4">
        <QuickBook />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Why Dellics" title="Everything your journey needs, in one place" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link key={service.href} href={service.href} className="group overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative h-44">
                <Image src={service.image} alt={service.title} fill className="object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-navy">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-body">{service.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center lg:grid-cols-4">
          {HOME_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-bold text-brand-orange">{stat.value}</p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Destinations" title="Where will you go next?" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATION_TEASERS.map((destination) => (
            <Link key={destination.href} href={destination.href} className="group relative h-64 overflow-hidden rounded-card">
              <Image src={destination.image} alt={destination.name} fill className="object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <p className="absolute bottom-4 left-4 font-display text-xl font-semibold text-white">{destination.name}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
            <Link href="/destinations">Explore all destinations</Link>
          </Button>
        </div>
      </section>

      <AccreditationStrip />

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <SectionHeading title="Ready to plan your next trip?" subtitle="Talk to a real travel expert — we reply within minutes on WhatsApp." />
        <Button asChild size="lg" className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
          <Link href="/inquire">Start an inquiry</Link>
        </Button>
      </section>
    </>
  );
}
