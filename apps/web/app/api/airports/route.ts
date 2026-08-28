import { NextResponse } from "next/server";
import type { AirportPlace } from "@/types/airports";


const POPULAR_AIRPORTS: AirportPlace[] = [
  { code: "ACC", name: "Kotoka International Airport", city: "Accra", country: "Ghana", fullLabel: "ACC - Kotoka International (Accra, Ghana)" },
  { code: "KMS", name: "Kumasi International Airport", city: "Kumasi", country: "Ghana", fullLabel: "KMS - Kumasi International (Kumasi, Ghana)" },
  { code: "TML", name: "Tamale International Airport", city: "Tamale", country: "Ghana", fullLabel: "TML - Tamale International (Tamale, Ghana)" },
  { code: "LOS", name: "Murtala Muhammed International", city: "Lagos", country: "Nigeria", fullLabel: "LOS - Murtala Muhammed (Lagos, Nigeria)" },
  { code: "ABV", name: "Nnamdi Azikiwe International", city: "Abuja", country: "Nigeria", fullLabel: "ABV - Nnamdi Azikiwe (Abuja, Nigeria)" },
  { code: "LHR", name: "London Heathrow Airport", city: "London", country: "United Kingdom", fullLabel: "LHR - London Heathrow (London, UK)" },
  { code: "LGW", name: "London Gatwick Airport", city: "London", country: "United Kingdom", fullLabel: "LGW - London Gatwick (London, UK)" },
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "United States", fullLabel: "JFK - John F. Kennedy (New York, USA)" },
  { code: "IAD", name: "Washington Dulles International", city: "Washington", country: "United States", fullLabel: "IAD - Washington Dulles (Washington, USA)" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", fullLabel: "DXB - Dubai International (Dubai, UAE)" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar", fullLabel: "DOH - Hamad International (Doha, Qatar)" },
  { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands", fullLabel: "AMS - Schiphol (Amsterdam, Netherlands)" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France", fullLabel: "CDG - Charles de Gaulle (Paris, France)" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", fullLabel: "FRA - Frankfurt (Frankfurt, Germany)" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", fullLabel: "IST - Istanbul Airport (Istanbul, Turkey)" },
  { code: "NBO", name: "Jomo Kenyatta International", city: "Nairobi", country: "Kenya", fullLabel: "NBO - Jomo Kenyatta (Nairobi, Kenya)" },
  { code: "JNB", name: "O.R. Tambo International", city: "Johannesburg", country: "South Africa", fullLabel: "JNB - O.R. Tambo (Johannesburg, South Africa)" },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", country: "South Africa", fullLabel: "CPT - Cape Town International (Cape Town, South Africa)" },
  { code: "CAI", name: "Cairo International Airport", city: "Cairo", country: "Egypt", fullLabel: "CAI - Cairo International (Cairo, Egypt)" },
  { code: "ADD", name: "Bole International Airport", city: "Addis Ababa", country: "Ethiopia", fullLabel: "ADD - Bole International (Addis Ababa, Ethiopia)" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  if (!query) {
    return NextResponse.json({ airports: POPULAR_AIRPORTS });
  }

  try {
    // 1. Fetch live airport autocompletion from travelpayouts places API
    const response = await fetch(
      `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(query)}&locale=en&types[]=airport&types[]=city`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: AirportPlace[] = data
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

        if (mapped.length > 0) {
          return NextResponse.json({ airports: mapped });
        }
      }
    }
  } catch (err) {
    console.error("Live airport autocomplete fetch error:", err);
  }

  // 2. Fallback search against catalog
  const filtered = POPULAR_AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query) ||
      a.city.toLowerCase().includes(query) ||
      a.country.toLowerCase().includes(query) ||
      a.fullLabel.toLowerCase().includes(query),
  );

  return NextResponse.json({ airports: filtered });
}
