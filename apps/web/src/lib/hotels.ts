import { postJson } from "./api";
import type { HotelSearchInput } from "./schemas";

export interface HotelRoomRate {
  matchHash: string;
  roomName: string;
  meal: string;
  price: number;
  currency: string;
  freeCancellationBefore?: string;
  beddingType?: string;
  amenities?: string[];
}

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
  rates: HotelRoomRate[];
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

  try {
    const res = await fetch("/api/hotels/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedInput),
    });
    
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    } else {
      console.error("Next.js API returned error:", await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }

  return [];
}
