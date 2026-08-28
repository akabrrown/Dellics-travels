"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plane, Search, Check, ChevronDown, Loader2, X } from "lucide-react";
import type { AirportPlace } from "@/types/airports";


interface AirportComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function AirportCombobox({
  value,
  onChange,
  placeholder = "Search airport or city (e.g. Accra, London, JFK)...",
  className = "",
  id,
}: AirportComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AirportPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch initial popular airports or live query results
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = query.trim()
          ? `/api/airports?q=${encodeURIComponent(query.trim())}`
          : "/api/airports";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (active && data.airports) {
            setResults(data.airports);
          }
        }
      } catch (err) {
        console.error("Failed to query airports:", err);
      } finally {
        if (active) setLoading(false);
      }
    }, query ? 250 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (airport: AirportPlace) => {
    onChange(airport.fullLabel);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Combobox Trigger Field */}
      <div
        onClick={() => setIsOpen(true)}
        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 bg-white ${
          isOpen
            ? "border-navy ring-2 ring-navy/10"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <Plane className="size-4 text-brand-orange shrink-0" />
          <span className="text-sm font-medium text-slate-800 truncate">
            {value || <span className="text-slate-400 font-normal">{placeholder}</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="p-1 hover:text-slate-600 rounded-md transition-colors"
              title="Clear selection"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-navy" : ""
            }`}
          />
        </div>
      </div>

      {/* Floating Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-150">
          {/* Live Search Input */}
          <div className="p-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Search className="size-4 text-slate-400 shrink-0 ml-1" />
            <input
              id={id}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type city or airport code (e.g. ACC, DXB, London)..."
              autoFocus
              className="w-full bg-transparent text-xs font-medium outline-none text-navy placeholder:text-slate-400 py-1"
            />
            {loading && <Loader2 className="size-3.5 text-brand-orange animate-spin shrink-0 mr-1" />}
          </div>

          {/* Results List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {results.length > 0 ? (
              results.map((airport) => {
                const isSelected = value === airport.fullLabel;
                return (
                  <button
                    key={`${airport.code}_${airport.name}`}
                    type="button"
                    onClick={() => handleSelect(airport)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-orange-50 text-brand-orange font-bold"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-navy text-white text-[10px] font-mono font-bold tracking-wider shrink-0">
                          {airport.code}
                        </span>
                        <p className="text-xs font-bold text-navy truncate">
                          {airport.city} {airport.country ? `· ${airport.country}` : ""}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate pl-0.5">
                        {airport.name}
                      </p>
                    </div>

                    {isSelected && <Check className="size-4 text-brand-orange shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 px-4 text-center space-y-1 text-slate-400">
                <p className="text-xs font-semibold">
                  {loading ? "Searching live airport directory..." : "No airports matching your search"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching by 3-letter IATA code or city name.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
