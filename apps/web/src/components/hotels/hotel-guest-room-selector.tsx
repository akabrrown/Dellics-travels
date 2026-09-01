"use client";

import React, { useState } from "react";
import { Users, ChevronDown, Minus, Plus, Bed, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface HotelGuestsRooms {
  adults: number;
  children: number;
  rooms: number;
  roomType?: string;
}

interface HotelGuestRoomSelectorProps {
  value: HotelGuestsRooms;
  onChange: (val: HotelGuestsRooms) => void;
  className?: string;
  showRoomType?: boolean;
}

const ROOM_TIERS = [
  "Economy",
  "Standard",
  "Deluxe Room",
  "Executive Suite",
  "Family Suite",
];

export function HotelGuestRoomSelector({
  value,
  onChange,
  className = "",
  showRoomType = true,
}: HotelGuestRoomSelectorProps) {
  const [open, setOpen] = useState(false);

  const updateCount = (
    field: "adults" | "children" | "rooms",
    delta: number,
    min: number,
    max: number,
  ) => {
    const current = value[field] || 0;
    const next = Math.min(Math.max(current + delta, min), max);
    onChange({ ...value, [field]: next });
  };

  const setRoomType = (type: string) => {
    onChange({ ...value, roomType: type });
  };

  // Format label: "1 Adult", "2 Adults", "2 Adults, 1 Child", etc.
  const formatGuestsLabel = () => {
    const adults = value.adults || 1;
    const children = value.children || 0;
    let label = `${adults} Adult${adults > 1 ? "s" : ""}`;
    if (children > 0) {
      label += `, ${children} Child${children > 1 ? "ren" : ""}`;
    }
    return label;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 1. Guests Popover Pill (matches image: rounded capsule with Users icon) */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3.5 rounded-full text-xs font-medium border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 transition-all"
          >
            <Users className="size-3.5 text-slate-500 shrink-0" />
            <span className="font-medium text-slate-800">{formatGuestsLabel()}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4 rounded-2xl shadow-xl border-slate-200/90" align="start">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="font-display text-sm font-bold text-navy">
                Guests & Rooms
              </h4>
              <p className="text-[11px] text-slate-500">
                Select travelers and room requirements
              </p>
            </div>

            {/* Adults Counter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Adults</p>
                <p className="text-[11px] text-slate-500">Ages 18 and above</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={value.adults <= 1}
                  onClick={() => updateCount("adults", -1, 1, 10)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-5 text-center text-xs font-bold text-navy">
                  {value.adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={value.adults >= 10}
                  onClick={() => updateCount("adults", 1, 1, 10)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            {/* Children Counter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Children</p>
                <p className="text-[11px] text-slate-500">Ages 0 to 17</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={value.children <= 0}
                  onClick={() => updateCount("children", -1, 0, 6)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-5 text-center text-xs font-bold text-navy">
                  {value.children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={value.children >= 6}
                  onClick={() => updateCount("children", 1, 0, 6)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            {/* Rooms Counter */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Rooms</p>
                <p className="text-[11px] text-slate-500">Total rooms required</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={value.rooms <= 1}
                  onClick={() => updateCount("rooms", -1, 1, 8)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-5 text-center text-xs font-bold text-navy">
                  {value.rooms}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={value.rooms >= 8}
                  onClick={() => updateCount("rooms", 1, 1, 8)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-8 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold mt-2"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 2. Room Tier / Category Pill with Chevron (matches image: Economy / Standard with ChevronDown) */}
      {showRoomType && (
        <Select
          value={value.roomType || "Standard"}
          onValueChange={(val) => setRoomType(val)}
        >
          <SelectTrigger className="h-9 px-3.5 rounded-full text-xs font-medium border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Economy" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-200/90 shadow-xl">
            {ROOM_TIERS.map((tier) => (
              <SelectItem key={tier} value={tier} className="text-xs font-medium cursor-pointer">
                {tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
