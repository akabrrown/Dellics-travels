import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, composeFlightMessage } from "./whatsapp";

describe("whatsapp", () => {
  it("builds a wa.me deep link with encoded text", () => {
    const link = buildWhatsAppLink("Hello there");
    expect(link).toBe("https://wa.me/233552054174?text=Hello%20there");
  });

  it("composes the full flight message", () => {
    const message = composeFlightMessage({
      tripType: "roundtrip",
      legs: [
        { from: "Accra", to: "Dubai", departDate: "2026-12-01" },
        { from: "Dubai", to: "Accra", departDate: "2026-12-10" },
      ],
      passengers: { adults: 2, children: 1, infants: 0 },
      cabinClass: "Economy",
    });
    expect(message).toContain("Round Trip");
    expect(message).toContain("Accra -> Dubai");
    expect(message).toContain("01 Dec 2026");
    expect(message).toContain("2 Adults, 1 Child");
    expect(message).toContain("Class: Economy");
  });

  it("omits the return line for one-way trips", () => {
    const message = composeFlightMessage({
      tripType: "oneway",
      legs: [{ from: "Accra", to: "London", departDate: "2026-12-01" }],
      passengers: { adults: 1, children: 0, infants: 0 },
      cabinClass: "Business",
    });
    expect(message).not.toContain("Return");
    expect(message).toContain("One Way");
  });
});
