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

const FALLBACK_HOTELS: Hotel[] = [
  {
    id: "acc-kempinski-01",
    name: "Kempinski Hotel Gold Coast City",
    rating: 5,
    address: "Gamal Abdul Nasser Avenue, Ridge",
    city: "Accra",
    country: "Ghana",
    price: 320,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: ["Outdoor Infinity Pool", "Luxury Spa", "Free High-Speed WiFi", "Fine Dining", "Airport Shuttle"],
    description: "Premier 5-star luxury in the heart of Accra offering world-class hospitality, fine dining, and serene wellness facilities.",
  },
  {
    id: "acc-labadi-02",
    name: "Labadi Beach Hotel",
    rating: 5,
    address: "No 1 La Bypass, Trade Fair",
    city: "Accra",
    country: "Ghana",
    price: 240,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: ["Private Beachfront", "2 Outdoor Pools", "Tennis Courts", "Cocktail Bar", "Ocean View Dining"],
    description: "Ghana's premier beachfront resort combining rich cultural heritage with panoramic ocean views and private beach access.",
  },
  {
    id: "dxb-atlantis-01",
    name: "Atlantis, The Palm",
    rating: 5,
    address: "Crescent Road, Palm Jumeirah",
    city: "Dubai",
    country: "United Arab Emirates",
    price: 490,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: ["Aquaventure Waterpark Access", "The Lost Chambers Aquarium", "Private Beach", "Michelin-Starred Dining"],
    description: "Iconic luxury resort on the Palm Jumeirah with complimentary waterpark access, marine exhibits, and world-renowned dining.",
  },
  {
    id: "lon-shard-01",
    name: "Shangri-La The Shard, London",
    rating: 5,
    address: "31 St Thomas Street, Southwark",
    city: "London",
    country: "United Kingdom",
    price: 580,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: ["Skyline Views of London", "Infinity Sky Pool", "TĪNG Restaurant", "GŎNG Bar", "Luxury Marble Bathrooms"],
    description: "Occupying levels 34 to 52 of Western Europe's most iconic building, offering breathtaking panoramic skyline views.",
  },
  {
    id: "gh-capecoast-01",
    name: "Ridge Royal Hotel Cape Coast",
    rating: 4,
    address: "Second Ridge, Cape Coast",
    city: "Cape Coast",
    country: "Ghana",
    price: 135,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Outdoor Swimming Pool", "Free WiFi", "Proximity to Cape Coast Castle", "Restaurant & Bar"],
    description: "Set atop the scenic ridge of Cape Coast, perfect for heritage tours, Kakum National Park canopy walks, and coastal getaways.",
  },
  {
    id: "nyc-plaza-01",
    name: "The Plaza Hotel Fifth Avenue",
    rating: 5,
    address: "Fifth Avenue at Central Park South",
    city: "New York",
    country: "United States",
    price: 750,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Direct Central Park Views", "Palm Court Afternoon Tea", "Guerlain Spa", "Champagne Bar"],
    description: "A National Historic Landmark on Fifth Avenue and Central Park South, defining timeless Manhattan luxury since 1907.",
  },
];

export async function searchHotels(input: HotelSearchInput): Promise<Hotel[]> {
  try {
    const res = await fetch("/api/hotels/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    try {
      const data = await postJson<Hotel[]>("/hotels/search", input);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      // ignore
    }
  }

  const query = (input.destination || "").trim().toLowerCase();
  if (!query) return FALLBACK_HOTELS;

  const matched = FALLBACK_HOTELS.filter((h) => {
    return (
      h.city.toLowerCase().includes(query) ||
      h.country.toLowerCase().includes(query) ||
      h.name.toLowerCase().includes(query) ||
      h.address.toLowerCase().includes(query)
    );
  });

  return matched.length > 0 ? matched : FALLBACK_HOTELS;
}
