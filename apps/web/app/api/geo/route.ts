import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  GH: "GHS",
  NG: "NGN",
  GB: "GBP",
  US: "USD",
  AE: "AED",
  CA: "CAD",
  ZA: "ZAR",
  KE: "KES",
  RW: "RWF",
  TZ: "TZS",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
};

export async function GET(req: Request) {
  try {
    // 1. Check Vercel/Cloudflare Geo Headers if available
    const headerCountry =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-country-code");

    if (headerCountry && headerCountry !== "XX") {
      const countryCode = headerCountry.toUpperCase();
      return NextResponse.json({
        success: true,
        source: "header",
        country: countryCode,
        currency: COUNTRY_CURRENCY_MAP[countryCode] || "USD",
      });
    }

    // 2. Query Live Open Geo IP API
    const geoRes = await fetch("https://api.country.is/", {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData && geoData.country) {
        const countryCode = geoData.country.toUpperCase();
        return NextResponse.json({
          success: true,
          source: "live_api",
          ip: geoData.ip,
          country: countryCode,
          currency: COUNTRY_CURRENCY_MAP[countryCode] || "USD",
        });
      }
    }
  } catch (error) {
    console.error("Geo IP detection error:", error);
  }

  // Fallback to Ghana (Agency home base)
  return NextResponse.json({
    success: true,
    source: "fallback",
    country: "GH",
    currency: "GHS",
  });
}
