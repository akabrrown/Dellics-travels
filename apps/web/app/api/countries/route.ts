import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface ApiCountryItem {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: string;
}

// Convert 2-letter ISO code to Flag Emoji (e.g. GH -> 🇬🇭)
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Priority country codes to display first
const PRIORITY_CODES = ["GH", "NG", "GB", "US", "AE", "CA", "ZA", "DE", "FR", "RW", "KE"];

export async function GET() {
  try {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/currency", {
      next: { revalidate: 86400 }, // Cache 24 hours
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data && Array.isArray(json.data)) {
        const list: ApiCountryItem[] = json.data
          .filter((item: { iso2?: string; name?: string }) => item.iso2 && item.name)
          .map((item: { iso2: string; name: string; currency?: string }) => ({
            code: item.iso2.toUpperCase(),
            name: item.name,
            flag: getFlagEmoji(item.iso2),
            defaultCurrency: item.currency || "USD",
          }));

        // Sort priority countries to top, then alphabetical
        const sorted = list.sort((a, b) => {
          const aIndex = PRIORITY_CODES.indexOf(a.code);
          const bIndex = PRIORITY_CODES.indexOf(b.code);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.name.localeCompare(b.name);
        });

        return NextResponse.json({
          success: true,
          count: sorted.length,
          data: sorted,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching live countries data:", error);
  }

  // Graceful fallback if external upstream times out
  const fallbackList: ApiCountryItem[] = [
    { code: "GH", name: "Ghana", flag: "🇬🇭", defaultCurrency: "GHS" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬", defaultCurrency: "NGN" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", defaultCurrency: "GBP" },
    { code: "US", name: "United States", flag: "🇺🇸", defaultCurrency: "USD" },
    { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", defaultCurrency: "AED" },
    { code: "CA", name: "Canada", flag: "🇨🇦", defaultCurrency: "CAD" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦", defaultCurrency: "ZAR" },
    { code: "DE", name: "Germany", flag: "🇩🇪", defaultCurrency: "EUR" },
  ];

  return NextResponse.json({
    success: true,
    count: fallbackList.length,
    data: fallbackList,
  });
}
