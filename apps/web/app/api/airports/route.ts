import { NextResponse } from "next/server";
import type { AirportPlace } from "@/types/airports";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = (searchParams.get("q") || "").trim();

  // If search query is empty, query live API for global hubs
  const queryParam = searchTerm || "airport";

  try {
    const response = await fetch(
      `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(queryParam)}&locale=en&types[]=airport&types[]=city`,
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

    const airports: AirportPlace[] = data
      .filter((item: any) => item.code && (item.name || item.city_name))
      .map((item: any) => {
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
      });

    return NextResponse.json({ airports });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Airport search service unreachable";
    return NextResponse.json(
      { error: errorMsg, airports: [] },
      { status: 502 },
    );
  }
}
