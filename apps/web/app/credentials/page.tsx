import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { AccreditationStrip } from "@/components/accreditation-strip";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Our Credentials",
  description:
    "Dellics Travels credentials and accreditations - RateHawk, Travelport, Amadeus, Viator, WeTravel, Airalo, GTA, IATA, TOUGHA",
};

const CREDENTIALS = [
  {
    badge: "Global Partner",
    name: "RateHawk",
    copy: "Global accommodation & travel booking platform providing access to worldwide hotel inventory and competitive rates.",
  },
  {
    badge: "Technology Partner",
    name: "Travelport",
    copy: "Global travel distribution technology connecting us to airlines, hotels, and travel providers worldwide.",
  },
  {
    badge: "Technology Partner",
    name: "Amadeus",
    copy: "Travel booking & technology solutions enabling seamless reservations and travel management across the globe.",
  },
  {
    badge: "Experience Partner",
    name: "Viator Travel Agents",
    copy: "Tours, activities & experiences platform offering curated travel experiences and destination activities worldwide.",
  },
  {
    badge: "Group Travel Partner",
    name: "WeTravel",
    copy: "Group travel management & payments platform specialized in organizing and managing group travel experiences.",
  },
  {
    badge: "Payment Partner",
    name: "Paystack",
    copy: "Secure and reliable payment processing for all travel bookings, ensuring safe transactions for our clients.",
  },
  {
    badge: "Connectivity Partner",
    name: "Airalo",
    copy: "Global eSIM connectivity providing travelers with affordable mobile data plans in over 200 countries worldwide.",
  },
  {
    badge: "Government Licensed",
    name: "Ghana Tourism Authority",
    copy: "Licensed by the Ghana Tourism Authority to provide trusted travel services.",
  },
  {
    badge: "Globally Accredited",
    name: "IATA Certified",
    copy: "IATA certified for trusted and reliable airline ticketing services.",
  },
  {
    badge: "Industry Recognized",
    name: "TOUGHA Member",
    copy: "Proud member of the Tour Operators Union of Ghana.",
  },
];

export default function CredentialsPage() {
  return (
    <>
      <PageHero
        title="Licensed & Accredited"
        subtitle="Our professional partnerships and certifications ensure you receive trusted, reliable travel services worldwide"
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Our Partners"
            title="Global Travel Credentials"
            subtitle="We work with leading industry partners and hold prestigious certifications to deliver exceptional travel experiences"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CREDENTIALS.map((credential) => (
              <div
                key={credential.name}
                className="rounded-card border border-black/5 bg-white p-8 shadow-sm"
              >
                <span className="inline-block rounded-pill bg-brand-orange px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                  {credential.badge}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-navy">
                  {credential.name}
                </h3>
                <p className="mt-3 text-slate-body">{credential.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AccreditationStrip />

      <CtaBanner
        title="Ready to Travel with Us?"
        copy="Let our expert team plan your perfect Ghana experience or international trip at an unbeatable price."
        label="Contact Us"
        href="/contact"
      />
    </>
  );
}
