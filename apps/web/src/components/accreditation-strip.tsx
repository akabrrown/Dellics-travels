import Image from "next/image";

const BADGES = [
  { src: "/badges/iata.png", alt: "IATA Accredited Agent" },
  { src: "/badges/gta.png", alt: "Ghana Tourism Authority" },
  { src: "/badges/amadeus.png", alt: "Amadeus Global Travel Partner" },
  { src: "/badges/rate-hawk.png", alt: "RateHawk Hotel Network" },
  { src: "/badges/travel-port.png", alt: "Travelport Partner" },
  { src: "/badges/airalo.jpg", alt: "Airalo eSIM Partner" },
  { src: "/badges/tougha.jpg", alt: "Tour Operators Union of Ghana (TOUGHA)" },
  { src: "/badges/viator-travel-agents.png", alt: "Viator Travel Agent Partner" },
  { src: "/badges/we-travel.png", alt: "WeTravel Booking Partner" },
  { src: "/badges/pay-stack.png", alt: "Secured by Paystack" },
];

export function AccreditationStrip() {
  return (
    <section aria-label="Accreditations and partners" className="border-y border-slate-200/80 bg-slate-50/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
          Official Accreditations & Global Travel Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-12">
          {BADGES.map((badge) => (
            <div
              key={badge.src}
              className="group flex h-14 items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm border border-slate-200/60 transition-all duration-200 hover:shadow-md hover:border-brand-orange/40 hover:-translate-y-0.5"
            >
              <Image
                src={badge.src}
                alt={badge.alt}
                width={120}
                height={48}
                className="h-8 w-auto object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
