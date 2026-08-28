import { NextResponse } from "next/server";
import type { AirportPlace } from "@/types/airports";

export const dynamic = "force-dynamic";

// Major international airport hubs for initial dropdown state before user starts typing
const DEFAULT_HUB_CODES = [
  "ACC", // Accra, Ghana
  "LHR", // London Heathrow, UK
  "DXB", // Dubai, UAE
  "JFK", // New York, USA
  "LOS", // Lagos, Nigeria
  "CDG", // Paris, France
  "YYZ", // Toronto, Canada
  "JNB", // Johannesburg, South Africa
  "AMS", // Amsterdam, Netherlands
  "FRA", // Frankfurt, Germany
  "IST", // Istanbul, Turkey
  "NBO", // Nairobi, Kenya
  "ATL", // Atlanta, USA
  "DOH", // Doha, Qatar
];

function formatAirportItem(item: any): AirportPlace | null {
  if (!item || !item.code) return null;
  const code = (item.code || "").toUpperCase();
  const cityName = item.city_name || item.name || "";
  const airportName =
    item.type === "city"
      ? item.main_airport_name || `${cityName} All Airports`
      : item.name || `${cityName} Airport`;
  const countryName = item.country_name || "";
  const fullLabel = `${code} - ${airportName} (${cityName}${countryName ? `, ${countryName}` : ""})`;

  return {
    code,
    name: airportName,
    city: cityName,
    country: countryName,
    fullLabel,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = (searchParams.get("q") || "").trim();

  try {
    // 1. If user typed a search term, query live API directly
    if (searchTerm) {
      const response = await fetch(
        `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(searchTerm)}&locale=en&types[]=airport&types[]=city`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "DellicsTravels/1.0",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: `Airport API responded with status ${response.status}`, airports: [] },
          { status: response.status },
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        return NextResponse.json({ airports: [] });
      }

      const airports: AirportPlace[] = [];
      const seen = new Set<string>();

      for (const item of data) {
        const place = formatAirportItem(item);
        if (place && !seen.has(place.code)) {
          seen.add(place.code);
          airports.push(place);
        }
      }

      return NextResponse.json({ airports });
    }

    // 2. If query is empty, query live data for top international hubs
    const hubResponses = await Promise.allSettled(
      DEFAULT_HUB_CODES.map((code) =>
        fetch(
          `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(code)}&locale=en&types[]=airport&types[]=city`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "DellicsTravels/1.0",
            },
            next: { revalidate: 86400 },
          },
        ).then((res) => (res.ok ? res.json() : [])),
      ),
    );

    const airports: AirportPlace[] = [];
    const seen = new Set<string>();

    for (const result of hubResponses) {
      if (result.status === "fulfilled" && Array.isArray(result.value) && result.value.length > 0) {
        const place = formatAirportItem(result.value[0]);
        if (place && !seen.has(place.code)) {
          seen.add(place.code);
          airports.push(place);
        }
      }
    }

    return NextResponse.json({ airports });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Airport search service unreachable";
    return NextResponse.json(
      { error: errorMsg, airports: [] },
      { status: 502 },
    );
  }
}
