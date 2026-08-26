import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { HotelSearch } from "@/components/hotels/hotel-search";

export const metadata: Metadata = {
  title: "Hotels & Airbnb",
  description:
    "Search live hotel availability worldwide through Dellics Travels' RateHawk partnership — verified stays for every budget.",
};

export default function HotelsPage() {
  return (
    <>
      <PageHero title="Hotels & Airbnb" subtitle="Live availability and honest pricing — no fake listings, no surprises at check-in." />
      <section className="mx-auto -mt-10 max-w-6xl px-4 pb-20">
        <HotelSearch />
      </section>
    </>
  );
}
