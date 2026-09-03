import { postJson } from "./api";
import type { HotelSearchInput } from "./schemas";

// Must stay in sync with HotelResult in apps/api/src/hotels/hotels.types.ts
export interface Hotel {
  id: string;
  name: string;
  rating: number;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  images: string[];
  amenities: string[];
  description: string;
}

export async function searchHotels(input: HotelSearchInput): Promise<Hotel[]> {
  // 1. Query Next.js direct RateHawk sandbox API route
  try {
    const res = await fetch("/api/hotels/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // 2. Query NestJS API backend
    try {
      const data = await postJson<Hotel[]>("/hotels/search", input);
      if (Array.isArray(data)) {
        return data;
      }
    } catch {
      // Return empty array on network failure
    }
  }

  return [];
}
