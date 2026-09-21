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
  segment?: string;
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
    id: "tour-heritage-01",
    name: "The Heritage & Roots Journey",
    slug: "heritage-roots-journey-ghana",
    destination: "Cape Coast & Elmina, Ghana",
    price: "From $1,250",
    rawPrice: 1250,
    currency: "USD",
    duration: "7 Days",
    badge: "Diaspora Special",
    image: "/images/tours/heritage.jpg",
    copy: "A profoundly moving and culturally enriching journey designed specifically to connect you with your roots. Explore the historic Cape Coast and Elmina Castles, walk across the Kakum canopy, and immerse yourself in traditional Ghanaian hospitality.",
    includes: ["4-Star Accommodation", "Breakfast & Dinner", "Expert Guide", "Ground Transport"],
    highlights: ["Cape Coast Castle", "Kakum National Park", "Naming Ceremony", "Cultural Dance"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Cape Coast", "Heritage Tour")
  },
  {
    id: "tour-accra-02",
    name: "Accra City & Culture Experience",
    slug: "accra-city-culture-experience",
    destination: "Accra, Ghana",
    price: "From $850",
    rawPrice: 850,
    currency: "USD",
    duration: "4 Days",
    badge: "Best Seller",
    image: "/images/tours/accra.jpg",
    copy: "Dive into the vibrant rhythm of Accra! From historic monuments like Black Star Square to the bustling Makola Market and the thriving nightlife, experience the ultimate modern African city lifestyle.",
    includes: ["Luxury Boutique Hotel", "Daily Breakfast", "City Transfers", "Nightlife Concierge"],
    highlights: ["Black Star Square", "Kwame Nkrumah Mausoleum", "Makola Market", "Osu Nightlife"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Accra", "City Tour")
  },
  {
    id: "tour-safari-03",
    name: "Savannah Wildlife Escape",
    slug: "savannah-wildlife-escape",
    destination: "Mole National Park, Ghana",
    price: "From $1,450",
    rawPrice: 1450,
    currency: "USD",
    duration: "5 Days",
    badge: "Adventure",
    image: "/images/tours/safari.jpg",
    copy: "Experience the breathtaking beauty of Ghana's northern savannah. Embark on guided safaris to see wild elephants, antelopes, and majestic baobab trees in Mole National Park, complete with eco-lodge luxury.",
    includes: ["Eco-Lodge Accommodation", "All Meals", "Safari Guide", "Domestic Flights"],
    highlights: ["Walking Safari", "Wild Elephants", "Larabanga Mosque", "Mognori Eco Village"],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: buildViatorUrl("Mole National Park", "Safari")
  }
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
  
  // If we get here, either no API data or it failed, so return our signature tours.
  // We can filter them if needed.
  let tours = [...DELLICS_SIGNATURE_TOURS];
  if (params?.featured) {
    tours = tours.filter(t => t.isFeatured);
  }
  if (params?.destination) {
    tours = tours.filter(t => t.destination.toLowerCase().includes(params.destination!.toLowerCase()));
  }
  
  return tours;
}
