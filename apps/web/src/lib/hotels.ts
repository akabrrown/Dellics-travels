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
  const today = new Date().toISOString().slice(0, 10);
  const normalizedCheckIn = !input.checkIn || input.checkIn < today ? today : input.checkIn;
  const defaultCheckOut = new Date(new Date(normalizedCheckIn).getTime() + 86400000 * 5)
    .toISOString()
    .slice(0, 10);
  const normalizedCheckOut =
    !input.checkOut || input.checkOut <= normalizedCheckIn ? defaultCheckOut : input.checkOut;

  const sanitizedInput: HotelSearchInput = {
    ...input,
    checkIn: normalizedCheckIn,
    checkOut: normalizedCheckOut,
  };

  // 1. Query Next.js direct RateHawk API route
  try {
    const res = await fetch("/api/hotels/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedInput),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Proceed to backend fallback
  }

  // 2. Query NestJS API backend
  try {
    const data = await postJson<Hotel[]>("/hotels/search", sanitizedInput);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Return empty on failure
  }

  return [];
}
