import { getJson } from "./api";

export interface FxRatesResponse {
  provider: string;
  base: string;
  timestamp: number;
  rates: Record<string, number>;
}

export interface FxConvertResponse {
  originalAmount: number;
  from: string;
  convertedAmount: number;
  to: string;
  rate: number;
}

export async function getLiveFxRates(): Promise<Record<string, number>> {
  try {
    const res = await getJson<FxRatesResponse>("/search/fx/rates", {
      next: { revalidate: 1800 }, // 30 minutes cache
    } as RequestInit);
    return res.rates || { USD: 1.0, GHS: 15.65, EUR: 0.92, GBP: 0.78, AED: 3.67, ZAR: 18.25 };
  } catch {
    return { USD: 1.0, GHS: 15.65, EUR: 0.92, GBP: 0.78, AED: 3.67, ZAR: 18.25 };
  }
}

export async function convertCurrency(
  amount: number,
  from: string = "USD",
  to: string = "GHS",
): Promise<FxConvertResponse> {
  try {
    const query = new URLSearchParams({
      amount: String(amount),
      from,
      to,
    });
    return await getJson<FxConvertResponse>(`/search/fx/convert?${query.toString()}`);
  } catch {
    // Fallback calculation using standard GHS rate
    const ghsRate = 15.65;
    const converted = from.toUpperCase() === "USD" && to.toUpperCase() === "GHS" ? amount * ghsRate : amount;
    return {
      originalAmount: amount,
      from: from.toUpperCase(),
      convertedAmount: Math.round(converted * 100) / 100,
      to: to.toUpperCase(),
      rate: ghsRate,
    };
  }
}
