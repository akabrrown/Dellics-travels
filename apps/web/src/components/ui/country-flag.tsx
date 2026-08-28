"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  alt?: string;
}

export function CountryFlag({ countryCode, className, alt }: CountryFlagProps) {
  const [error, setError] = useState(false);
  const code = (countryCode || "GH").toLowerCase();

  if (error) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-bold text-[10px] bg-slate-200 text-slate-700 rounded-xs px-1",
          className,
        )}
      >
        {countryCode.toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden rounded-xs shrink-0 shadow-2xs border border-black/10 align-middle",
        className || "w-5 h-3.5",
      )}
    >
      <img
        src={`https://flagcdn.com/${code}.svg`}
        alt={alt || `${countryCode} flag`}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setError(true)}
      />
    </span>
  );
}
