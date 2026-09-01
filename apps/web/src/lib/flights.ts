import { getJson, postJson } from "./api";

export interface FlightOffer {
  id: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  airline: string;
  iataCode: string;
  departureTime: string | null;
  arrivalTime: string | null;
  duration: string | null;
  stops: number;
  cabinClass: string;
}

export interface FlightSearchResponse {
  status: string;
  provider: string;
  data: FlightOffer[];
}

export interface HomeDeal {
  id: string;
  destination: string;
  iata: string;
  title: string;
  price: string;
  rawPrice: number;
  tag: string;
  image: string;
  endsIn: string;
  freeCancel: boolean;
}

export interface TrendingDestination {
  id: string;
  name: string;
  iata: string;
  price: string;
  image: string;
  badge: string;
}

export interface HomeDealsResponse {
  status: string;
  provider: string;
  origin: string;
  data: {
    deals: HomeDeal[];
    trending: TrendingDestination[];
  };
}

export async function searchLiveFlights(params: {
  origin: string;
  destination: string;
  date?: string;
  cabinClass?: string;
  adults?: number;
}): Promise<FlightOffer[]> {
  const query = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    ...(params.date ? { date: params.date } : {}),
    ...(params.cabinClass ? { cabinClass: params.cabinClass } : {}),
    ...(params.adults ? { adults: String(params.adults) } : {}),
  });

  const res = await getJson<FlightSearchResponse>(`/search/flights?${query.toString()}`);
  return res.data || [];
}

export async function getLiveHomeDeals(origin: string = "ACC"): Promise<HomeDealsResponse["data"]> {
  const res = await getJson<HomeDealsResponse>(`/search/home-deals?origin=${encodeURIComponent(origin)}`, {
    next: { revalidate: 3600 }, // Cache on Next.js server for 1 hour
  } as RequestInit);
  return res.data;
}

export async function checkoutFlightWithStripe(params: {
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  airline?: string;
  price: number;
  currency?: string;
  email?: string;
  customerName?: string;
  passengerCount?: number;
  cabinClass?: string;
}): Promise<{ url: string; sessionId: string; bookingRef: string }> {
  return postJson<{ url: string; sessionId: string; bookingRef: string }>(
    "/payments/flights/stripe-checkout",
    params,
  );
}
