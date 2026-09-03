"use client";

import { useState, useCallback } from "react";
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  Headphones,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { HotelSearchForm, HotelSearchResults } from "@/components/hotels/hotel-search";
import { CtaBanner } from "@/components/cta-banner";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; hotels: any[] };

const HOTEL_PERKS = [
  {
    icon: CreditCard,
    title: "Direct Wholesale Rates",
    description:
      "Enjoy exclusive B2B agency pricing negotiated across 3.3+ million properties globally with zero retail surcharges.",
  },
  {
    icon: ShieldCheck,
    title: "100% Verified Accommodation",
    description:
      "Every property is verified for cleanliness, location accuracy, safety, and certified amenities before arrival.",
  },
  {
    icon: Sparkles,
    title: "Zero Hidden City Taxes",
    description:
      "Transparent pricing upfront — all tourism taxes, service charges, and resort fees are clearly itemized before checkout.",
  },
  {
    icon: Headphones,
    title: "24/7 Concierge Support",
    description:
      "Our direct booking desk coordinates airport transfers, check-in requests, and schedule adjustments around the clock.",
  },
];

export default function HotelsPage() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [meta, setMeta] = useState({
    destination: "",
    checkIn: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    checkOut: new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10),
    guests: 2,
    rooms: 1,
  });

  const handleStatusChange = useCallback(
    (newStatus: Status, newMeta: { destination: string; checkIn: string; checkOut: string; guests: number; rooms: number }) => {
      setStatus(newStatus);
      setMeta(newMeta);
    },
    []
  );

  return (
    <>
      <PageHero
        image="/images/services/hotel-and-airbnb.jpg"
        breadcrumbs={[{ label: "Hotels & Stays" }]}
      >
        <HotelSearchForm onStatusChange={handleStatusChange} />
      </PageHero>

      {/* Results render OUTSIDE the hero — no overflow clipping */}
      <HotelSearchResults
        status={status}
        destination={meta.destination}
        checkIn={meta.checkIn}
        checkOut={meta.checkOut}
        guests={meta.guests}
        rooms={meta.rooms}
      />

      {/* Verified Booking Perks Strip */}
      <section className="bg-slate-50 py-24 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Book With Dellics"
            title="Verified Accommodation Guarantee"
            subtitle="Never worry about misleading photos, cancelled host reservations, or surprise checkout fees."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOTEL_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {perk.description}
                  </p>
                </div>
              );
            })}
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
