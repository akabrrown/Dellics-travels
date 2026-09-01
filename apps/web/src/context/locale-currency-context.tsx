"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { normalizeCountryCode, getFlagEmoji } from "@/components/ui/country-flag";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: string;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: "GH", name: "Ghana", flag: "🇬🇭", defaultCurrency: "GHS" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", defaultCurrency: "NGN" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", defaultCurrency: "GBP" },
  { code: "US", name: "United States", flag: "🇺🇸", defaultCurrency: "USD" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", defaultCurrency: "AED" },
  { code: "CA", name: "Canada", flag: "🇨🇦", defaultCurrency: "CAD" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", defaultCurrency: "ZAR" },
  { code: "DE", name: "Germany", flag: "🇩🇪", defaultCurrency: "EUR" },
  { code: "FR", name: "France", flag: "🇫🇷", defaultCurrency: "EUR" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", defaultCurrency: "KES" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", defaultCurrency: "RWF" },
];

export const CURRENCIES: CurrencyOption[] = [
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
];

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", name: "English", nativeName: "English" },
  { code: "FR", name: "French", nativeName: "Français" },
];

interface LocaleCurrencyContextType {
  language: string;
  country: CountryOption;
  countries: CountryOption[];
  currency: CurrencyOption;
  currencies: CurrencyOption[];
  rates: Record<string, number>;
  loading: boolean;
  setLanguage: (langCode: string) => void;
  setCountry: (countryCode: string) => void;
  setCurrency: (currencyCode: string) => void;
  convertPrice: (amountUSD: number) => number;
  formatPrice: (amountUSD: number) => string;
}

const STORAGE_KEY = "dellics_regional_preferences";

const DEFAULT_COUNTRY = DEFAULT_COUNTRIES[0] as CountryOption;
const DEFAULT_CURRENCY = CURRENCIES[0] as CurrencyOption;

const LocaleCurrencyContext = createContext<LocaleCurrencyContextType | null>(null);

export function LocaleCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("EN");
  const [country, setCountryState] = useState<CountryOption>(DEFAULT_COUNTRY);
  const [countries, setCountries] = useState<CountryOption[]>(DEFAULT_COUNTRIES);
  const [currency, setCurrencyState] = useState<CurrencyOption>(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1.0,
    GHS: 15.5,
    GBP: 0.78,
    EUR: 0.92,
    NGN: 1580.0,
    AED: 3.67,
    CAD: 1.38,
    ZAR: 18.2,
    KES: 130.0,
    RWF: 1350.0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Initial Load: Stored preferences, Geo IP Detection, Live Countries API, and Live Rates API
  useEffect(() => {
    let hasSavedPreference = false;

    // Check stored user preferences first
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.countryCode) {
          const match = DEFAULT_COUNTRIES.find((c) => c.code === parsed.countryCode);
          if (match) setCountryState(match);
        }
        if (parsed.currencyCode) {
          const match = CURRENCIES.find((c) => c.code === parsed.currencyCode);
          if (match) setCurrencyState(match);
        }
        hasSavedPreference = true;
      }
    } catch {}

    // A. Fetch Live Countries List via API
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const uniqueCountries: CountryOption[] = [];
          const seen = new Set<string>();
          for (const item of data.data) {
            if (item?.code && !seen.has(item.code)) {
              seen.add(item.code);
              uniqueCountries.push(item);
            }
          }
          setCountries(uniqueCountries);
          // If we had a saved country code, update with enriched API object
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
              const parsed = JSON.parse(saved);
              const found = uniqueCountries.find((c: CountryOption) => c.code === parsed.countryCode);
              if (found) setCountryState(found);
            }
          } catch {}
        }
      })
      .catch((err) => console.error("Countries API error:", err));

    // B. Fetch Live FX Exchange Rates via API
    fetch("/api/currency/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => console.error("FX Rates API error:", err));

    // C. Auto-detect Country & Currency via Live Geo API if user hasn't set custom preference
    if (!hasSavedPreference) {
      fetch("/api/geo")
        .then((res) => res.json())
        .then((geo) => {
          if (geo?.country) {
            const matchedCountry = DEFAULT_COUNTRIES.find((c) => c.code === geo.country);
            if (matchedCountry) {
              setCountryState(matchedCountry);
            }
            if (geo.currency) {
              const matchedCurr = CURRENCIES.find((c) => c.code === geo.currency);
              if (matchedCurr) {
                setCurrencyState(matchedCurr);
              }
            }
          }
        })
        .catch((err) => console.error("Geo auto-detect error:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const savePreferences = (newLang: string, newCountry: CountryOption, newCurr: CurrencyOption) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          language: newLang,
          countryCode: newCountry.code,
          currencyCode: newCurr.code,
        }),
      );
    } catch {}
  };

  const setLanguage = (langCode: string) => {
    setLanguageState(langCode);
    savePreferences(langCode, country, currency);
  };

  const setCountry = (countryCode: string) => {
    const raw = (countryCode || "").trim();
    const iso2 = normalizeCountryCode(raw);
    const upperRaw = raw.toUpperCase();
    const lowerRaw = raw.toLowerCase();

    const match =
      countries.find(
        (c) =>
          c.code.toUpperCase() === iso2 ||
          c.code.toUpperCase() === upperRaw ||
          c.name.toLowerCase() === lowerRaw,
      ) ||
      DEFAULT_COUNTRIES.find(
        (c) =>
          c.code.toUpperCase() === iso2 ||
          c.code.toUpperCase() === upperRaw ||
          c.name.toLowerCase() === lowerRaw,
      );

    const countryObj: CountryOption = match || {
      code: iso2,
      name: raw || iso2,
      flag: getFlagEmoji(iso2),
      defaultCurrency: currency.code || "USD",
    };

    setCountryState(countryObj);

    // Automatically map to currency if available in currency options
    const matchedCurrency =
      CURRENCIES.find((c) => c.code === countryObj.defaultCurrency) || currency;
    setCurrencyState(matchedCurrency);
    savePreferences(language, countryObj, matchedCurrency);
  };

  const setCurrency = (currencyCode: string) => {
    const match = CURRENCIES.find((c) => c.code === currencyCode);
    if (match) {
      setCurrencyState(match);
      savePreferences(language, country, match);
    }
  };

  const convertPrice = (amountUSD: number): number => {
    const rate = rates[currency.code] || 1.0;
    return amountUSD * rate;
  };

  const formatPrice = (amountUSD: number): string => {
    const converted = convertPrice(amountUSD);
    const formattedNum = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
    return `${currency.symbol}${formattedNum}`;
  };

  return (
    <LocaleCurrencyContext.Provider
      value={{
        language,
        country,
        countries,
        currency,
        currencies: CURRENCIES,
        rates,
        loading,
        setLanguage,
        setCountry,
        setCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </LocaleCurrencyContext.Provider>
  );
}

export function useLocaleCurrency() {
  const context = useContext(LocaleCurrencyContext);
  if (!context) {
    throw new Error("useLocaleCurrency must be used within a LocaleCurrencyProvider");
  }
  return context;
}
