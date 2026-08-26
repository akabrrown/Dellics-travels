import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections, type ContentSection } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Corporate Travel",
  description:
    "Corporate travel management by Dellics Travels Ghana. End-to-end business travel solutions — visa support, multi-destination bookings, group flights, hotel coordination and dedicated account management.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Your Trusted Corporate Travel Partner",
    paragraphs: [
      "Dellics Travels manages all aspects of your company's travel — so your team can focus on the business, not the logistics",
    ],
  },
  {
    heading: "Complete Corporate Travel Solutions",
    paragraphs: [
      "From booking international business flights and hotel stays to arranging airport pickups, visa documentation and travel insurance — we handle every detail so your team arrives ready to work.",
    ],
    bullets: [
      "Multi-destination corporate flight booking",
      "Hotel accommodation for traveling staff",
      "Visa application guidance & support",
      "Dedicated account manager for your company",
      "Monthly travel reporting & invoicing",
      "Emergency travel support 24/7",
    ],
  },
  {
    heading: "Multi-Destination Bookings",
    paragraphs: [
      "Business trips that span multiple cities or countries handled seamlessly — with optimized routing and pricing for your itinerary.",
    ],
  },
  {
    heading: "Group Staff Travel",
    paragraphs: [
      "Coordinating travel for multiple employees at once — flights, hotels and transfers all handled under one streamlined booking.",
    ],
  },
  {
    heading: "Travel Policy Management",
    paragraphs: [
      "We work within your company's travel policy to ensure all bookings are compliant, cost-controlled and properly documented.",
    ],
  },
];

export default function CorporatePage() {
  return (
    <>
      <PageHero
        title="Corporate Travel Management"
        subtitle="Complete business travel solutions for every company."
      />
      <ContentSections sections={SECTIONS} />
      <CtaBanner
        title="Partner with Dellics for Your Corporate Travel"
        copy="Join the growing list of companies that trust Dellics Travels with all their business travel needs. Get a dedicated account manager, preferred rates and priority service."
        label="Get a Corporate Quote"
        href="/contact"
      />
    </>
  );
}
