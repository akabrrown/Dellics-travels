export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export type PassengerGroup = keyof PassengerCounts;

export const PASSENGER_LIMITS: Record<PassengerGroup, { min: number; max: number }> = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
  infants: { min: 0, max: 4 },
};

export function clampCount(group: PassengerGroup, value: number): number {
  const { min, max } = PASSENGER_LIMITS[group];
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function totalTravellers(counts: PassengerCounts): number {
  return counts.adults + counts.children;
}

export function formatPassengers(counts: PassengerCounts): string {
  const parts: string[] = [];
  parts.push(`${counts.adults} Adult${counts.adults > 1 ? "s" : ""}`);
  if (counts.children > 0)
    parts.push(`${counts.children} Child${counts.children > 1 ? "ren" : ""}`);
  if (counts.infants > 0)
    parts.push(`${counts.infants} Infant${counts.infants > 1 ? "s" : ""}`);
  return parts.join(", ");
}
