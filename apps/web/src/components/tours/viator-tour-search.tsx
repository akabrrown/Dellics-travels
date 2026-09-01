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
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200/80 mb-16">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
            <Compass className="size-3.5" />
            <span>Viator Partner Integration · 300,000+ Experiences Worldwide</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-navy mt-2">
            Find Any Global Tour, Excursion or Activity
          </h2>
          <p className="text-sm text-slate-600">
            Start your search here on Dellics Travels — we connect you directly to verified Viator experiences with free cancellation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <Input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter any city or attraction (e.g. Dubai Desert Safari, Cape Town, Paris Louvre, Rome Colosseum)..."
            className="h-12 pl-12 rounded-2xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>Search on Viator</span>
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
