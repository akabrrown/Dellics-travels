import Image from "next/image";

// Filenames match the kebab-cased copies in public/badges/ (Task 2).
const BADGES = [
  { src: "/badges/iata.png", alt: "IATA accredited" },
  { src: "/badges/accredited.png", alt: "Accredited travel agency" },
  { src: "/badges/amadeus.png", alt: "Amadeus partner" },
  { src: "/badges/rate-hawk.png", alt: "RateHawk partner" },
  { src: "/badges/gta.png", alt: "GTA partner" },
  { src: "/badges/travel-port.png", alt: "Travelport partner" },
  { src: "/badges/airalo.jpg", alt: "Airalo partner" },
  { src: "/badges/tougha.jpg", alt: "TOUGHA partner" },
  { src: "/badges/viator-travel-agents.png", alt: "Viator travel agent" },
  { src: "/badges/we-travel.png", alt: "WeTravel partner" },
  { src: "/badges/pay-stack.png", alt: "Paystack payments" },
];

export function AccreditationStrip() {
  return (
    <section aria-label="Accreditations and partners" className="border-y border-black/5 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4">
        {BADGES.map((badge) => (
          <Image key={badge.src} src={badge.src} alt={badge.alt} width={120} height={48} className="h-10 w-auto opacity-80" />
        ))}
      </div>
    </section>
  );
}
