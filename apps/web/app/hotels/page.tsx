"use client";

import { useState, useCallback } from "react";
import {
  Building,
  Search,
  ShieldCheck,
  Smartphone,
  Globe,
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
    icon: Building,
    title: "Wide Range of Accommodation",
    description:
      "Discover hotels, resorts, apartments, guesthouses and other accommodation options to suit different travel needs and budgets.",
  },
  {
    icon: Search,
    title: "Competitive Accommodation Options",
    description:
      "Compare available properties, room types, prices and amenities to find an option that matches your trip and budget.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Online Booking",
    description:
      "Book through the Dellics OTA platform with a secure online booking and payment experience.",
  },
  {
    icon: Smartphone,
    title: "Simple & Convenient",
    description:
      "Search, compare and book your accommodation online from your phone, tablet or computer — whenever you need it.",
  },
  {
    icon: Globe,
    title: "Ghana & Worldwide",
    description:
      "Whether you're planning a weekend in Accra, a business trip to Dubai, a holiday in Europe or an international adventure.",
  },
];

export default function HotelsPage() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [meta, setMeta] = useState({
    destination: "",
    checkIn: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    checkOut: new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10),
    guests: 2,
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const handleStatusChange = useCallback(
    (
      newStatus: Status,
      newMeta: {
        destination: string;
        checkIn: string;
        checkOut: string;
        guests: number;
        adults: number;
        children: number;
        rooms: number;
      }
    ) => {
      setStatus(newStatus);
      setMeta(newMeta);
    },
    []
  );

  return (
    <>
      <PageHero
        title="Why Book Accommodation with Dellics?"
        subtitle="Access negotiated wholesale rates across properties worldwide with guaranteed zero hidden city fees."
        image="/images/services/hotel-and-airbnb.jpg"
        breadcrumbs={[{ label: "Hotels & Stays" }]}
      >
        <HotelSearchForm onStatusChange={handleStatusChange} />
      </PageHero>

      {/* Results render OUTSIDE the hero - no overflow clipping */}
      <HotelSearchResults
        status={status}
        destination={meta.destination}
        checkIn={meta.checkIn}
        checkOut={meta.checkOut}
        guests={meta.guests}
        adults={meta.adults}
        children={meta.children}
        rooms={meta.rooms}
      />

      {/* Verified Booking Perks Strip */}
      <section className="bg-slate-50 py-24 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Book With Dellics"
            title="Why Book Accommodation with Dellics?"
            subtitle="Your stay. Your choice. Our travel expertise.

Book your hotel or accommodation with Dellics Travels and enjoy a convenient, secure and reliable way to arrange your stay — whether you're travelling within Ghana or exploring destinations around the world."
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

