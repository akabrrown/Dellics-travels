import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections } from "@/components/content-sections";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy | Dellics Travels",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="Last updated: July 2025" />
      <ContentSections
        sections={[
          {
            heading: "1. Information We Collect",
            paragraphs: [
              "When you contact Dellics Travels or submit a booking inquiry, we collect personal information such as your name, email address, phone number and travel preferences. We use this information solely to respond to your inquiries and provide travel services.",
            ],
          },
          {
            heading: "2. How We Use Your Information",
            paragraphs: [
              "Your personal information is used to process travel bookings, respond to inquiries, send booking confirmations and occasionally send promotional offers related to our travel services. We do not sell or share your personal data with third parties except where necessary to fulfill your travel bookings (e.g., airlines, hotels).",
            ],
          },
          {
            heading: "3. Data Security",
            paragraphs: [
              "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure or destruction. All communications through our website are encrypted where possible.",
            ],
          },
          {
            heading: "4. Cookies",
            paragraphs: [
              "This website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings, though some features of the site may not function correctly as a result.",
            ],
          },
          {
            heading: "5. Contact Us",
            paragraphs: [
              "If you have any questions about this privacy policy or how we handle your data, please contact us at info@dellicstravels.com or call +233 55 205 4174.",
            ],
          },
        ]}
      />
    </>
  );
}
