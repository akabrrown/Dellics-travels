"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  ArrowRight,
  Building2,
  MapPin,
  CheckCircle2,
  Wifi,
  Sparkles,
  ShieldCheck,
  Coffee,
  Waves,
  SlidersHorizontal,
  ChevronRight,
  BedDouble,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { searchHotels, type Hotel } from "@/lib/hotels";
import { hotelSearchSchema } from "@/lib/schemas";
import { HotelGuestRoomSelector } from "@/components/hotels/hotel-guest-room-selector";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; hotels: Hotel[] };

function HotelSearchForm() {
  const searchParams = useSearchParams();

  const [destination, setDestination] = useState(
    searchParams.get("destination") || "Dubai"
  );
  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") ||
      new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10)
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") ||
      new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10)
  );
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Auto-search on initial load or searchParam change
  useEffect(() => {
    const dest = searchParams.get("destination") || destination;
    const cIn = searchParams.get("checkIn") || checkIn;
    const cOut = searchParams.get("checkOut") || checkOut;

    if (dest && cIn && cOut) {
      executeSearch(dest, cIn, cOut, guests, rooms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function executeSearch(
    dest: string,
    cIn: string,
    cOut: string,
    gCount: number,
    rCount: number
  ) {
    const parsed = hotelSearchSchema.safeParse({
      destination: dest,
      checkIn: cIn,
      checkOut: cOut,
      guests: gCount,
      rooms: rCount,
    });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Please check your search details.");
      return;
    }

    setFieldError(null);
    setStatus({ state: "loading" });

    try {
      const hotels = await searchHotels(parsed.data);
      setStatus({ state: "done", hotels });
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Hotel search failed. Please try again.",
      });
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    executeSearch(destination, checkIn, checkOut, guests, rooms);
  }

  // Calculate nights
  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 5;
    const diff = new Date(outDate).getTime() - new Date(inDate).getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const nightsCount = calculateNights(checkIn, checkOut);

  // Filtered hotels
  const displayedHotels =
    status.state === "done"
      ? status.hotels.filter((h) => (filterRating ? h.rating >= filterRating : true))
      : [];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Search Input Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl border border-white/60 ring-1 ring-black/5 text-left"
        aria-label="Hotel search"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Label
              htmlFor="hotel-destination"
              className="text-[11px] font-bold text-slate-700 mb-1 block"
            >
              Destination or Hotel Name
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                id="hotel-destination"
                placeholder="e.g. Dubai, London, Accra, Paris, New York"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-9 h-11 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/15 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="hotel-checkin"
              className="text-[11px] font-bold text-slate-700 mb-1 block"
            >
              Check-in Date
            </Label>
            <Input
              id="hotel-checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="h-11 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/15 shadow-2xs"
            />
          </div>

          <div>
            <Label
              htmlFor="hotel-checkout"
              className="text-[11px] font-bold text-slate-700 mb-1 block"
            >
              Check-out Date
            </Label>
            <Input
              id="hotel-checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="h-11 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/15 shadow-2xs"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold text-slate-700 mb-1 block">
              Guests & Rooms
            </Label>
            <div className="flex items-center h-11">
              <HotelGuestRoomSelector
                value={{
                  adults: guests,
                  children: 0,
                  rooms: rooms,
                  roomType: "Standard",
                }}
                onChange={(next) => {
                  setGuests(next.adults + next.children);
                  setRooms(next.rooms);
                }}
              />
            </div>
          </div>
        </div>

        {fieldError ? (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700"
          >
            {fieldError}
          </p>
        ) : null}

        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
            <span>Direct B2B Wholesale Rates · 100% Guaranteed Room Availability</span>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={status.state === "loading"}
            className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 text-xs h-11 shadow-md cursor-pointer active:scale-95 transition-all"
          >
            {status.state === "loading" ? "Searching Live Inventory…" : "Search Stays & Suites"}
          </Button>
        </div>
      </form>

      {/* Loading Skeletons */}
      {status.state === "loading" ? (
        <div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Loading verified hotels"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xs"
            >
              <Skeleton className="h-52 w-full" />
              <div className="space-y-3 p-5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Error state */}
      {status.state === "error" ? (
        <div
          role="alert"
          className="rounded-3xl bg-rose-50 border border-rose-200 p-8 text-center"
        >
          <p className="font-bold text-rose-800 text-base">Unable to load hotel availability</p>
          <p className="mt-1 text-xs text-rose-600">{status.message}</p>
        </div>
      ) : null}

      {/* Done State & Results */}
      {status.state === "done" && (
        <div className="space-y-6">
          {/* Results Header with Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-display text-xl font-bold text-navy">
                Available Stays in {destination}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {displayedHotels.length} verified properties found for {nightsCount} nights · {guests} {guests === 1 ? "guest" : "guests"}
              </p>
            </div>

            {/* Quick Star Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="size-3 text-slate-400" />
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setFilterRating(null)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  filterRating === null
                    ? "bg-navy text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterRating(5)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  filterRating === 5
                    ? "bg-navy text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Star className="size-3 fill-amber-400 text-amber-400" />
                5-Star Only
              </button>
              <button
                type="button"
                onClick={() => setFilterRating(4)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  filterRating === 4
                    ? "bg-navy text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Star className="size-3 fill-amber-400 text-amber-400" />
                4+ Stars
              </button>
            </div>
          </div>

          {/* Hotel Property Grid */}
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {displayedHotels.map((hotel) => {
              const nightRate = Math.round(hotel.price / (nightsCount || 1)) || hotel.price;
              const primaryImage =
                hotel.images?.[0] ||
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

              return (
                <article
                  key={hotel.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  {/* Photo Hero with Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={primaryImage}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

                    {/* Star Rating Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-navy/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating > 0 ? `${hotel.rating}.0` : "4.5"} Star Hotel</span>
                    </div>

                    {/* RateHawk Verified Badge */}
                    <span className="absolute top-4 right-4 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Instant Confirmation
                    </span>

                    {/* Location Badge bottom left */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs font-medium text-white/95 line-clamp-1">
                      <MapPin className="size-3.5 text-brand-orange shrink-0" />
                      <span>{[hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ")}</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-navy line-clamp-1 group-hover:text-brand-orange transition-colors">
                        {hotel.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {hotel.description ||
                          `Luxury accommodation in ${hotel.city} offering modern suites, curated hospitality, and premium comfort.`}
                      </p>

                      {/* Amenities Chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(hotel.amenities?.length ? hotel.amenities.slice(0, 3) : ["Free WiFi", "Swimming Pool", "Breakfast"]).map(
                          (amenity) => (
                            <span
                              key={amenity}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 flex items-center gap-1"
                            >
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>{amenity}</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Pricing & CTA footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          From per night
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-xl sm:text-2xl font-black text-brand-orange">
                            ${nightRate.toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {hotel.currency || "USD"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          ${hotel.price.toLocaleString()} total for {nightsCount} nights
                        </span>
                      </div>

                      <Link
                        href={`/inquire?service=hotels&hotel=${encodeURIComponent(hotel.name)}&location=${encodeURIComponent([hotel.address, hotel.city, hotel.country].filter(Boolean).join(", "))}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}&rooms=${rooms}&price=${hotel.price}`}
                        className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs px-5 py-2.5 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>Reserve Room</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function HotelSearch() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl bg-white/85 p-6 text-center text-slate-500 text-xs font-semibold">
          Loading Stays & Suites...
        </div>
      }
    >
      <HotelSearchForm />
    </Suspense>
  );
}
