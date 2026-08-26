import { SITE } from "./site";
import { formatPassengers, type PassengerCounts } from "./passengers";

export type TripType = "roundtrip" | "oneway" | "multicity";

export interface FlightLeg {
  from: string;
  to: string;
  departDate: string; // YYYY-MM-DD
}

export interface FlightMessageInput {
  tripType: TripType;
  legs: FlightLeg[];
  passengers: PassengerCounts;
  cabinClass: string;
}

const TRIP_LABELS: Record<TripType, string> = {
  roundtrip: "Round Trip",
  oneway: "One Way",
  multicity: "Multi-City",
};

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export function composeFlightMessage(input: FlightMessageInput): string {
  const lines = [
    `Hello ${SITE.name}! I would like to book a flight (${TRIP_LABELS[input.tripType]}).`,
    "",
  ];
  input.legs.forEach((leg, index) => {
    const prefix =
      input.tripType === "multicity"
        ? `Leg ${index + 1}: `
        : index === 0
          ? "Depart: "
          : "Return: ";
    lines.push(`${prefix}${leg.from} -> ${leg.to} on ${formatDate(leg.departDate)}`);
  });
  lines.push(
    `Passengers: ${formatPassengers(input.passengers)}`,
    `Class: ${input.cabinClass}`,
    "",
    "Please share available options and pricing. Thank you!",
  );
  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
