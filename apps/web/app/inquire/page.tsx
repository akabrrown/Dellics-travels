import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { InquireForm } from "@/components/forms/inquire-form";

export const metadata: Metadata = {
  title: "Inquire",
  description: "Inquire about your dream trip with Dellics Travels. Contact us via WhatsApp or email for personalized travel planning across Africa, Asia, Middle East and beyond.",
};

export default function InquirePage() {
  return (
    <>
      <PageHero title="Let's Plan Your Journey" subtitle="Share your travel dreams and we'll create a bespoke experience tailored just for you." />
      <section className="mx-auto max-w-2xl px-4 py-16">
        <InquireForm />
      </section>
    </>
  );
}
