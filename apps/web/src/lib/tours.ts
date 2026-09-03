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
  isDellicsSignature?: boolean;
  viatorUrl: string;
}

export interface ToursResponse {
  status: string;
  provider: string;
  count: number;
  data: TourPackage[];
}

export const VIATOR_AFFILIATE_PID =
  process.env.NEXT_PUBLIC_VIATOR_PARTNER_ID || "P00109284";
export const VIATOR_MCID = "42383";

export function buildViatorUrl(destination: string, activity?: string): string {
  const query = [destination, activity].filter(Boolean).join(" ");
  const base = `https://www.viator.com/search/${encodeURIComponent(query || "Tours and Activities")}?sortType=featured`;
  return `${base}&pid=${VIATOR_AFFILIATE_PID}&mcid=${VIATOR_MCID}&medium=link&campaign=dellics-travels`;
}

export const DELLICS_SIGNATURE_TOURS: TourPackage[] = [
  {
    id: "tour-gh-cc-01",
    name: "Cape Coast Castle Heritage & Kakum Canopy Walk",
    slug: "cape-coast-castle-heritage-kakum",
    destination: "Central Region, Ghana",
    price: "$120",
    rawPrice: 120,
    currency: "USD",
    duration: "Full Day Tour",
    badge: "Historic Heritage",
    image: "/images/africa/cape-coast-castle.jpg",
    copy: "Walk through the UNESCO World Heritage slave dungeons at Cape Coast Castle, cross the rainforest canopy suspension bridge at Kakum National Park, and savor local Ghanaian cuisine.",
    includes: [
      "Cape Coast Castle & Museum Entrance",
      "Kakum Rainforest Canopy Walk Tickets",
      "Round-trip Executive AC Transport from Accra",
      "Traditional Ghanaian Lunch & Refreshments",
      "Licensed Historic Tour Guide",
    ],
    highlights: ["Door of No Return", "Kakum Canopy Bridge", "Gulf of Guinea Coastline", "Elmina Township"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Cape Coast Ghana", "Castle and Kakum"),
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
    badge: "Ghana Eco-Luxury",
    image: "/images/services/day-tip-to-safari-valley.jpg",
    copy: "Ghana's premier luxury eco-retreat escape. Experience pure nature, exotic wildlife encounters, kayaking, lawn bowling, and outdoor dining in the tranquil Okere Hills.",
    includes: [
      "Resort Entrance & Conservation Fee",
      "Buffet Gourmet 3-Course Lunch",
      "Swimming Pool & Kayaking Access",
      "Guided Wildlife Feeding Encounter",
      "Professional Dellics Tour Host",
      "Round-trip AC Transport from Accra",
    ],
    highlights: ["Wildlife Encounters", "Gourmet Buffet", "Eco Kayaking", "Guided Forest Trails"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Ghana", "Safari Valley"),
  },
  {
    id: "tour-dxb-03",
    name: "Dubai 5-Night Luxury Holiday & Desert Safari",
    slug: "dubai-luxury-desert-safari",
    destination: "Dubai, United Arab Emirates",
    price: "$1,890",
    rawPrice: 1890,
    currency: "USD",
    duration: "6 Days / 5 Nights",
    badge: "Bestseller",
    image: "/images/services/winter-dubai.jpg",
    copy: "Experience the ultimate Arabian luxury escape! Includes Emirates flights, Dubai Mall shopping, 4x4 desert dune safari with BBQ dinner, and Marina yacht dinner cruise.",
    includes: [
      "Return Flights from Accra",
      "4-Star Luxury Hotel in Downtown Dubai",
      "Desert Dune 4x4 Safari with BBQ Dinner & Shows",
      "Dubai Marina Luxury Yacht Cruise",
      "Executive Airport Transfers",
      "Dubai Tourist Visa Processing",
    ],
    highlights: ["Burj Khalifa", "Desert Safari BBQ", "Marina Yacht Cruise", "Dubai Mall"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Dubai", "Desert Safari and Luxury Tours"),
  },
  {
    id: "tour-znz-04",
    name: "Zanzibar Island Spice & Coral Reef Beach Escape",
    slug: "zanzibar-island-spice-beach-escape",
    destination: "Zanzibar, Tanzania",
    price: "$1,450",
    rawPrice: 1450,
    currency: "USD",
    duration: "5 Days / 4 Nights",
    badge: "Tropical Beach",
    image: "/images/packages/zanzibar-beach.jpg",
    copy: "Pristine turquoise waters, historic Stone Town walking tours, aromatic organic spice plantation tastings, and private sunset catamaran sailing cruises.",
    includes: [
      "Beachfront 4-Star Resort Accommodation",
      "Stone Town Guided UNESCO Heritage Tour",
      "Spice Farm Organic Plantation Walk",
      "Sunset Dhow Boat Cruise with Refreshments",
      "Daily Gourmet Breakfast & Dinner",
      "Return Airport & Ferry Transfers",
    ],
    highlights: ["Stone Town", "Nungwi Beach", "Organic Spice Farm", "Sunset Dhow Sailing"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Zanzibar", "Stone Town and Beach Tours"),
  },
  {
    id: "tour-ct-05",
    name: "5 Nights in Cape Town Luxury Experience",
    slug: "cape-town-luxury-experience",
    destination: "Cape Town, South Africa",
    price: "$1,899",
    rawPrice: 1899,
    currency: "USD",
    duration: "6 Days / 5 Nights",
    badge: "South Africa Special",
    image: "/images/africa/cape-town-and-table-mountain.jpg",
    copy: "Discover the Mother City where adventure meets luxury! Table Mountain cableway, Cape Point penguin encounters, and V&A Waterfront.",
    includes: [
      "Table Mountain Cableway Priority Ticket",
      "Cape Point & Boulders Beach Penguin Sanctuary",
      "V&A Waterfront Private Tour",
      "4-Star Luxury Waterfront Hotel",
      "Daily Gourmet Breakfast",
      "Executive Airport Transfers",
    ],
    highlights: ["Table Mountain", "Cape Point", "Boulders Beach", "V&A Waterfront"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Cape Town", "Table Mountain and Cape Point"),
  },
  {
    id: "tour-par-06",
    name: "Paris Romance & Louvre Museum Private Access",
    slug: "paris-romance-louvre",
    destination: "Paris, France",
    price: "$2,100",
    rawPrice: 2100,
    currency: "USD",
    duration: "5 Days / 4 Nights",
    badge: "European Romance",
    image: "/images/europe/paris-and-eiffel-tower.jpg",
    copy: "Priority entrance to the Louvre, Seine river dinner cruise at dusk, and a gourmet walking tour through Montmartre and Le Marais.",
    includes: [
      "Skip-the-Line Louvre Museum Tickets",
      "Seine River Gourmet Dinner Cruise",
      "Boutique Central Paris Hotel",
      "Eiffel Tower Summit Access",
    ],
    highlights: ["Louvre Museum", "Eiffel Tower", "Seine River", "Montmartre"],
    isFeatured: true,
    isDellicsSignature: false,
    viatorUrl: buildViatorUrl("Paris", "Louvre and Eiffel Tower"),
  },
];

export async function getTours(params?: {
  featured?: boolean;
  destination?: string;
}): Promise<TourPackage[]> {
  const query = new URLSearchParams();
  if (params?.featured) query.set("featured", "true");
  if (params?.destination) query.set("destination", params.destination);
  const qs = query.toString() ? `?${query.toString()}` : "";

  try {
    const res = await getJson<ToursResponse>(`/tours${qs}`, {
      next: { revalidate: 60 },
    } as RequestInit);
    if (res?.data && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fall back to /search/tours if /tours unavailable
    try {
      const res = await getJson<ToursResponse>(`/search/tours${qs}`, {
        next: { revalidate: 60 },
      } as RequestInit);
      if (res?.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Return curated signature tours
    }
  }
  return DELLICS_SIGNATURE_TOURS;
}
