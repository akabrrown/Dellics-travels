"use client";

import { useState } from "react";
import { Plus, Trash2, Search, ArrowRightLeft, Calendar as CalendarIcon, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PassengerSelector } from "./passenger-selector";
import { AirportCombobox } from "@/components/ui/airport-combobox";
import type { PassengerCounts } from "@/lib/passengers";
import type { TripType } from "@/lib/whatsapp";

const CLASSES = ["Economy", "Premium Economy", "Business", "First"];
const MIN_LEGS = 2;
const MAX_LEGS = 5;

interface MultiCityLeg {
  from: string;
  to: string;
  departDate: string;
}

export function FlightSearchWidget() {
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [multiCityLegs, setMultiCityLegs] = useState<MultiCityLeg[]>([
    { from: "", to: "", departDate: "" },
    { from: "", to: "", departDate: "" },
  ]);
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [error, setError] = useState<string | null>(null);

  function handleSwapAirports() {
    const temp = from;
    setFrom(to);
    setTo(temp);
  }

  function updateMultiCityLeg(index: number, patch: Partial<MultiCityLeg>) {
    setMultiCityLegs((prev) => prev.map((leg, i) => (i === index ? { ...leg, ...patch } : leg)));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (tripType === "multicity") {
      for (const [index, leg] of multiCityLegs.entries()) {
        if (!leg.from.trim() || !leg.to.trim() || !leg.departDate) {
          setError(`Please complete all fields for Flight ${index + 1}.`);
          return;
        }
      }
    } else {
      if (!from.trim() || !to.trim() || !departDate) {
        setError("Please enter origin, destination, and departure date.");
        return;
      }
      if (tripType === "roundtrip" && !returnDate) {
        setError("Please select a return date for round trip flights.");
        return;
      }
    }

    setError(null);
    const query = new URLSearchParams();
    query.set("service", "flights");
    query.set("tripType", tripType);
    query.set("from", from);
    query.set("to", to);
    query.set("departDate", departDate);
    if (tripType === "roundtrip" && returnDate) {
      query.set("returnDate", returnDate);
    }
    query.set(
      "passengers",
      `${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}${passengers.children ? `, ${passengers.children} Child` : ""}${passengers.infants ? `, ${passengers.infants} Infant` : ""}`,
    );
    query.set("cabinClass", cabinClass);
    window.location.href = `/inquire?${query.toString()}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Flight search">
      {/* Top Controls: Trip Type + Passenger & Cabin Class Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
        <Tabs
          value={tripType}
          onValueChange={(val) => {
            setTripType(val as TripType);
            setError(null);
          }}
        >
          <TabsList className="bg-slate-100/90 p-1 rounded-full h-9">
            <TabsTrigger
              value="roundtrip"
              className="rounded-full px-3 py-1 text-xs font-semibold data-[state=active]:bg-brand-orange data-[state=active]:text-white transition-all"
            >
              Round Trip
            </TabsTrigger>
            <TabsTrigger
              value="oneway"
              className="rounded-full px-3 py-1 text-xs font-semibold data-[state=active]:bg-brand-orange data-[state=active]:text-white transition-all"
            >
              One Way
            </TabsTrigger>
            <TabsTrigger
              value="multicity"
              className="rounded-full px-3 py-1 text-xs font-semibold data-[state=active]:bg-brand-orange data-[state=active]:text-white transition-all"
            >
              Multi-City
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {/* Passenger Selector Popup */}
          <PassengerSelector value={passengers} onChange={setPassengers} />

          {/* Cabin Class Selector */}
          <Select value={cabinClass} onValueChange={setCabinClass}>
            <SelectTrigger className="h-9 px-3 rounded-full text-xs font-medium border-slate-200 bg-white text-slate-700 w-32 shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map((cabin) => (
                <SelectItem key={cabin} value={cabin} className="text-xs">
                  {cabin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Search Inputs */}
      {tripType !== "multicity" ? (
        <div
          className={`grid gap-2.5 ${
            tripType === "roundtrip"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {/* 1. Origin Airport */}
          <div>
            <Label htmlFor="flight-from" className="text-[11px] font-bold text-slate-700 mb-1 block">
              From (Origin)
            </Label>
            <AirportCombobox
              id="flight-from"
              placeholder="Origin airport or city..."
              value={from}
              onChange={setFrom}
            />
          </div>

          {/* 2. Destination Airport */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="flight-to" className="text-[11px] font-bold text-slate-700">
                To (Destination)
              </Label>
              {from && to && (
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="text-[10px] text-brand-orange hover:underline font-semibold flex items-center gap-0.5"
                  title="Swap airports"
                >
                  <ArrowRightLeft className="size-2.5" /> Swap
                </button>
              )}
            </div>
            <AirportCombobox
              id="flight-to"
              placeholder="Destination airport or city..."
              value={to}
              onChange={setTo}
            />
          </div>

          {/* 3. Departure Date */}
          <div>
            <Label htmlFor="flight-depart" className="text-[11px] font-bold text-slate-700 mb-1 block">
              Departure Date
            </Label>
            <Input
              id="flight-depart"
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium shadow-2xs"
            />
          </div>

          {/* 4. Return Date (Only for Round Trip) */}
          {tripType === "roundtrip" && (
            <div>
              <Label htmlFor="flight-return" className="text-[11px] font-bold text-slate-700 mb-1 block">
                Return Date
              </Label>
              <Input
                id="flight-return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium shadow-2xs"
              />
            </div>
          )}
        </div>
      ) : (
        /* Multi-City Leg Rows */
        <div className="space-y-2.5">
          {multiCityLegs.map((leg, index) => (
            <div
              key={index}
              className="grid gap-2.5 grid-cols-1 sm:grid-cols-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 relative"
            >
              <div>
                <Label className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Flight {index + 1} Origin
                </Label>
                <AirportCombobox
                  placeholder="Origin airport..."
                  value={leg.from}
                  onChange={(val) => updateMultiCityLeg(index, { from: val })}
                />
              </div>
              <div>
                <Label className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Flight {index + 1} Destination
                </Label>
                <AirportCombobox
                  placeholder="Destination airport..."
                  value={leg.to}
                  onChange={(val) => updateMultiCityLeg(index, { to: val })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-[11px] font-bold text-slate-700">
                    Departure Date
                  </Label>
                  {multiCityLegs.length > MIN_LEGS && (
                    <button
                      type="button"
                      onClick={() => setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index))}
                      className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <Trash2 className="size-2.5" /> Remove
                    </button>
                  )}
                </div>
                <Input
                  type="date"
                  value={leg.departDate}
                  onChange={(e) => updateMultiCityLeg(index, { departDate: e.target.value })}
                  className="h-10 rounded-xl bg-white border-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          ))}

          {multiCityLegs.length < MAX_LEGS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold text-slate-700 h-8"
              onClick={() => setMultiCityLegs([...multiCityLegs, { from: "", to: "", departDate: "" }])}
            >
              <Plus className="size-3.5 mr-1" /> Add Another Flight ({multiCityLegs.length}/{MAX_LEGS})
            </Button>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs text-rose-600 font-medium">
          {error}
        </p>
      )}

      {/* Action CTA Button */}
      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange-hover font-bold text-white shadow-md flex items-center justify-center gap-2 text-sm transition-all mt-1"
      >
        <Search className="size-4" />
        <span>Search Flights & Lowest Fares</span>
      </Button>
    </form>
  );
}
