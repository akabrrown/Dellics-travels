"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export const COUNTRIES: CountryOption[] = [
  { code: "GH", name: "Ghana", flag: "🇬🇭", defaultCurrency: "GHS" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", defaultCurrency: "NGN" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", defaultCurrency: "GBP" },
  { code: "US", name: "United States", flag: "🇺🇸", defaultCurrency: "USD" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", defaultCurrency: "AED" },
  { code: "CA", name: "Canada", flag: "🇨🇦", defaultCurrency: "CAD" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", defaultCurrency: "ZAR" },
  { code: "DE", name: "Germany (EU)", flag: "🇩🇪", defaultCurrency: "EUR" },
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
];

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", name: "English", nativeName: "English" },
  { code: "FR", name: "French", nativeName: "Français" },
];

interface LocaleCurrencyContextType {
  language: string;
  country: CountryOption;
  currency: CurrencyOption;
  rates: Record<string, number>;
  setLanguage: (langCode: string) => void;
  setCountry: (countryCode: string) => void;
  setCurrency: (currencyCode: string) => void;
  convertPrice: (amountUSD: number) => number;
  formatPrice: (amountUSD: number) => string;
}

const STORAGE_KEY = "dellics_regional_preferences";

const DEFAULT_COUNTRY = COUNTRIES[0] as CountryOption;
const DEFAULT_CURRENCY = CURRENCIES[0] as CurrencyOption;

const LocaleCurrencyContext = createContext<LocaleCurrencyContextType | null>(null);

export function LocaleCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("EN");
  const [country, setCountryState] = useState<CountryOption>(DEFAULT_COUNTRY);
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
  });

  // 1. Hydrate from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.countryCode) {
          const match = COUNTRIES.find((c) => c.code === parsed.countryCode);
          if (match) setCountryState(match);
        }
        if (parsed.currencyCode) {
          const match = CURRENCIES.find((c) => c.code === parsed.currencyCode);
          if (match) setCurrencyState(match);
        }
      }
    } catch {}

    // 2. Fetch live FX rates from live endpoint
    fetch("/api/currency/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => console.error("Error fetching live FX rates:", err));
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
    const match = COUNTRIES.find((c) => c.code === countryCode);
    if (match) {
      setCountryState(match);
      // Automatically adapt default currency of country if needed
      const matchedCurrency = CURRENCIES.find((c) => c.code === match.defaultCurrency) || currency;
      setCurrencyState(matchedCurrency);
      savePreferences(language, match, matchedCurrency);
    }
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
        currency,
        rates,
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
