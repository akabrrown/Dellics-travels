"use client";

import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  PASSENGER_LIMITS,
  clampCount,
  formatPassengers,
  totalTravellers,
  type PassengerCounts,
  type PassengerGroup,
} from "@/lib/passengers";

const GROUPS: { key: PassengerGroup; label: string; hint: string }[] = [
  { key: "adults", label: "Adults", hint: "12+ years" },
  { key: "children", label: "Children", hint: "2–11 years" },
  { key: "infants", label: "Infants", hint: "Under 2 years" },
];

const MAX_SEATS = 9; // cabin seat cap: adults + children

interface PassengerSelectorProps {
  value: PassengerCounts;
  onChange: (next: PassengerCounts) => void;
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  function adjust(group: PassengerGroup, delta: number) {
    const next = clampCount(group, value[group] + delta);
    if (group !== "infants" && next > value[group] && totalTravellers({ ...value, [group]: next }) > MAX_SEATS) {
      return; // seat cap reached
    }
    onChange({ ...value, [group]: next });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 px-3 rounded-full text-xs font-medium border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 flex items-center gap-1.5">
          <Users className="size-3.5 text-slate-500" aria-hidden />
          <span>{formatPassengers(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        {GROUPS.map((group) => (
          <div key={group.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">{group.label}</p>
              <p className="text-xs text-slate-body">{group.hint}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Decrease ${group.label}`}
                disabled={value[group.key] <= PASSENGER_LIMITS[group.key].min}
                onClick={() => adjust(group.key, -1)}
              >
                <Minus />
              </Button>
              <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{value[group.key]}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Increase ${group.label}`}
                disabled={value[group.key] >= PASSENGER_LIMITS[group.key].max}
                onClick={() => adjust(group.key, 1)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        ))}
        <p className="mt-2 text-xs text-slate-body">Maximum {MAX_SEATS} seated travellers per booking.</p>
      </PopoverContent>
    </Popover>
  );
}
