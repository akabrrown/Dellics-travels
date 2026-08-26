import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections } from "@/components/content-sections";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service | Dellics Travels",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" subtitle="Last updated: July 2025" />
      <ContentSections
        sections={[
          {
            heading: "1. Acceptance of Terms",
            paragraphs: [
              "By using the Dellics Travels website or engaging our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
            ],
          },
          {
            heading: "2. Booking & Payments",
            paragraphs: [
              "All bookings made through Dellics Travels are subject to availability and confirmation. Prices quoted are valid at the time of booking and may change due to airline tariff changes. Full payment or an agreed deposit is required to confirm all bookings.",
            ],
          },
          {
            heading: "3. Cancellations & Refunds",
            paragraphs: [
              "Cancellation policies vary by airline, hotel and tour operator. Dellics Travels will communicate applicable cancellation terms at the time of booking. Service fees charged by Dellics Travels are generally non-refundable unless otherwise stated. For tour cancellations, a minimum of 48 hours notice is required for any refund consideration.",
            ],
          },
          {
            heading: "4. Travel Documents",
            paragraphs: [
              "It is the traveler's responsibility to ensure they hold a valid passport, required visas and any other travel documentation required for their destination. Dellics Travels provides guidance but accepts no liability for refused entry due to invalid or missing travel documents.",
            ],
          },
          {
            heading: "5. Liability",
            paragraphs: [
              "Dellics Travels acts as an agent for airlines, hotels and tour operators. We are not responsible for any delays, cancellations, accidents or losses caused by third-party service providers. We strongly recommend purchasing comprehensive travel insurance for all trips.",
            ],
          },
          {
            heading: "6. Contact",
            paragraphs: [
              "For any questions regarding these terms, contact us at info@dellicstravels.com or call +233 55 205 4174.",
            ],
          },
        ]}
      />
    </>
  );
}
