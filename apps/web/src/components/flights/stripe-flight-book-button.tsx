"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StripeFlightBookButtonProps {
  origin: string;
  destination: string;
  airline?: string;
  price?: number;
  departureDate?: string;
  returnDate?: string;
  cabinClass?: string;
  className?: string;
  compact?: boolean;
}

export function StripeFlightBookButton({
  origin,
  destination,
  airline = "IATA Certified Airline",
  price = 850,
  departureDate,
  returnDate,
  cabinClass = "Economy",
  className,
  compact = false,
}: StripeFlightBookButtonProps) {
  const router = useRouter();

  const handleNavigate = () => {
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      departDate: departureDate || "",
      returnDate: returnDate || "",
      cabinClass,
      price: String(price),
    });
    router.push(`/flights/book?${params.toString()}`);
  };

  return (
    <>
      {compact ? (
        <Button
          type="button"
          onClick={handleNavigate}
          size="sm"
          className={`rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-8 px-4 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer ${className || ""}`}
        >
          <Plane className="size-3 text-white" />
          <span>Select Flight</span>
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleNavigate}
          className={`rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${className || ""}`}
        >
          <Plane className="size-4 text-white" />
          <span>Book Flight</span>
          <ArrowRight className="size-4 ml-1" />
        </Button>
      )}
    </>
  );
}
