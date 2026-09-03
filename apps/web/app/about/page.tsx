import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  Globe2,
  Heart,
  Target,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { AccreditationStrip } from "@/components/accreditation-strip";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Dellics Travels — Licensed Travel Agency in Ghana",
  description:
    "Learn about Dellics Travels: IATA-accredited agency based in Tema Devtraco Estate, Ghana. Our mission, values, and experienced travel management team.",
};

const DRIVERS = [
  {
    icon: Target,
    name: "Our Mission",
    copy: "To deliver transparent, reliable and expertly curated travel services that create meaningful connections between travelers and the world's most incredible destinations — with zero friction and exceptional personal care.",
  },
  {
    icon: Globe2,
    name: "Our Vision",
    copy: "To be Africa's premier, most dependable travel brand, bridging the gap between local travelers, the global diaspora, and the world through world-class technology, licensing, and warm Ghanaian hospitality.",
  },
  {
    icon: Heart,
    name: "Our Core Values",
    copy: "Absolute integrity in ticketing pricing. Zero hidden fees. Deep historical reverence for diaspora heritage travel. Uncompromising customer dedication 24 hours a day, 7 days a week.",
  },
];

const STATS = [
  { value: "5,000+", label: "Delighted Travelers", sub: "" },
  { value: "40+", label: "Destinations", sub: "Across 5 Continents" },
  { value: "99.4%", label: "Visa Success", sub: "Consular Advisory" },
  { value: "24/7", label: "Live Concierge", sub: "Round-the-Clock Assistance" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Dellics Travels"
        subtitle="Ghana's premier travel management firm — organizing international itineraries with passion, certification, and personalized care."
        image="/images/africa/accra-city-experience.jpg"
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Brand Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Born from a Passion to Connect People to the World"
              subtitle="From Tema, Ghana to every major capital across Africa, Europe, Asia, and the Americas."
            />

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Dellics Travels was founded with a singular conviction: that travel should be transparent, deeply enriching, and completely free from stress. Whether an executive traveling for urgent international trade meetings, a family booking their dream Dubai vacation, or a member of the diaspora walking through the historic Door of Return in Cape Coast Castle — our team stands beside you every step of the way.
              </p>
              <p>
                Headquartered at <strong className="text-navy">Devtraco Estate, Tema Community 25, Greater Accra</strong>, we combine official <strong className="text-brand-orange">IATA Certification</strong> with enterprise Global Distribution Systems (Amadeus, RateHawk, and Travelport).
              </p>
              <p>
                When you book with Dellics, you are not dealing with an anonymous algorithm or an unverified broker. You work with certified, passionate travel consultants who actively protect your schedule, your budget, and your safety.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold">
                <Link href="/inquire">Plan Your Journey With Us</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/contact">Visit Our Office</Link>
              </Button>
            </div>
          </div>

          <div className="relative h-[480px] overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl group">
            <Image
              src="/images/services/ghana-heritage-airbnb.jpg"
              alt="Dellics Travels Heritage"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-6 right-6 size-16 rounded-2xl bg-white/95 backdrop-blur-md p-1.5 shadow-2xl border border-white/40 flex items-center justify-center z-10">
              <Image
                src="/logo.jpeg"
                alt="Dellics Travels Official Seal"
                width={56}
                height={56}
                className="size-full object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Official Headquarters
              </span>
              <p className="mt-2 font-display text-xl font-bold">
                Community 25, Devtraco Estate, Tema, Ghana
              </p>
              <p className="mt-1 text-xs text-white/80">
                P.O. Box CO 2686, Tema, Greater Accra · IATA Certified
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Guiding Principles & Commitments"
            subtitle="The foundational standards that define every interaction, itinerary, and ticket we issue."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {DRIVERS.map((driver) => {
              const Icon = driver.icon;
              return (
                <div
                  key={driver.name}
                  className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-brand-orange/30"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-5">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-3">
                    {driver.name}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {driver.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm"
            >
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-brand-orange">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-bold text-navy">
                {stat.label}
              </p>
              <p className="text-xs text-slate-500">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Accreditation Strip */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/70">
        <AccreditationStrip />
      </section>

      <CtaBanner
        title="Ready to Travel With Ghana's Most Trusted Agency?"
        copy="Contact our licensed travel consultants today to build your bespoke itinerary with guaranteed transparent pricing."
        label="Start Your Free Consultation"
        href="/inquire"
      />
    </>
  );
}
