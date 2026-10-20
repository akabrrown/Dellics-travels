import { describe, expect, it } from "vitest";
import {
  clampCount,
  formatPassengers,
  totalTravellers,
  PASSENGER_LIMITS,
} from "./passengers";

describe("passengers", () => {
  it("clamps each group to its limits", () => {
    expect(clampCount("adults", 0)).toBe(1);
    expect(clampCount("adults", 12)).toBe(9);
    expect(clampCount("children", -1)).toBe(0);
    expect(clampCount("children", 9)).toBe(8);
    expect(clampCount("infants", 5)).toBe(4);
  });

  it("totals exclude infants", () => {
    expect(totalTravellers({ adults: 2, children: 1, infants: 2 })).toBe(3);
  });

  it("formats the legacy-style summary string", () => {
    expect(formatPassengers({ adults: 2, children: 1, infants: 0 })).toBe(
      "2 Adults, 1 Child",
    );
    expect(formatPassengers({ adults: 1, children: 0, infants: 1 })).toBe(
      "1 Adult, 1 Infant",
    );
    expect(formatPassengers({ adults: 3, children: 2, infants: 1 })).toBe(
      "3 Adults, 2 Children, 1 Infant",
    );
  });

  it("exposes the documented limits", () => {
    expect(PASSENGER_LIMITS).toEqual({
      adults: { min: 1, max: 9 },
      children: { min: 0, max: 8 },
      infants: { min: 0, max: 4 },
    });
  });
});
