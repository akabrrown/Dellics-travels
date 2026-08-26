import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ContentSections } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Dellics Travels — Ghana's trusted travel agency. Learn our story, mission, values and the expert team behind your unforgettable travel experiences.",
};

const DRIVERS = [
  {
    name: "Our Mission",
    copy: "To provide affordable, reliable and expertly curated travel services that create meaningful connections between travelers and the incredible destinations they explore across Africa and the world.",
  },
  {
    name: "Our Vision",
    copy: "To be Africa's most trusted travel agency known for outstanding customer service, unbeatable value and unforgettable experiences that bring people closer to the world's rich culture and history.",
  },
  {
    name: "Our Values",
    copy: "Integrity in every booking. Personalized service for every traveler. Respect for the cultures and histories we showcase. Excellence in everything we do.",
  },
];

const STATS = [
  { value: "3,000+", label: "Happy Travelers" },
  { value: "40+", label: "Destinations Covered" },
  { value: "4.9", label: "Client Rating" },
  { value: "24/7", label: "Support Available" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Dellics Travels"
        subtitle="Ghana's trusted travel partner — crafting unforgettable journeys with passion, expertise & genuine care"
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Our Story" title="Born from a Passion for Travel" align="left" />
        <ContentSections
          sections={[
            {
              paragraphs: [
                "Dellics Travels was founded with a single mission to make quality travel accessible, affordable and deeply meaningful especially for those journeying to discover Africa's rich heritage and beyond.",
                "Based in Tema, Ghana, we specialize in everything from affordable international flight tickets to immersive tours across Africa and the world. From Kenya safaris and Zanzibar beaches to South Africa adventures, Dubai luxury and Ghana heritage sites like Cape Coast Castle and Kakum National Park. We also serve corporate clients with full travel management solutions.",
                "Our team of experienced travel consultants brings genuine local knowledge, trusted airline connections, and a personal touch that larger agencies simply can't match. When you travel with Dellics, you travel with people who care.",
              ],
            },
          ]}
        />
      </div>

      <section className="bg-navy/5 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="What Drives Us" title="Our Mission, Vision & Values" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DRIVERS.map((driver) => (
              <div key={driver.name} className="rounded-card border border-black/5 bg-white p-8 shadow-sm">
                <h3 className="font-display text-xl font-semibold text-navy">{driver.name}</h3>
                <p className="mt-3 text-slate-body">{driver.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="By The Numbers" title="Trusted by Thousands" />
          <div className="mt-10 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-card bg-navy/5 p-8">
                <p className="font-display text-5xl font-extrabold text-brand-orange">{stat.value}</p>
                <p className="mt-2 font-semibold text-navy">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Travel with Us?"
        copy="Let our expert team plan your perfect Ghana experience or international trip at an unbeatable price."
        label="Contact Us"
        href="/contact"
      />
    </>
  );
}
