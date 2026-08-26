"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { searchHotels, type Hotel } from "@/lib/hotels";
import { hotelSearchSchema } from "@/lib/schemas";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; hotels: Hotel[] };

export function HotelSearch() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = hotelSearchSchema.safeParse({ destination, checkIn, checkOut, guests, rooms });
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

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-card bg-white p-6 shadow-xl" aria-label="Hotel search">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Label htmlFor="hotel-destination">Destination</Label>
            <Input id="hotel-destination" placeholder="City or hotel name" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hotel-checkin">Check-in</Label>
            <Input id="hotel-checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hotel-checkout">Check-out</Label>
            <Input id="hotel-checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="hotel-guests">Guests</Label>
              <Input id="hotel-guests" type="number" min={1} max={16} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="hotel-rooms">Rooms</Label>
              <Input id="hotel-rooms" type="number" min={1} max={8} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />
            </div>
          </div>
        </div>
        {fieldError ? <p role="alert" className="mt-3 rounded-field bg-alert-tint px-4 py-2 text-sm text-alert">{fieldError}</p> : null}
        <Button type="submit" size="lg" disabled={status.state === "loading"} className="mt-4 w-full rounded-pill bg-brand-orange hover:bg-brand-orange/90 sm:w-auto">
          {status.state === "loading" ? "Searching…" : "Search hotels"}
        </Button>
      </form>

      {status.state === "loading" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading results">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-card border border-black/5">
              <Skeleton className="h-44 w-full" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {status.state === "error" ? (
        <div role="alert" className="rounded-card bg-alert-tint p-6 text-center">
          <p className="font-semibold text-alert">Hotel availability error</p>
          <p className="mt-1 text-sm text-alert">{status.message}</p>
        </div>
      ) : null}

      {status.state === "done" && status.hotels.length === 0 ? (
        <div className="rounded-card bg-sunrise/40 p-8 text-center">
          <p className="font-display text-lg font-semibold text-navy">No hotels found</p>
          <p className="mt-1 text-sm text-slate-body">Try different dates or a broader destination search.</p>
        </div>
      ) : null}

      {status.state === "done" && status.hotels.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {status.hotels.map((hotel) => (
            <article key={hotel.id} className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm">
              <div className="relative h-44 bg-slate-body/10">
                {hotel.images[0] ? <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" /> : null}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-navy">{hotel.name}</h3>
                  {hotel.rating > 0 ? (
                    <span className="flex items-center gap-1 text-sm text-brand-orange" aria-label={`${hotel.rating} stars`}>
                      <Star className="size-4 fill-current" aria-hidden /> {hotel.rating}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-body">{[hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ")}</p>
                {hotel.description ? <p className="mt-2 line-clamp-2 text-sm text-slate-body">{hotel.description}</p> : null}
                {hotel.price > 0 ? (
                  <p className="mt-3 font-display text-xl font-bold text-brand-orange">
                    {hotel.currency} {hotel.price.toLocaleString()}
                    <span className="text-sm font-normal text-slate-body"> / stay</span>
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-slate-body">Price on request</p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
