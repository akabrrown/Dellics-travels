"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, MapPin, Calendar, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PICKUP_POINTS = [
  "Kotoka Int. Airport (ACC) - Terminal 3 Arrivals",
  "Kotoka Int. Airport (ACC) - Terminal 2 Domestic",
  "Kempinski Hotel Gold Coast City Accra",
  "Mövenpick Ambassador Hotel Accra",
  "Accra Marriott Hotel (Airport City)",
  "Labadi Beach Hotel",
  "East Legon / Adjiringanor Residence",
  "Cantonments / Airport Residential Area",
  "Tema / Community 1–25",
  "Cape Coast / Elmina Region",
  "Takoradi / Western Region",
  "Kumasi / Ashanti Region",
];

const VEHICLE_TYPES = [
  { id: "sedan", name: "Executive Sedan (1–3 Passengers, 2 Bags)" },
  { id: "suv", name: "Luxury 4x4 SUV (1–4 Passengers, 4 Bags)" },
  { id: "van", name: "VIP Executive Van (7–15 Passengers, 10+ Bags)" },
  { id: "coach", name: "Luxury Tour Coach (16–30+ Passengers, Full Bay)" },
];

export function TransferSearchWidget() {
  const router = useRouter();
  const [pickup, setPickup] = useState(PICKUP_POINTS[0] ?? "");
  const [dropoff, setDropoff] = useState(PICKUP_POINTS[2] ?? "");
  const [date, setDate] = useState("");
  const [vehicle, setVehicle] = useState(VEHICLE_TYPES[0]?.id ?? "sedan");

  function handleTransferSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("service", "airport_transfer");
    if (pickup) query.set("pickup", pickup);
    if (dropoff) query.set("dropoff", dropoff);
    if (date) query.set("date", date);
    if (vehicle) query.set("vehicle", vehicle);
    router.push(`/inquire?${query.toString()}`);
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white/85 backdrop-blur-xl p-4 sm:p-5 shadow-2xl border border-white/60 ring-1 ring-black/5 text-left">
      <form onSubmit={handleTransferSubmit} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-bold text-brand-orange">
            <Car className="size-3.5" />
            <span>Kotoka ACC Airport Transfers & Executive Chauffeuring</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            Live Delay Flight Tracking Included
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Pickup */}
          <div>
            <Label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1">
              <MapPin className="size-3 text-brand-orange" />
              Pickup Location
            </Label>
            <Select value={pickup} onValueChange={setPickup}>
              <SelectTrigger className="h-10 rounded-xl bg-white/90 border-slate-200 text-xs font-medium focus:bg-white shadow-2xs">
                <SelectValue placeholder="Select Pickup Location" />
              </SelectTrigger>
              <SelectContent>
                {PICKUP_POINTS.map((point) => (
                  <SelectItem key={point} value={point} className="text-xs">
                    {point}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropoff */}
          <div>
            <Label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1">
              <MapPin className="size-3 text-slate-400" />
              Drop-off Destination
            </Label>
            <Select value={dropoff} onValueChange={setDropoff}>
              <SelectTrigger className="h-10 rounded-xl bg-white/90 border-slate-200 text-xs font-medium focus:bg-white shadow-2xs">
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent>
                {PICKUP_POINTS.map((point) => (
                  <SelectItem key={point} value={point} className="text-xs">
                    {point}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1">
              <Calendar className="size-3 text-slate-400" />
              Pickup Date & Time
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-xl bg-white/90 border-slate-200 text-xs font-medium focus:bg-white shadow-2xs"
            />
          </div>

          {/* Vehicle Class */}
          <div>
            <Label className="text-[11px] font-bold text-slate-700 mb-1 block flex items-center gap-1">
              <Car className="size-3 text-slate-400" />
              Vehicle Category
            </Label>
            <Select value={vehicle} onValueChange={setVehicle}>
              <SelectTrigger className="h-10 rounded-xl bg-white/90 border-slate-200 text-xs font-medium focus:bg-white shadow-2xs">
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((v) => (
                  <SelectItem key={v.id} value={v.id} className="text-xs">
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto h-10 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Reserve Airport Transfer</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
