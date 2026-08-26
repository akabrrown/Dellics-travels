import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections, type ContentSection } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Airport Transfers",
  description:
    "Professional airport transfer services in Ghana by Dellics Travels. Comfortable meet-and-greet, punctual pickups at Kotoka International Airport, Cape Coast and all Ghana airports.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Reliable Airport Transfers",
    paragraphs: [
      "From the moment you land, we've got you covered. Our professional drivers track your flight, greet you at arrivals and take you safely to your destination",
    ],
  },
  {
    heading: "Your Stress-Free Airport Experience",
    paragraphs: [
      "Landing in a new country can be stressful. With Dellics Travels airport transfers, a professional driver will be waiting for you at arrivals — name board in hand — ready to take you safely and comfortably to your hotel or destination.",
    ],
    bullets: [
      "Professional, uniformed drivers",
      "Clean, air-conditioned vehicles",
      "Flight tracking — we adjust for delays",
      "Meet & greet at Kotoka International Airport",
      "Available for groups, families & VIPs",
      "Fixed rates — no hidden charges",
    ],
  },
  {
    heading: "Sedan / Saloon",
    paragraphs: [
      "Comfortable air-conditioned sedan for 1–3 passengers. Perfect for solo travelers and business visitors arriving at Kotoka Airport.",
    ],
  },
  {
    heading: "SUV / 4x4",
    paragraphs: [
      "Spacious, comfortable SUVs for families and groups of up to 6. Ideal for touring Ghana's road network and longer intercity transfers.",
    ],
  },
  {
    heading: "Minibus / Coach",
    paragraphs: [
      "Spacious minibuses and coaches for groups of 7–30 passengers. Perfect for tour groups, church trips, corporate teams and large families.",
    ],
  },
];

export default function TransfersPage() {
  return (
    <>
      <PageHero title="Airport Transfer Services" />
      <ContentSections sections={SECTIONS} />
      <CtaBanner
        title="Book Your Airport Transfer"
        copy="Tell us your flight details and we'll have a driver waiting for you at arrivals. No stress. No surprises."
        label="Book a Transfer"
      />
    </>
  );
}
