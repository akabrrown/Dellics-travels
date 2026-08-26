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

export function searchHotels(input: HotelSearchInput): Promise<Hotel[]> {
  return postJson<Hotel[]>("/hotels/search", input);
}
