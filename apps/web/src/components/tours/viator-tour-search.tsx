"use client";

import { useState } from "react";
import { Search, Compass, ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildViatorUrl } from "@/lib/tours";

const POPULAR_DESTINATIONS = [
  "Dubai",
  "Cape Town",
  "Paris",
  "Zanzibar",
  "Rome",
  "Tokyo",
  "New York",
  "London",
  "Ghana",
  "Bali",
];

export function ViatorTourSearch() {
  const [destination, setDestination] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = destination.trim() || "Tours and Activities";
    window.open(buildViatorUrl(query), "_blank", "noopener,noreferrer");
  };

  const handleQuickDestination = (dest: string) => {
    setDestination(dest);
    window.open(buildViatorUrl(dest), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white/85 backdrop-blur-xl p-4 sm:p-6 shadow-2xl border border-white/60 ring-1 ring-black/5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/15 px-3 py-0.5 text-xs font-bold text-brand-orange">
            <Compass className="size-3.5" />
            <span>Global Experiences · 300,000+ Curated Tours Worldwide</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-navy mt-1.5">
            Find Any Global Tour, Excursion or Day Trip
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Search 300,000+ curated activities with instant booking and free cancellation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search by city or attraction (e.g. Dubai Desert Safari, Cape Town, Paris Louvre, Rome Colosseum)..."
            className="h-11 pl-10 rounded-xl bg-white/90 border-slate-200 text-xs sm:text-sm font-medium focus:bg-white shadow-2xs"
          />
        </div>

        <Button
          type="submit"
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Explore Tours</span>
          <ExternalLink className="size-4" />
        </Button>
      </form>

      {/* Popular Destination Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <TrendingUp className="size-3 text-brand-orange" />
          Popular:
        </span>
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest}
            type="button"
            onClick={() => handleQuickDestination(dest)}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-brand-orange/10 hover:text-brand-orange transition-colors"
          >
            {dest}
          </button>
        ))}
      </div>
    </div>
  );
}
