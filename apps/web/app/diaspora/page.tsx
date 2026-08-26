import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections, type ContentSection } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Diaspora Travel",
  description:
    "Dellics Travels diaspora tourism services — specialized heritage tours for African diaspora. Connect with your roots through authentic cultural experiences and historical journeys.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Return to Your Roots",
    paragraphs: [
      "Specialized tours designed for the African diaspora — experience the warmth of home, the depth of history, and the richness of culture.",
    ],
  },
  {
    heading: "Cape Coast Castle Experience",
    paragraphs: [
      "Walk through the dungeons, stand at the Door of No Return, and experience the profound journey of ancestral connection. Our expert guides provide sensitive, historically accurate narratives that honor both the pain and resilience of our shared history.",
    ],
    bullets: [
      "Expert heritage guides",
      "Private group tours available",
      "Ceremonial experiences",
    ],
  },
  {
    heading: "Ghana's Natural Wonders",
    paragraphs: [
      "Experience the breathtaking beauty of Ghana's landscapes — from the Kakum Canopy Walkway to the Wli Waterfalls. Connect with the land your ancestors called home through immersive nature experiences.",
    ],
    bullets: [
      "Canopy walkway adventure",
      "Waterfall excursions",
      "Eco-tourism experiences",
    ],
  },
  {
    heading: "Ancestral Connections",
    paragraphs: [
      "Genealogy research and family tracing services to help you connect with your specific ancestral lineage.",
    ],
  },
  {
    heading: "Cultural Immersion",
    paragraphs: [
      "Live like a local — village stays, traditional ceremonies, craft workshops, and authentic cultural experiences.",
    ],
  },
  {
    heading: "Community Engagement",
    paragraphs: [
      "Meet local communities, participate in development projects, and build lasting connections with Ghana.",
    ],
  },
  {
    heading: "Custom Itineraries",
    paragraphs: [
      "Personalized heritage journeys tailored to your specific interests, family history, and travel goals.",
    ],
  },
];

export default function DiasporaPage() {
  return (
    <>
      <PageHero
        title="Diaspora Tourism"
        subtitle="Connect with your African roots through authentic heritage experiences, cultural journeys and meaningful homecoming tours"
      />
      <ContentSections sections={SECTIONS} />
      <CtaBanner
        title="Begin Your Homecoming Journey"
        copy="Contact our diaspora tourism specialists to plan your meaningful return to Africa."
        label="Plan Your Journey"
        href="/contact"
      />
    </>
  );
}
