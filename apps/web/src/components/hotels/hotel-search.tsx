"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  ArrowRight,
  Building2,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { searchHotels, type Hotel } from "@/lib/hotels";
import { hotelSearchSchema } from "@/lib/schemas";
import { HotelGuestRoomSelector } from "@/components/hotels/hotel-guest-room-selector";
import { buildWhatsAppLink, composeHotelMessage } from "@/lib/whatsapp";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; hotels: Hotel[] };

/* ─── Search Form (renders inside hero) ─── */
function HotelSearchFormInner({
  onStatusChange,
}: {
  onStatusChange: (
    status: Status,
    meta: {
      destination: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      adults: number;
      children: number;
      rooms: number;
    }
  ) => void;
}) {
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
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Load initial results on mount or when searchParams change
  useEffect(() => {
    const dest = searchParams.get("destination") || destination || "Dubai";
    const cIn = searchParams.get("checkIn") || checkIn;
    const cOut = searchParams.get("checkOut") || checkOut;

    executeSearch(dest, cIn, cOut, adults, children, rooms, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function executeSearch(
    dest: string,
    cIn: string,
    cOut: string,
    adultsCount: number,
    childrenCount: number,
    rCount: number,
    scroll: boolean = true
  ) {
    const targetDest = dest.trim() || "Dubai";
    const totalGuests = adultsCount + childrenCount;

    const parsed = hotelSearchSchema.safeParse({
      destination: targetDest,
      checkIn: cIn,
      checkOut: cOut,
      guests: totalGuests,
      adults: adultsCount,
      children: childrenCount,
      rooms: rCount,
    });

    if (!parsed.success) {
      setFieldError(
        parsed.error.issues[0]?.message ?? "Please check your search details."
      );
      return;
    }

    setFieldError(null);
    setIsSearching(true);
    const meta = {
      destination: targetDest,
      checkIn: cIn,
      checkOut: cOut,
      guests: totalGuests,
      adults: adultsCount,
      children: childrenCount,
      rooms: rCount,
    };
    onStatusChange({ state: "loading" }, meta);

    if (scroll) {
      setTimeout(() => {
        document
          .getElementById("hotel-results-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    try {
      const hotels = await searchHotels(parsed.data);
      onStatusChange({ state: "done", hotels }, meta);
    } catch (error) {
      onStatusChange(
        {
          state: "error",
          message:
            error instanceof Error
              ? error.message
              : "Hotel search failed. Please try again.",
        },
        meta
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    executeSearch(destination, checkIn, checkOut, adults, children, rooms, true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl border border-white/60 ring-1 ring-black/5 text-left w-full max-w-6xl"
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
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Test Stays:
            </span>
            {[
              { label: "Dubai, UAE", query: "Dubai" },
              { label: "Paris, France", query: "Paris" },
              { label: "Los Angeles, USA", query: "Los Angeles" },
            ].map((chip) => {
              const active = destination.toLowerCase().includes(chip.query.toLowerCase());
              return (
                <button
                  key={chip.query}
                  type="button"
                  onClick={() => {
                    setDestination(chip.query);
                    executeSearch(chip.query, checkIn, checkOut, adults, children, rooms, true);
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-navy text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
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
                adults,
                children,
                rooms,
                roomType: "Standard",
              }}
              onChange={(next) => {
                setAdults(next.adults);
                setChildren(next.children);
                setRooms(next.rooms);
              }}
              showRoomType={false}
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

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            RateHawk Wholesale Rates
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            Instant B2B Confirmation
          </span>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSearching}
          className="w-full sm:w-auto px-8 h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Checking Live Inventory...</span>
            </>
          ) : (
            <>
              <span>Search Stays & Suites</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function HotelSearchForm({
  onStatusChange,
}: {
  onStatusChange: (
    status: Status,
    meta: {
      destination: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      adults: number;
      children: number;
      rooms: number;
    }
  ) => void;
}) {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl bg-white/85 p-6 text-center text-slate-500 text-xs font-semibold">
          Loading Search Engine...
        </div>
      }
    >
      <HotelSearchFormInner onStatusChange={onStatusChange} />
    </Suspense>
  );
}

/* ─── Results Section (renders OUTSIDE the hero) ─── */
export function HotelSearchResults({
  status,
  destination,
  checkIn,
  checkOut,
  guests = 2,
  adults = 2,
  children = 0,
  rooms = 1,
}: {
  status: Status;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults?: number;
  children?: number;
  rooms: number;
}) {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 5;
    const diff = new Date(outDate).getTime() - new Date(inDate).getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const nightsCount = calculateNights(checkIn, checkOut);

  const displayedHotels =
    status.state === "done"
      ? status.hotels.filter((h) =>
          filterRating ? h.rating >= filterRating : true
        )
      : [];

  const targetCity = destination || "Dubai";

  return (
    <section
      id="hotel-results-section"
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scroll-mt-6"
    >
      {/* Loading Skeletons */}
      {status.state === "loading" || status.state === "idle" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-display text-xl font-bold text-navy">
                Checking Live Rates in {targetCity}...
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Querying direct RateHawk wholesale inventory
              </p>
            </div>
          </div>

          <div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading results"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <Skeleton className="h-56 w-full" />
                <div className="space-y-3 p-5">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/3 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Error state */}
      {status.state === "error" ? (
        <div
          role="alert"
          className="rounded-3xl bg-rose-50 border border-rose-200 p-8 text-center"
        >
          <p className="font-bold text-rose-800 text-base">
            Unable to load hotel availability
          </p>
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
                Available Stays in {targetCity}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {displayedHotels.length} verified properties found for{" "}
                {nightsCount} nights · {adults} {adults === 1 ? "adult" : "adults"}
                {children > 0 ? `, ${children} ${children === 1 ? "child" : "children"}` : ""} · {rooms} {rooms === 1 ? "room" : "rooms"}
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
                5 Stars
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

          {/* Hotel Property Grid or Luxury Concierge Fallback */}
          {displayedHotels.length === 0 ? (
            <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-navy-dark to-[#0A1128] text-white p-8 sm:p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/20 border border-brand-orange/30 px-3.5 py-1 text-xs font-bold text-brand-orange">
                  <ShieldCheck className="size-3.5" />
                  <span>IATA Certified Luxury Concierge</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Contracted Stays & Direct Rates in {targetCity}
                </h3>

                <p className="text-sm text-white/80 leading-relaxed">
                  While our automated RateHawk Sandbox currently serves instant test bookings in <strong className="text-white font-semibold">Dubai, Paris, and Los Angeles</strong>, Dellics Travels holds contracted direct GDS wholesale rates for verified 5-star hotels, serviced suites, and private resorts in <strong className="text-white font-semibold">{targetCity}</strong>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={buildWhatsAppLink(
                      composeHotelMessage({
                        destination: targetCity,
                        checkIn,
                        checkOut,
                        guests: adults + children,
                        rooms,
                      })
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span>Inquire via WhatsApp Concierge</span>
                  </a>

                  <Link
                    href={`/inquire?type=hotel&destination=${encodeURIComponent(targetCity)}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs px-6 py-3.5 transition-all cursor-pointer"
                  >
                    <span>Submit Custom Inquiry</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <div className="pt-6 border-t border-white/10 text-xs text-white/60">
                  <p className="font-semibold text-white/80 mb-3">
                    Explore live instant RateHawk inventory in active sandbox test destinations:
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {[
                      { city: "Dubai", label: "Dubai, UAE (244+ Stays)" },
                      { city: "Paris", label: "Paris, France (249+ Stays)" },
                      { city: "Los Angeles", label: "Los Angeles, USA (246+ Stays)" },
                    ].map((item) => (
                      <Link
                        key={item.city}
                        href={`/hotels?destination=${encodeURIComponent(item.city)}`}
                        className="rounded-full bg-white/10 hover:bg-brand-orange hover:text-white px-3.5 py-1 text-xs font-medium transition-colors border border-white/15 text-white/90"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {displayedHotels.map((hotel) => {
                const nightRate =
                  Math.round(hotel.price / (nightsCount || 1)) || hotel.price;
                const rawImg = hotel.images?.[0] || "";
                const primaryImage = rawImg
                  ? rawImg
                      .replace("{size}", "1024x768")
                      .replace("%7Bsize%7D", "1024x768")
                  : "";

                return (
                  <article
                    key={hotel.id}
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
                  >
                    {/* Photo Hero with Badges */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={hotel.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Building2 className="size-12 opacity-40 text-white" />
                          <span className="text-[11px] font-semibold text-white/60">
                            RateHawk Verified Property
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Star Rating Badge */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-navy shadow-md">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{hotel.rating.toFixed(1)}</span>
                      </div>

                      {/* Live Supplier Badge */}
                      <div className="absolute top-3.5 right-3.5 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                        RateHawk Direct
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        {/* City & Address */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                          <MapPin className="size-3.5 text-brand-orange shrink-0" />
                          <span className="truncate">
                            {hotel.city || hotel.address}
                            {hotel.country ? `, ${hotel.country}` : ""}
                          </span>
                        </div>

                        {/* Hotel Name */}
                        <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-1">
                          {hotel.name}
                        </h3>

                        {/* Top Amenities Pills */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {hotel.amenities.slice(0, 3).map((amenity, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                              >
                                <CheckCircle2 className="size-2.5 text-emerald-600" />
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Description excerpt */}
                        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {hotel.description}
                        </p>
                      </div>

                      {/* Price & CTA Footer */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-display text-xl sm:text-2xl font-black text-brand-orange">
                              ${nightRate.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {hotel.currency || "USD"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            ${hotel.price.toLocaleString()} total for {nightsCount}{" "}
                            nights
                          </span>
                        </div>

                        <Link
                          href={`/hotels/book?id=${encodeURIComponent(
                            hotel.id
                          )}&name=${encodeURIComponent(
                            hotel.name
                          )}&location=${encodeURIComponent(
                            [hotel.address, hotel.city, hotel.country]
                              .filter(Boolean)
                              .join(", ")
                          )}&checkIn=${encodeURIComponent(
                            checkIn
                          )}&checkOut=${encodeURIComponent(
                            checkOut
                          )}&adults=${adults}&children=${children}&guests=${
                            adults + children
                          }&rooms=${rooms}&price=${hotel.price}&currency=${
                            hotel.currency || "USD"
                          }&rating=${hotel.rating}&image=${encodeURIComponent(
                            primaryImage || ""
                          )}&rates=${encodeURIComponent(
                            JSON.stringify(hotel.rates || [])
                          )}`}
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
          )}
        </div>
      )}
    </section>
  );
}

/* ─── Full page composition (form + results) ─── */
export function HotelSearchPage() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [meta, setMeta] = useState({
    destination: "Dubai",
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
      <HotelSearchForm onStatusChange={handleStatusChange} />
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
    </>
  );
}

export function HotelSearch() {
  return <HotelSearchPage />;
}
