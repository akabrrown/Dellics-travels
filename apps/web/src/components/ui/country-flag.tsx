"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  alt?: string;
}

const NAME_TO_ISO2: Record<string, string> = {
  ghana: "GH",
  nigeria: "NG",
  "united kingdom": "GB",
  uk: "GB",
  england: "GB",
  "united states": "US",
  usa: "US",
  "united arab emirates": "AE",
  uae: "AE",
  dubai: "AE",
  canada: "CA",
  "south africa": "ZA",
  germany: "DE",
  france: "FR",
  kenya: "KE",
  rwanda: "RW",
  tanzania: "TZ",
  zanzibar: "TZ",
  uganda: "UG",
  china: "CN",
  india: "IN",
  japan: "JP",
  australia: "AU",
  brazil: "BR",
  italy: "IT",
  spain: "ES",
  netherlands: "NL",
  switzerland: "CH",
  turkey: "TR",
  egypt: "EG",
  morocco: "MA",
  singapore: "SG",
  qatar: "QA",
  "saudi arabia": "SA",
};

export function normalizeCountryCode(input: string): string {
  if (!input) return "GH";
  const trimmed = input.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const lower = trimmed.toLowerCase();
  if (NAME_TO_ISO2[lower]) return NAME_TO_ISO2[lower];
  return trimmed.slice(0, 2).toUpperCase() || "GH";
}

export function getFlagEmoji(countryCode: string): string {
  const code = normalizeCountryCode(countryCode);
  if (!code || code.length !== 2) return "🌐";
  try {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

export function CountryFlag({ countryCode, className, alt }: CountryFlagProps) {
  const [imgError, setImgError] = useState(false);
  const iso2 = normalizeCountryCode(countryCode);
  const lower = iso2.toLowerCase();
  const emoji = getFlagEmoji(iso2);

  // Reset error whenever the country code changes
  useEffect(() => {
    setImgError(false);
  }, [countryCode]);

  if (imgError) {
    return (
      <span
        key={iso2}
        className={cn(
          "inline-flex items-center justify-center select-none shrink-0 font-normal leading-none",
          className || "text-sm",
        )}
        title={alt || `${iso2} flag`}
        aria-label={alt || `${iso2} flag`}
      >
        {emoji}
      </span>
    );
  }

  return (
    <span
      key={iso2}
      suppressHydrationWarning
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xs shrink-0 shadow-2xs border border-black/10 align-middle bg-slate-100",
        className || "w-5 h-3.5",
      )}
    >
      <img
        key={lower}
        suppressHydrationWarning
        src={`https://flagcdn.com/${lower}.svg`}
        alt={alt || `${iso2} flag`}
        className="w-full h-full object-cover"
        loading="eager"
        onError={() => setImgError(true)}
      />
    </span>
  );
}
