import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections, type ContentSection } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Visa Assistance",
  description:
    "Dellics Travels visa assistance services — expert visa processing, documentation support, embassy appointments for all destinations. Hassle-free travel documentation.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Hassle-Free Visa Processing",
    paragraphs: [
      "Navigate complex visa requirements with ease. Our experts handle everything from documentation to embassy submissions.",
    ],
  },
  {
    heading: "Professional Visa Guidance",
    paragraphs: [
      "Our visa experts provide personalized consultation for your destination. We assess your eligibility, explain requirements, and guide you through the entire process. Whether tourist, business, or student visas — we've got you covered.",
    ],
    bullets: [
      "Free initial consultation",
      "Destination-specific guidance",
      "Document checklist provided",
    ],
  },
  {
    heading: "Complete Documentation Support",
    paragraphs: [
      "We prepare and review all your visa documents to ensure they meet embassy standards. From application forms to supporting documents, we handle the paperwork so you don't have to worry about errors or delays.",
    ],
    bullets: [
      "Application form completion",
      "Document verification",
      "Photo specification compliance",
    ],
  },
  {
    heading: "Tourist Visas",
    paragraphs: [
      "Holiday and leisure travel visas for all major destinations. Quick processing with high approval rates.",
    ],
  },
  {
    heading: "Business Visas",
    paragraphs: [
      "Corporate travel visas including conference, meeting, and business trip documentation.",
    ],
  },
  {
    heading: "Student Visas",
    paragraphs: [
      "Education visa processing for students pursuing studies abroad. Complete academic documentation support.",
    ],
  },
  {
    heading: "Expedited Processing",
    paragraphs: [
      "Urgent visa services for last-minute travel. Fast-track options available for eligible destinations.",
    ],
  },
];

export default function VisaPage() {
  return (
    <>
      <PageHero
        title="Visa Assistance Services"
        subtitle="Expert visa processing and consultation for all destinations — we handle documentation, appointments and embassy submissions"
      />
      <ContentSections sections={SECTIONS} />
      <CtaBanner
        title="Need Visa Assistance?"
        copy="Contact our visa experts today for a free consultation and let us handle your travel documentation."
      />
    </>
  );
}
