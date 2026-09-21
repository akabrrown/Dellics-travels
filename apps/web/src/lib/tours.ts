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

export const DELLICS_SIGNATURE_TOURS: TourPackage[] = [];

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
