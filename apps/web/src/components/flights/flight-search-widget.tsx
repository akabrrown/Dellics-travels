"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PassengerSelector } from "./passenger-selector";
import { buildWhatsAppLink, composeFlightMessage, type FlightLeg, type TripType } from "@/lib/whatsapp";
import type { PassengerCounts } from "@/lib/passengers";

const CLASSES = ["Economy", "Premium Economy", "Business", "First"];
const MIN_LEGS = 2;
const MAX_LEGS = 7;

function emptyLeg(): FlightLeg {
  return { from: "", to: "", departDate: "" };
}

export function FlightSearchWidget() {
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [legs, setLegs] = useState<FlightLeg[]>([emptyLeg(), emptyLeg()]);
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [error, setError] = useState<string | null>(null);

  const visibleLegs = tripType === "oneway" ? legs.slice(0, 1) : tripType === "roundtrip" ? legs.slice(0, 2) : legs;

  function updateLeg(index: number, patch: Partial<FlightLeg>) {
    setLegs((prev) => prev.map((leg, i) => (i === index ? { ...leg, ...patch } : leg)));
  }

  function syncLegCount(nextType: TripType) {
    setTripType(nextType);
    setError(null);
    if (nextType === "multicity" && legs.length < MIN_LEGS) setLegs(Array.from({ length: MIN_LEGS }, emptyLeg));
    if (nextType !== "multicity" && legs.length > 2) setLegs(legs.slice(0, 2));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    for (const [index, leg] of visibleLegs.entries()) {
      if (!leg.from.trim() || !leg.to.trim() || !leg.departDate) {
        setError(
          tripType === "multicity"
            ? `Please complete all fields for leg ${index + 1}.`
            : "Please complete all trip fields before continuing.",
        );
        return;
      }
    }
    setError(null);
    const link = buildWhatsAppLink(composeFlightMessage({ tripType, legs: visibleLegs, passengers, cabinClass }));
    window.location.href = link; // same-tab handoff, identical to legacy behavior
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-white p-6 shadow-xl" aria-label="Flight search">
      <Tabs value={tripType} onValueChange={(value) => syncLegCount(value as TripType)}>
        <TabsList className="rounded-field">
          <TabsTrigger value="roundtrip" className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">Round Trip</TabsTrigger>
          <TabsTrigger value="oneway" className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">One Way</TabsTrigger>
          <TabsTrigger value="multicity" className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">Multi-City</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-4">
        {visibleLegs.map((leg, index) => (
          <fieldset key={index} className="grid gap-3 rounded-field border border-black/5 p-4 sm:grid-cols-3">
            {tripType === "multicity" ? <legend className="px-1 text-sm font-semibold text-navy">Leg {index + 1}</legend> : null}
            <div>
              <Label htmlFor={`from-${index}`}>From</Label>
              <Input id={`from-${index}`} placeholder="e.g. Accra" value={leg.from} onChange={(e) => updateLeg(index, { from: e.target.value })} />
            </div>
            <div>
              <Label htmlFor={`to-${index}`}>To</Label>
              <Input id={`to-${index}`} placeholder="e.g. Dubai" value={leg.to} onChange={(e) => updateLeg(index, { to: e.target.value })} />
            </div>
            <div>
              <Label htmlFor={`date-${index}`}>Departure</Label>
              <Input id={`date-${index}`} type="date" value={leg.departDate} onChange={(e) => updateLeg(index, { departDate: e.target.value })} />
            </div>
            {tripType === "multicity" && legs.length > MIN_LEGS ? (
              <Button type="button" variant="ghost" size="sm" className="justify-self-start text-alert" onClick={() => setLegs(legs.filter((_, i) => i !== index))}>
                <Trash2 className="mr-1 size-4" /> Remove leg
              </Button>
            ) : null}
          </fieldset>
        ))}

        {tripType === "multicity" && legs.length < MAX_LEGS ? (
          <Button type="button" variant="outline" className="rounded-pill" onClick={() => setLegs([...legs, emptyLeg()])}>
            <Plus className="mr-1 size-4" /> Add leg ({legs.length}/{MAX_LEGS})
          </Button>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Passengers</Label>
            <PassengerSelector value={passengers} onChange={setPassengers} />
          </div>
          <div>
            <Label>Cabin class</Label>
            <Select value={cabinClass} onValueChange={setCabinClass}>
              <SelectTrigger className="h-10 rounded-field"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLASSES.map((cabin) => <SelectItem key={cabin} value={cabin}>{cabin}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-field bg-alert-tint px-4 py-2 text-sm text-alert">{error}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full rounded-pill bg-brand-orange hover:bg-brand-orange/90">
          Continue on WhatsApp
        </Button>
        <p className="text-center text-xs text-slate-body">
          Your trip summary opens in WhatsApp — our agents reply with live options and fares.
        </p>
      </div>
    </form>
  );
}
