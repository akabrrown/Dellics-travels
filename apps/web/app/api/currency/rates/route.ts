import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fallback rates against 1 USD in case of upstream network timeout
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  GHS: 15.5,
  GBP: 0.78,
  EUR: 0.92,
  NGN: 1580.0,
  AED: 3.67,
  CAD: 1.38,
  ZAR: 18.2,
};

export async function GET() {
  try {
    // Live open FX exchange rate API with 1 hour caching
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
      headers: { "Accept": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return NextResponse.json({
          success: true,
          base: "USD",
          rates: {
            USD: 1.0,
            GHS: data.rates.GHS || FALLBACK_RATES.GHS,
            GBP: data.rates.GBP || FALLBACK_RATES.GBP,
            EUR: data.rates.EUR || FALLBACK_RATES.EUR,
            NGN: data.rates.NGN || FALLBACK_RATES.NGN,
            AED: data.rates.AED || FALLBACK_RATES.AED,
            CAD: data.rates.CAD || FALLBACK_RATES.CAD,
            ZAR: data.rates.ZAR || FALLBACK_RATES.ZAR,
          },
          updatedAt: data.time_last_update_utc || new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("Live FX rate fetch error, using fallback rates:", error);
  }

  return NextResponse.json({
    success: true,
    base: "USD",
    rates: FALLBACK_RATES,
    updatedAt: new Date().toISOString(),
  });
}
