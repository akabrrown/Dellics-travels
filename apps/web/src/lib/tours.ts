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
  viatorUrl: string;
}

export interface ToursResponse {
  status: string;
  provider: string;
  count: number;
  data: TourPackage[];
}

export function buildViatorUrl(destination: string, activity?: string): string {
  const query = [destination, activity].filter(Boolean).join(" ");
  return `https://www.viator.com/search/${encodeURIComponent(query || "Tours and Activities")}?sortType=featured`;
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
    console.error("Failed to fetch tours from API, using Viator catalog fallback", error);
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
        copy: "Discover the Mother City where adventure meets luxury! Table Mountain cableway, Cape Point penguin encounters, and V&A Waterfront.",
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
        viatorUrl: "https://www.viator.com/search/Cape%20Town?sortType=featured",
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
        viatorUrl: "https://www.viator.com/search/Ghana?sortType=featured",
      },
      {
        id: "tour-dxb-03",
        name: "Winter in Dubai Luxury Holiday & Desert Safari",
        slug: "winter-in-dubai-luxury",
        destination: "Dubai, United Arab Emirates",
        price: "$1,890",
        rawPrice: 1890,
        currency: "USD",
        duration: "7 Days / 6 Nights",
        badge: "Bestseller",
        image: "/images/services/winter-dubai.jpg",
        copy: "Experience the ultimate Arabian luxury escape! Includes Emirates flights, Dubai Mall shopping, desert dune safari with BBQ dinner, and Marina yacht cruise.",
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
        viatorUrl: "https://www.viator.com/search/Dubai?sortType=featured",
      },
      {
        id: "tour-znz-04",
        name: "Zanzibar Island Spice & Coral Reef Beach Retreat",
        slug: "zanzibar-beach-retreat",
        destination: "Zanzibar, Tanzania",
        price: "$1,450",
        rawPrice: 1450,
        currency: "USD",
        duration: "5 Days / 4 Nights",
        badge: "Island Escape",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        copy: "Pristine turquoise waters, historic Stone Town walking tours, aromatic spice plantation tastings, and private sunset catamaran cruises.",
        includes: [
          "Beachfront Resort Accommodation",
          "Stone Town Guided Heritage Tour",
          "Spice Farm Plantation Walk",
          "Sunset Dhow Boat Cruise",
          "Daily Breakfast & Dinner",
        ],
        highlights: ["Stone Town", "Nungwi Beach", "Spice Tour", "Sunset Dhow"],
        isFeatured: true,
        viatorUrl: "https://www.viator.com/search/Zanzibar?sortType=featured",
      },
      {
        id: "tour-par-05",
        name: "Paris Romance & Louvre Museum Private Access",
        slug: "paris-romance-louvre",
        destination: "Paris, France",
        price: "$2,100",
        rawPrice: 2100,
        currency: "USD",
        duration: "5 Days / 4 Nights",
        badge: "Cultural Masterpiece",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
        copy: "Priority entrance to the Louvre, Seine river dinner cruise at dusk, and a gourmet walking tour through Montmartre and Le Marais.",
        includes: [
          "Skip-the-Line Louvre Museum Tickets",
          "Seine River Gourmet Dinner Cruise",
          "Boutique Central Paris Hotel",
          "Eiffel Tower Summit Access",
        ],
        highlights: ["Louvre Museum", "Eiffel Tower", "Seine River", "Montmartre"],
        isFeatured: true,
        viatorUrl: "https://www.viator.com/search/Paris?sortType=featured",
      },
    ];
  }
}
