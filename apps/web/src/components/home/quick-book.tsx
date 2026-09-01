"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plane,
  Building2,
  Car,
  Compass,
  Globe2,
  Wifi,
  Search,
  MapPin,
  Calendar,
  Users,
  Key,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { HotelGuestRoomSelector, type HotelGuestsRooms } from "@/components/hotels/hotel-guest-room-selector";
import { buildViatorUrl } from "@/lib/tours";

export function QuickBook() {
  const router = useRouter();

  // Hotels State
  const [hotelDestination, setHotelDestination] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelGuestsData, setHotelGuestsData] = useState<HotelGuestsRooms>({
    adults: 1,
    children: 0,
    rooms: 1,
    roomType: "Economy",
  });

  // Transfers State
  const [transferPickup, setTransferPickup] = useState("Kotoka International Airport (ACC)");
  const [transferDropoff, setTransferDropoff] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferType, setTransferType] = useState("One Way");

  // Cars State
  const [carCity, setCarCity] = useState("Accra, Ghana");
  const [carType, setCarType] = useState("With Professional Chauffeur");
  const [carClass, setCarClass] = useState("Luxury SUV (Prado / Land Cruiser)");
  const [carStartDate, setCarStartDate] = useState("");
  const [carDuration, setCarDuration] = useState("3 Days");

  // Tours & Activities State
  const [tourDestination, setTourDestination] = useState("Dubai, UAE");
  const [tourMonth, setTourMonth] = useState("Upcoming Season");

  // Diaspora / Packages State
  const [diasporaPackage, setDiasporaPackage] = useState("Ghana Heritage & Cape Coast 7-Day Tour");
  const [diasporaTravelers, setDiasporaTravelers] = useState("2 Travelers");

  // eSIM State
  const [esimCountry, setEsimCountry] = useState("Ghana");
  const [esimDataPlan, setEsimDataPlan] = useState("3 GB (30 Days)");

  // Handlers
  function handleHotelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (hotelDestination) query.set("destination", hotelDestination);
    if (hotelCheckIn) query.set("checkIn", hotelCheckIn);
    if (hotelCheckOut) query.set("checkOut", hotelCheckOut);
    const guestLabel = `${hotelGuestsData.adults} Adult${hotelGuestsData.adults > 1 ? "s" : ""}${hotelGuestsData.children > 0 ? `, ${hotelGuestsData.children} Child` : ""}, ${hotelGuestsData.rooms} Room`;
    query.set("guests", guestLabel);
    if (hotelGuestsData.roomType) {
      query.set("roomType", hotelGuestsData.roomType);
    }
    router.push(`/hotels${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleTransferSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (transferPickup) query.set("pickup", transferPickup);
    if (transferDropoff) query.set("dropoff", transferDropoff);
    if (transferDate) query.set("date", transferDate);
    if (transferType) query.set("type", transferType);
    router.push(`/transfers${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleCarSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("service", "car_hire");
    if (carCity) query.set("city", carCity);
    if (carType) query.set("driver", carType);
    if (carClass) query.set("vehicle", carClass);
    if (carStartDate) query.set("date", carStartDate);
    if (carDuration) query.set("duration", carDuration);
    router.push(`/inquire${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleTourSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dest = tourDestination.trim() || "Tours and Activities";
    // Process starts on Dellics Travels then deep-links to Viator verified partner booking
    window.open(
      buildViatorUrl(dest, tourMonth !== "Upcoming Season" ? tourMonth : undefined),
      "_blank",
      "noopener,noreferrer",
    );
    const query = new URLSearchParams();
    if (tourDestination) query.set("destination", tourDestination);
    if (tourMonth) query.set("month", tourMonth);
    router.push(`/tours${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleDiasporaSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("service", "diaspora_tour");
    if (diasporaPackage) query.set("package", diasporaPackage);
    if (diasporaTravelers) query.set("travelers", diasporaTravelers);
    router.push(`/inquire${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleEsimSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("service", "esim");
    if (esimCountry) query.set("country", esimCountry);
    if (esimDataPlan) query.set("plan", esimDataPlan);
    router.push(`/inquire${query.toString() ? `?${query.toString()}` : ""}`);
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-4 sm:p-5 shadow-2xl border border-slate-200/80 ring-1 ring-black/5 backdrop-blur-sm">
      <Tabs defaultValue="flights" className="w-full">
        {/* Compact Navigation Tabs Bar */}
        <div className="flex justify-start border-b border-slate-100 pb-2.5 mb-3.5 overflow-x-auto no-scrollbar scroll-smooth">
          <TabsList className="bg-slate-100/90 p-1.5 rounded-2xl flex gap-1.5 h-auto min-w-max">
            <TabsTrigger
              value="flights"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Plane className="size-4" />
              <span>Flights</span>
            </TabsTrigger>

            <TabsTrigger
              value="hotels"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Building2 className="size-4" />
              <span>Hotels</span>
            </TabsTrigger>

            <TabsTrigger
              value="transfers"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Car className="size-4" />
              <span>Transfers</span>
            </TabsTrigger>

            <TabsTrigger
              value="cars"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Key className="size-4" />
              <span>Cars</span>
            </TabsTrigger>

            <TabsTrigger
              value="tours"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Compass className="size-4" />
              <span>Tours</span>
            </TabsTrigger>

            <TabsTrigger
              value="packages"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Globe2 className="size-4" />
              <span>Diaspora Packages</span>
            </TabsTrigger>

            <TabsTrigger
              value="esim"
              className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-sm transition-all shrink-0 text-slate-700 hover:text-navy"
            >
              <Wifi className="size-4" />
              <span>eSIM</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. FLIGHTS TAB */}
        <TabsContent value="flights" className="mt-0 focus-visible:outline-none">
          <FlightSearchWidget />
        </TabsContent>

        {/* 2. HOTELS TAB */}
        <TabsContent value="hotels" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleHotelSubmit} className="space-y-3">
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="hotel-dest" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Destination / City
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input
                    id="hotel-dest"
                    placeholder="e.g. Dubai, London, Accra"
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    className="pl-8 h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hotel-in" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Check-in Date
                </Label>
                <Input
                  id="hotel-in"
                  type="date"
                  value={hotelCheckIn}
                  onChange={(e) => setHotelCheckIn(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="hotel-out" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Check-out Date
                </Label>
                <Input
                  id="hotel-out"
                  type="date"
                  value={hotelCheckOut}
                  onChange={(e) => setHotelCheckOut(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Guests & Rooms
                </Label>
                <div className="flex items-center h-10">
                  <HotelGuestRoomSelector
                    value={hotelGuestsData}
                    onChange={setHotelGuestsData}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Search className="size-4" />
              <span>Search Verified Stays & Best Rates</span>
            </Button>
          </form>
        </TabsContent>

        {/* 3. TRANSFERS TAB */}
        <TabsContent value="transfers" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleTransferSubmit} className="space-y-3">
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="trans-pick" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Pickup Location
                </Label>
                <Input
                  id="trans-pick"
                  placeholder="e.g. Kotoka Airport (ACC)"
                  value={transferPickup}
                  onChange={(e) => setTransferPickup(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="trans-drop" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Drop-off Destination
                </Label>
                <Input
                  id="trans-drop"
                  placeholder="e.g. Accra, Tema, Cape Coast"
                  value={transferDropoff}
                  onChange={(e) => setTransferDropoff(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="trans-date" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Date & Arrival Time
                </Label>
                <Input
                  id="trans-date"
                  type="datetime-local"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="trans-type" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Transfer Service Type
                </Label>
                <select
                  id="trans-type"
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="One Way Airport Pickup">One Way Airport Pickup</option>
                  <option value="Round Trip Airport Transfer">Round Trip Airport Transfer</option>
                  <option value="Full Day Chauffeur Protocol">Full Day VIP Protocol</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Search className="size-4" />
              <span>Find Airport Transfers</span>
            </Button>
          </form>
        </TabsContent>

        {/* 4. CARS TAB */}
        <TabsContent value="cars" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleCarSubmit} className="space-y-3">
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="car-city" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  City / Region
                </Label>
                <Input
                  id="car-city"
                  placeholder="e.g. Accra / Tema, Ghana"
                  value={carCity}
                  onChange={(e) => setCarCity(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="car-driver" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Driver Preference
                </Label>
                <select
                  id="car-driver"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="With Professional Chauffeur">With Professional Chauffeur</option>
                  <option value="Self Drive (Security Clearance)">Self Drive</option>
                  <option value="Armored / Security Escort">Armored VIP Escort</option>
                </select>
              </div>
              <div>
                <Label htmlFor="car-veh" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Vehicle Category
                </Label>
                <select
                  id="car-veh"
                  value={carClass}
                  onChange={(e) => setCarClass(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="Luxury SUV (Prado / Land Cruiser)">Luxury SUV (Prado / Land Cruiser)</option>
                  <option value="Executive Sedan (Mercedes / Camry)">Executive Sedan (Mercedes / Camry)</option>
                  <option value="Hiace Van / Coaster Bus (Groups)">Group Bus / Van (15-30 Pax)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="car-start" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Rental Start Date
                </Label>
                <Input
                  id="car-start"
                  type="date"
                  value={carStartDate}
                  onChange={(e) => setCarStartDate(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Search className="size-4" />
              <span>Reserve Chauffeur & Vehicle</span>
            </Button>
          </form>
        </TabsContent>

        {/* 5. TOURS TAB */}
        <TabsContent value="tours" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleTourSubmit} className="space-y-3">
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label htmlFor="tour-dest" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Destination or Holiday Package
                </Label>
                <Input
                  id="tour-dest"
                  placeholder="e.g. Dubai, Zanzibar, Cape Town, Paris"
                  value={tourDestination}
                  onChange={(e) => setTourDestination(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="tour-m" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Preferred Travel Month / Season
                </Label>
                <select
                  id="tour-m"
                  value={tourMonth}
                  onChange={(e) => setTourMonth(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="Upcoming Season">Upcoming Season</option>
                  <option value="Easter Holiday">Easter Holiday</option>
                  <option value="Summer Season (July - Aug)">Summer Season (July - Aug)</option>
                  <option value="December / Year-End Festive">December / Year-End Festive</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <span>Explore & Book on Viator</span>
              <ExternalLink className="size-4" />
            </Button>
          </form>
        </TabsContent>

        {/* 6. DIASPORA / PACKAGES TAB */}
        <TabsContent value="packages" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleDiasporaSubmit} className="space-y-3">
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label htmlFor="diaspora-pkg" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Selected Heritage Experience
                </Label>
                <select
                  id="diaspora-pkg"
                  value={diasporaPackage}
                  onChange={(e) => setDiasporaPackage(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="Ghana Heritage & Cape Coast 7-Day Tour">Ghana Heritage & Cape Coast 7-Day Tour</option>
                  <option value="Year of Return & AfroFuture Festival VIP">Year of Return & AfroFuture VIP Experience</option>
                  <option value="Ashanti Kingdom & Kumasi Cultural Expedition">Ashanti Kingdom & Kumasi Cultural Expedition</option>
                </select>
              </div>
              <div>
                <Label htmlFor="diaspora-pax" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Number of Travelers
                </Label>
                <select
                  id="diaspora-pax"
                  value={diasporaTravelers}
                  onChange={(e) => setDiasporaTravelers(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="1 Solo Traveler">1 Solo Traveler</option>
                  <option value="2 Travelers (Couple/Friends)">2 Travelers (Couple/Friends)</option>
                  <option value="Family (3-5 Travelers)">Family (3-5 Travelers)</option>
                  <option value="Group / Organization (6+ Pax)">Group (6+ Pax)</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Search className="size-4" />
              <span>Inquire About Heritage Packages</span>
            </Button>
          </form>
        </TabsContent>

        {/* 7. ESIM TAB */}
        <TabsContent value="esim" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleEsimSubmit} className="space-y-3">
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label htmlFor="esim-c" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Travel Destination Country
                </Label>
                <Input
                  id="esim-c"
                  placeholder="e.g. Ghana, UAE, UK, USA, Schengen"
                  value={esimCountry}
                  onChange={(e) => setEsimCountry(e.target.value)}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <Label htmlFor="esim-d" className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Recommended Data Allowance
                </Label>
                <select
                  id="esim-d"
                  value={esimDataPlan}
                  onChange={(e) => setEsimDataPlan(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  <option value="3 GB (30 Days)">3 GB High-Speed (30 Days)</option>
                  <option value="5 GB (30 Days)">5 GB High-Speed (30 Days)</option>
                  <option value="10 GB (30 Days)">10 GB High-Speed (30 Days)</option>
                  <option value="Unlimited Global (15 Days)">Unlimited Global (15 Days)</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Search className="size-4" />
              <span>Get Instant eSIM QR Code</span>
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
