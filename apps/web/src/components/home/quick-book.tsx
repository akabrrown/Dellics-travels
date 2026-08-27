"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Building2, Compass, Car, Search, ArrowRight, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function QuickBook() {
  const router = useRouter();
  const [hotelDestination, setHotelDestination] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");

  const [transferPickup, setTransferPickup] = useState("Kotoka International Airport (ACC)");
  const [transferDropoff, setTransferDropoff] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const transferPassengers = "1-2";

  function handleHotelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (hotelDestination) query.set("destination", hotelDestination);
    if (hotelCheckIn) query.set("checkIn", hotelCheckIn);
    if (hotelCheckOut) query.set("checkOut", hotelCheckOut);
    router.push(`/hotels${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleTransferSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hello Dellics Travels, I need an Airport Transfer quote:
• Pickup: ${transferPickup}
• Drop-off: ${transferDropoff || "Not specified"}
• Date/Time: ${transferDate || "Not specified"}
• Passengers: ${transferPassengers}`;
    window.location.href = buildWhatsAppLink(text);
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-4 sm:p-8 shadow-2xl border border-black/5 ring-1 ring-black/5 backdrop-blur-xl">
      <Tabs defaultValue="flights" className="w-full">
        {/* Navigation Tabs */}
        <div className="flex justify-center sm:justify-start border-b border-slate-100 pb-4 mb-6 overflow-x-auto">
          <TabsList className="bg-slate-100/80 p-1.5 rounded-full flex gap-1.5 h-auto">
            <TabsTrigger
              value="flights"
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Plane className="size-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger
              value="hotels"
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Building2 className="size-4" />
              <span>Hotels & Stays</span>
            </TabsTrigger>
            <TabsTrigger
              value="tours"
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Compass className="size-4" />
              <span>Tours & Safaris</span>
            </TabsTrigger>
            <TabsTrigger
              value="transfers"
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Car className="size-4" />
              <span>VIP Transfers</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. FLIGHTS TAB */}
        <TabsContent value="flights" className="mt-0 focus-visible:outline-none">
          <FlightSearchWidget />
        </TabsContent>

        {/* 2. HOTELS TAB */}
        <TabsContent value="hotels" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleHotelSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="hotel-dest" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Destination / City
                </Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
                  <Input
                    id="hotel-dest"
                    placeholder="e.g. Dubai, London, Cape Town, Accra"
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    className="pl-9 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hotel-in" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Check-in Date
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="hotel-in"
                    type="date"
                    value={hotelCheckIn}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hotel-out" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Check-out Date
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="hotel-out"
                    type="date"
                    value={hotelCheckOut}
                    onChange={(e) => setHotelCheckOut(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500">
                Powered by RateHawk & Amadeus. Over 2.5 million verified hotels, luxury apartments & resorts.
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-lg"
              >
                <Search className="size-4 mr-2" />
                Search Stays
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* 3. TOURS TAB */}
        <TabsContent value="tours" className="mt-0 focus-visible:outline-none">
          <div className="grid gap-6 sm:grid-cols-3 items-center">
            <div className="sm:col-span-2 space-y-2">
              <h3 className="font-display text-lg font-bold text-navy">Curated International Holidays & Safaris</h3>
              <p className="text-sm text-slate-600">
                Choose from over 25+ handcrafted group and private holiday itineraries including South Africa Cape Town, Safari Valley Ghana, Winter Dubai, Zanzibar, and Nairobi wildlife mix.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-lg">
                <Link href="/tours" className="flex items-center justify-center gap-2">
                  <span>Browse All Tours</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-slate-300">
                <Link href="/inquire">Request Custom Package</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* 4. TRANSFERS TAB */}
        <TabsContent value="transfers" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="trans-pick" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Pickup Location
                </Label>
                <Input
                  id="trans-pick"
                  placeholder="e.g. Kotoka Airport (ACC)"
                  value={transferPickup}
                  onChange={(e) => setTransferPickup(e.target.value)}
                  className="h-11 rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="trans-drop" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Drop-off Destination
                </Label>
                <Input
                  id="trans-drop"
                  placeholder="e.g. Accra, Tema, Cape Coast, Hotel"
                  value={transferDropoff}
                  onChange={(e) => setTransferDropoff(e.target.value)}
                  className="h-11 rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="trans-date" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Date & Time
                </Label>
                <Input
                  id="trans-date"
                  type="datetime-local"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="h-11 rounded-xl mt-1.5"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500">
                Includes flight delay monitoring, professional chauffeur meet & greet, and air-conditioned luxury fleet.
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-lg flex items-center justify-center gap-2"
              >
                <Car className="size-4" />
                <span>Request Transfer Quote</span>
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
