import type { Metadata } from "next/types";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Flight Booking",
  description:
    "Book domestic and international flights with Dellics Travels — IATA-accredited agents, best fares on all major airlines.",
};

const REASONS = [
  { title: "IATA-accredited", copy: "Tickets issued directly by licensed agents — no third-party risk." },
  { title: "Best-fare search", copy: "We compare across Amadeus, Travelport and RateHawk inventories." },
  { title: "24/7 trip support", copy: "Rebooking, refunds and emergencies handled around the clock." },
];

export default function FlightsPage() {
  return (
    <>
      <PageHero title="Book your next flight" subtitle="Tell us where you're going — real agents find the best fares and reply on WhatsApp within minutes." />
      <section className="mx-auto -mt-10 max-w-4xl px-4">
        <FlightSearchWidget />
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Why book flights with us" title="More than a booking engine" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-navy">{reason.title}</h3>
              <p className="mt-2 text-sm text-slate-body">{reason.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-pill">
            <Link href="/inquire">Prefer a detailed inquiry?</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
