import { getJson } from "./api";

export interface TourPackage {
  id: string;
  name: string;
  slug: string;
  destination: string;
  price: string;
  rawPrice: number;
  currency: string;
  duration: string;
  badge: string;
  image: string;
  copy: string;
  includes: string[];
  highlights: string[];
  isFeatured?: boolean;
}

export interface ToursResponse {
  status: string;
  provider: string;
  count: number;
  data: TourPackage[];
}

export async function getTours(params?: {
  featured?: boolean;
  destination?: string;
}): Promise<TourPackage[]> {
  try {
    const query = new URLSearchParams();
    if (params?.featured) query.set("featured", "true");
    if (params?.destination) query.set("destination", params.destination);

    const path = `/search/tours${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await getJson<ToursResponse>(path, {
      next: { revalidate: 3600 },
    } as RequestInit);
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch tours from API, using catalog fallback", error);
    return [
      {
        id: "tour-ct-01",
        name: "5 Nights in Cape Town Luxury Experience",
        slug: "cape-town-luxury-experience",
        destination: "Cape Town, South Africa",
        price: "$1,899",
        rawPrice: 1899,
        currency: "USD",
        duration: "6 Days / 5 Nights",
        badge: "Most Popular",
        image: "/images/africa/cape-town-and-table-mountain.jpg",
        copy: "Discover the Mother City where adventure meets luxury! From Table Mountain cableway and Cape Point penguin encounters to world-class shopping at V&A Waterfront.",
        includes: [
          "Table Mountain Cableway Ticket",
          "Cape Point & Boulders Beach",
          "Penguin Colony Sanctuary",
          "V&A Waterfront Shopping Tour",
          "4-Star Luxury Accommodation",
          "Daily Gourmet Breakfast",
          "Return Airport Transfers",
        ],
        highlights: ["Table Mountain", "Cape Point", "Boulders Beach", "V&A Waterfront"],
        isFeatured: true,
      },
      {
        id: "tour-sv-02",
        name: "Safari Valley Eco Resort Full Day Escape",
        slug: "safari-valley-eco-resort",
        destination: "Okere Hills, Ghana",
        price: "$150",
        rawPrice: 150,
        currency: "USD",
        duration: "Full Day Tour",
        badge: "Ghana Luxury",
        image: "/images/services/day-tip-to-safari-valley.jpg",
        copy: "Ghana's premier luxury eco-retreat escape. Experience pure nature, exotic wildlife encounters, kayaking, and outdoor dining in the tranquil Okere Hills.",
        includes: [
          "Resort Entrance & Conservation Fee",
          "Buffet Gourmet Lunch",
          "Swimming Pool & Kayaking Access",
          "Guided Wildlife Encounter",
          "Professional Tour Host",
          "Round-trip AC Transport from Accra",
        ],
        highlights: ["Wildlife Encounters", "Gourmet Buffet", "Eco Kayaking", "Guided Forest Trails"],
        isFeatured: true,
      },
      {
        id: "tour-dxb-03",
        name: "Winter in Dubai Luxury Holiday",
        slug: "winter-in-dubai-luxury",
        destination: "Dubai, United Arab Emirates",
        price: "$1,890",
        rawPrice: 1890,
        currency: "USD",
        duration: "7 Days / 6 Nights",
        badge: "Bestseller",
        image: "/images/services/winter-dubai.jpg",
        copy: "Experience the ultimate Arabian luxury escape! Includes Emirates flights, Dubai Mall shopping, desert dune bashing safari with BBQ dinner, and Marina yacht cruise.",
        includes: [
          "Return Emirates Flights from Accra",
          "Guided Luxury Shopping Tours",
          "Desert Dune Safari with BBQ Dinner",
          "4-Star Hotel Accommodation",
          "Airport Transfers in Executive AC Van",
          "Dubai Tourist Visa & Tourism Tax",
        ],
        highlights: ["Emirates Flights", "Burj Khalifa", "Desert Safari BBQ", "Marina Yacht Cruise"],
        isFeatured: true,
      },
    ];
  }
}
