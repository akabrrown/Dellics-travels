"use client";

import React, { useState } from "react";
import { ChevronDown, Globe, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useLocaleCurrency,
  LANGUAGES,
} from "@/context/locale-currency-context";
import { cn } from "@/lib/utils";

interface RegionalSelectorProps {
  variant?: "header" | "announcement" | "mobile";
  className?: string;
}

export function RegionalSelector({ variant = "announcement", className }: RegionalSelectorProps) {
  const [open, setOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const {
    language,
    country,
    countries,
    currency,
    currencies,
    setLanguage,
    setCountry,
    setCurrency,
  } = useLocaleCurrency();

  const filteredCountries = countrySearch.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.toLowerCase().includes(countrySearch.toLowerCase()),
      )
    : countries;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group inline-flex items-center gap-1.5 font-medium transition-colors outline-none cursor-pointer select-none",
            variant === "announcement"
              ? "text-[11px] sm:text-xs text-white/90 hover:text-brand-orange"
              : variant === "header"
                ? "text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/15"
                : "text-sm text-slate-700 hover:text-navy justify-between w-full p-2 rounded-lg bg-slate-50",
            className,
          )}
          aria-label="Change Language, Country, or Currency"
        >
          <span className="font-semibold tracking-wide uppercase">{language}</span>
          <span className="text-white/40">|</span>
          <span className="inline-flex items-center gap-1">
            <span className="text-sm leading-none">{country.flag}</span>
            <span className="font-semibold">{country.code}</span>
          </span>
          <span className="text-white/40">|</span>
          <span className="font-semibold">{currency.code}</span>
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200 opacity-80 group-hover:opacity-100",
              open && "rotate-180 text-brand-orange",
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-80 p-0 bg-white rounded-xl shadow-2xl border border-slate-200/80 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-150 z-50 overflow-hidden"
      >
        <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* 1. Change Language */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-language"
              className="block text-xs font-bold text-slate-900 tracking-tight"
            >
              Change Language
            </label>
            <div className="relative">
              <select
                id="select-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy pr-8 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* 2. Change Country (Live API list with search) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-country"
                className="block text-xs font-bold text-slate-900 tracking-tight"
              >
                Change Country
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                {countries.length} live
              </span>
            </div>
            <div className="relative">
              <select
                id="select-country"
                value={country.code}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy pr-8 cursor-pointer"
              >
                {filteredCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* 3. Change Currency (Live Exchange Rate mapped) */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-currency"
              className="block text-xs font-bold text-slate-900 tracking-tight"
            >
              Change Currency
            </label>
            <div className="relative">
              <select
                id="select-currency"
                value={currency.code}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy pr-8 cursor-pointer"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.symbol} ({curr.name})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Live Status Strip */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Globe className="size-3 text-emerald-500 animate-pulse" />
            Live IP & FX sync active
          </span>
          <span className="font-semibold text-brand-orange">{currency.code}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
