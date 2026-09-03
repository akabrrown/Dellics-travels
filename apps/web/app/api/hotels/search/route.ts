import { NextRequest, NextResponse } from "next/server";

const RATEHAWK_BASE_URL =
  process.env.RATEHAWK_BASE_URL || "https://api-sandbox.ratehawk.com/api/b2b/v3";
const RATEHAWK_API_ID =
  process.env.RATEHAWK_API_ID || process.env.RATEHAWK_KEY_ID || "494";
const RATEHAWK_API_KEY =
  process.env.RATEHAWK_API_KEY || "2ecbeeb9-cc38-4b7e-a415-94300adff21f";

const REQUEST_TIMEOUT_MS = 14_000;

async function fetchRatehawk(endpoint: string, payload: unknown) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const basicAuth = Buffer.from(
    `${RATEHAWK_API_ID}:${RATEHAWK_API_KEY}`
  ).toString("base64");

  const url = `${RATEHAWK_BASE_URL.replace(/\/$/, "")}${endpoint}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`,
        "X-API-ID": RATEHAWK_API_ID,
        "X-API-Key": RATEHAWK_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`RateHawk responded with status ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function sanitizeImageUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  return url.replace("{size}", "1024x768").replace("%7Bsize%7D", "1024x768");
}

function formatHotelName(id: string): string {
  if (!id) return "Boutique Hotel";
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function extractAmenities(amenityGroups?: any[]): string[] {
  if (!Array.isArray(amenityGroups)) {
    return [];
  }
  const list: string[] = [];
  for (const group of amenityGroups) {
    if (Array.isArray(group?.amenities)) {
      for (const item of group.amenities) {
        if (typeof item === "string" && item.trim() && !list.includes(item)) {
          list.push(item);
        }
        if (list.length >= 6) break;
      }
    }
    if (list.length >= 6) break;
  }
  return list;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const destination = (body.destination || "").trim();
    if (!destination) {
      return NextResponse.json([]);
    }

    const checkIn =
      body.checkIn ||
      new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
    const checkOut =
      body.checkOut ||
      new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10);
    const guestsCount = Number(body.guests) || 2;

    // 1. Resolve destination via Multicomplete
    const multi = await fetchRatehawk("/search/multicomplete/", {
      query: destination,
      language: "en",
    });

    const regionId = multi?.data?.regions?.[0]?.id;
    const hotelIds = (multi?.data?.hotels ?? [])
      .map((h: any) => h.id)
      .slice(0, 10);

    let serpRes: any = null;

    if (regionId) {
      serpRes = await fetchRatehawk("/search/serp/region/", {
        checkin: checkIn,
        checkout: checkOut,
        residency: "gb",
        language: "en",
        guests: [{ adults: guestsCount, children: [] }],
        region_id: regionId,
        currency: "USD",
      });
    } else if (hotelIds.length > 0) {
      serpRes = await fetchRatehawk("/search/serp/hotels/", {
        checkin: checkIn,
        checkout: checkOut,
        residency: "gb",
        language: "en",
        guests: [{ adults: guestsCount, children: [] }],
        ids: hotelIds,
        currency: "USD",
      });
    }

    const rawHotels = serpRes?.data?.hotels ?? [];

    if (Array.isArray(rawHotels) && rawHotels.length > 0) {
      const topHotels = rawHotels.slice(0, 12);
      const enriched = await Promise.allSettled(
        topHotels.map(async (h: any) => {
          try {
            const infoRes = await fetchRatehawk("/hotel/info/", {
              id: h.id,
              language: "en",
            });
            const info = infoRes?.data;
            const rateAmount = parseFloat(
              h.rates?.[0]?.payment_options?.payment_types?.[0]?.amount ||
                h.rates?.[0]?.daily_prices?.[0] ||
                "0"
            );
            const rateCurrency =
              h.rates?.[0]?.payment_options?.payment_types?.[0]?.currency_code ||
              "USD";

            const rawImages = (info?.images || []).map((img: any) =>
              sanitizeImageUrl(
                typeof img === "string" ? img : img?.url || img?.path || ""
              )
            );

            const images = rawImages.filter(Boolean);

            return {
              id: String(h.id || h.hid),
              name: String(info?.name || formatHotelName(h.id)),
              rating: Number(info?.star_rating || 0),
              address: String(info?.address || ""),
              city: String(info?.region?.name || destination),
              country: String(info?.region?.country_code || ""),
              price: Math.round(rateAmount),
              currency: rateCurrency,
              images: images,
              amenities: extractAmenities(info?.amenity_groups),
              description: String(info?.description || ""),
            };
          } catch {
            return null;
          }
        })
      );

      const validHotels = enriched
        .filter(
          (r): r is PromiseFulfilledResult<any> =>
            r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);

      return NextResponse.json(validHotels);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to search hotels" },
      { status: 500 }
    );
  }
}
