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
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Key,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function QuickBook() {
  const router = useRouter();

  // 2. Hotels State
  const [hotelDestination, setHotelDestination] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelGuests, setHotelGuests] = useState("2 Adults, 1 Room");

  // 3. Transfers State
  const [transferPickup, setTransferPickup] = useState("Kotoka International Airport (ACC)");
  const [transferDropoff, setTransferDropoff] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferType, setTransferType] = useState("One Way");

  // 4. Cars State
  const [carCity, setCarCity] = useState("Accra / Tema, Ghana");
  const [carType, setCarType] = useState("With Professional Chauffeur");
  const [carClass, setCarClass] = useState("Luxury SUV (Prado / Land Cruiser)");
  const [carStartDate, setCarStartDate] = useState("");
  const [carDuration, setCarDuration] = useState("3 Days");

  // 5. Tours & Activities State
  const [tourDestination, setTourDestination] = useState("Dubai, UAE");
  const [tourMonth, setTourMonth] = useState("Upcoming Season");

  // 6. Diaspora / Packages State
  const [diasporaPackage, setDiasporaPackage] = useState("Ghana Heritage & Cape Coast 7-Day Tour");
  const [diasporaTravelers, setDiasporaTravelers] = useState("2 Travelers");

  // 7. eSIM State
  const [esimCountry, setEsimCountry] = useState("Ghana");
  const [esimDataPlan, setEsimDataPlan] = useState("3 GB (30 Days)");

  // Form Submissions
  function handleHotelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (hotelDestination) query.set("destination", hotelDestination);
    if (hotelCheckIn) query.set("checkIn", hotelCheckIn);
    if (hotelCheckOut) query.set("checkOut", hotelCheckOut);
    if (hotelGuests) query.set("guests", hotelGuests);
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
    const query = new URLSearchParams();
    if (tourDestination) query.set("destination", tourDestination);
    if (tourMonth) query.set("season", tourMonth);
    router.push(`/tours${query.toString() ? `?${query.toString()}` : ""}`);
  }

  function handleDiasporaSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("service", "diaspora");
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
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-4 sm:p-7 shadow-2xl border border-black/5 ring-1 ring-black/5 backdrop-blur-xl">
      <Tabs defaultValue="flights" className="w-full">
        {/* Navigation Tabs Bar */}
        <div className="flex justify-start border-b border-slate-100 pb-4 mb-6 overflow-x-auto no-scrollbar scroll-smooth">
          <TabsList className="bg-slate-100/90 p-1.5 rounded-full flex gap-1.5 h-auto min-w-max">
            <TabsTrigger
              value="flights"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
            >
              <Plane className="size-4" />
              <span>Flights</span>
            </TabsTrigger>

            <TabsTrigger
              value="hotels"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
            >
              <Building2 className="size-4" />
              <span>Hotels</span>
            </TabsTrigger>

            <TabsTrigger
              value="transfers"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
            >
              <Car className="size-4" />
              <span>Transfers</span>
            </TabsTrigger>

            <TabsTrigger
              value="cars"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
            >
              <Key className="size-4" />
              <span>Cars</span>
            </TabsTrigger>

            <TabsTrigger
              value="tours"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
            >
              <Compass className="size-4" />
              <span>Tours & Activities</span>
            </TabsTrigger>

            <TabsTrigger
              value="packages"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
            >
              <Globe2 className="size-4" />
              <span>Packages/Diaspora Tours</span>
            </TabsTrigger>

            <TabsTrigger
              value="esim"
              className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white data-[state=active]:shadow-md transition-all shrink-0"
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
          <form onSubmit={handleHotelSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-1">
                <Label htmlFor="hotel-dest" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Destination / City
                </Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    id="hotel-dest"
                    placeholder="e.g. Dubai, London, Accra"
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-slate-50 border-slate-200 text-sm"
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
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 text-sm"
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
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hotel-guests" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Guests & Rooms
                </Label>
                <div className="relative mt-1.5">
                  <select
                    id="hotel-guests"
                    value={hotelGuests}
                    onChange={(e) => setHotelGuests(e.target.value)}
                    className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                  >
                    <option value="1 Adult, 1 Room">1 Adult, 1 Room</option>
                    <option value="2 Adults, 1 Room">2 Adults, 1 Room</option>
                    <option value="2 Adults, 2 Children">2 Adults + Children</option>
                    <option value="Family Suite (4+ Guests)">Family Suite (4+ Guests)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" />
                Over 2.5 million verified hotels, luxury apartments & resorts with best rate guarantee.
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

        {/* 3. TRANSFERS TAB */}
        <TabsContent value="transfers" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="trans-pick" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Pickup Location
                </Label>
                <Input
                  id="trans-pick"
                  placeholder="e.g. Kotoka Airport (ACC)"
                  value={transferPickup}
                  onChange={(e) => setTransferPickup(e.target.value)}
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 mt-1.5 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="trans-drop" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Drop-off Destination
                </Label>
                <Input
                  id="trans-drop"
                  placeholder="e.g. Accra, Tema, Cape Coast"
                  value={transferDropoff}
                  onChange={(e) => setTransferDropoff(e.target.value)}
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 mt-1.5 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="trans-date" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Date & Flight Arrival Time
                </Label>
                <Input
                  id="trans-date"
                  type="datetime-local"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 mt-1.5 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="trans-type" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Transfer Type
                </Label>
                <select
                  id="trans-type"
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="One Way Airport Pickup">One Way Airport Pickup</option>
                  <option value="Round Trip Airport Transfer">Round Trip Airport Transfer</option>
                  <option value="Full Day Chauffeur Protocol">Full Day VIP Protocol</option>
                </select>
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

        {/* 4. CARS TAB */}
        <TabsContent value="cars" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleCarSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="car-city" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Pickup City / Region
                </Label>
                <Input
                  id="car-city"
                  placeholder="e.g. Accra, Tema, Kumasi"
                  value={carCity}
                  onChange={(e) => setCarCity(e.target.value)}
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 mt-1.5 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="car-driver" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Service Mode
                </Label>
                <select
                  id="car-driver"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="With Professional Chauffeur">With Dedicated Chauffeur</option>
                  <option value="Self-Drive (Vetted)">Self-Drive (Vetted Deposit)</option>
                  <option value="Corporate Fleet Delegation">Corporate Fleet Delegation</option>
                </select>
              </div>
              <div>
                <Label htmlFor="car-class" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Vehicle Category
                </Label>
                <select
                  id="car-class"
                  value={carClass}
                  onChange={(e) => setCarClass(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="Luxury SUV (Prado / Land Cruiser V8)">Luxury 4x4 SUV (Prado / V8)</option>
                  <option value="Executive Sedan (Mercedes / Toyota Camry)">Executive Sedan</option>
                  <option value="Luxury Minibus / Coaster (15-30 Seats)">Executive Coaster Bus</option>
                  <option value="Compact City Car">Economy City Car</option>
                </select>
              </div>
              <div>
                <Label htmlFor="car-duration" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Rental Period
                </Label>
                <select
                  id="car-duration"
                  value={carDuration}
                  onChange={(e) => setCarDuration(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="1 Day (24 Hours)">1 Day</option>
                  <option value="3 Days Package">3 Days Package</option>
                  <option value="7 Days Weekly Rate">7 Days (Weekly Rate)</option>
                  <option value="Monthly Corporate Lease">Monthly Corporate Lease</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500">
                All vehicles fully insured with air conditioning, GPS tracking, and premium concierge support.
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-lg flex items-center justify-center gap-2"
              >
                <Key className="size-4" />
                <span>Reserve Car Hire</span>
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* 5. TOURS & ACTIVITIES TAB */}
        <TabsContent value="tours" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleTourSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="tour-dest" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Destination or Experience
                </Label>
                <select
                  id="tour-dest"
                  value={tourDestination}
                  onChange={(e) => setTourDestination(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="Dubai, UAE (Desert Safari & Yacht)">Dubai, UAE (Safari & Marina)</option>
                  <option value="South Africa (Cape Town & Table Mountain)">Cape Town & Table Mountain</option>
                  <option value="Ghana (Safari Valley & Cape Coast)">Safari Valley & Cape Coast (Ghana)</option>
                  <option value="Kenya & Tanzania (Maasai Mara Safari)">Maasai Mara Wildlife Safari</option>
                  <option value="Zanzibar Island Beach Escape">Zanzibar Island Beach Escape</option>
                  <option value="Paris & French Riviera (Europe)">Paris & French Riviera</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tour-season" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Travel Timing
                </Label>
                <select
                  id="tour-season"
                  value={tourMonth}
                  onChange={(e) => setTourMonth(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="Upcoming Season / Next 30 Days">Next 30 Days</option>
                  <option value="Easter Holiday Getaway">Easter Holidays</option>
                  <option value="Summer Holiday Package">Summer Holidays (July/August)</option>
                  <option value="Year-End December / Christmas Tour">December Year-End</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Compass className="size-4" />
                  <span>Browse 25+ Curated Tours</span>
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* 6. PACKAGES & DIASPORA TOURS TAB */}
        <TabsContent value="packages" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleDiasporaSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="diaspora-pkg" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Heritage / Vacation Package
                </Label>
                <select
                  id="diaspora-pkg"
                  value={diasporaPackage}
                  onChange={(e) => setDiasporaPackage(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="Ghana Heritage & Cape Coast 7-Day Tour">Ghana Heritage & Cape Coast (7 Days)</option>
                  <option value="Year of Return Cultural Immersion & Chieftaincy">Year of Return Cultural Immersion</option>
                  <option value="Ashanti Kingdom & Kumasi Craft Tour">Ashanti Kingdom & Kente Craft</option>
                  <option value="Custom Family Reunion & Diaspora Package">Custom Family Reunion Package</option>
                </select>
              </div>
              <div>
                <Label htmlFor="diaspora-count" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Travelers in Group
                </Label>
                <select
                  id="diaspora-count"
                  value={diasporaTravelers}
                  onChange={(e) => setDiasporaTravelers(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="Solo Traveler">Solo Traveler</option>
                  <option value="Couple (2 Travelers)">Couple (2 Travelers)</option>
                  <option value="Family (3-5 Travelers)">Family (3–5 Travelers)</option>
                  <option value="Group Delegation (6+ Travelers)">Group Delegation (6+ Travelers)</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Globe2 className="size-4" />
                  <span>Request Diaspora Package</span>
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* 7. ESIM TAB */}
        <TabsContent value="esim" className="mt-0 focus-visible:outline-none">
          <form onSubmit={handleEsimSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="esim-country" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Destination Country / Region
                </Label>
                <select
                  id="esim-country"
                  value={esimCountry}
                  onChange={(e) => setEsimCountry(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="Ghana">Ghana (Local)</option>
                  <option value="United Arab Emirates (Dubai)">United Arab Emirates (Dubai)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States & Canada">United States & Canada</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Europe Regional (39 Countries)">Europe Regional (39 Countries)</option>
                  <option value="Global 130+ Countries">Global (130+ Countries)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="esim-plan" className="text-xs font-bold uppercase tracking-wider text-navy">
                  Data Allowance & Validity
                </Label>
                <select
                  id="esim-plan"
                  value={esimDataPlan}
                  onChange={(e) => setEsimDataPlan(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 mt-1.5 text-sm text-slate-900 focus:outline-none focus:border-brand-orange"
                >
                  <option value="1 GB (7 Days) - $4.50">1 GB (7 Days) · $4.50</option>
                  <option value="3 GB (30 Days) - $11.00">3 GB (30 Days) · $11.00</option>
                  <option value="10 GB (30 Days) - $26.00">10 GB (30 Days) · $26.00</option>
                  <option value="20 GB (30 Days) - $42.00">20 GB (30 Days) · $42.00</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Smartphone className="size-4" />
                  <span>Get Instant eSIM</span>
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="size-4 text-emerald-600" />
              Powered by Airalo. High-speed 4G/5G data delivered via QR code instantly to your phone.
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
