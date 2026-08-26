import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Dellics Travels – Ghana's trusted travel agency. Call, WhatsApp or email us to book affordable flights, Tours, hotel stays and airport transfers. Based in Tema, Ghana.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Get In Touch" subtitle="We'd love to help plan your perfect trip. Reach out by phone, email, WhatsApp or the form below — we respond within 24 hours" />
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="space-y-6 rounded-card bg-navy p-6 text-white">
          <div>
            <h2 className="font-display text-lg font-semibold text-brand-orange">Direct lines</h2>
            <p className="mt-2 text-sm text-white/80">{SITE.phoneDisplay}</p>
            <p className="text-sm text-white/80">{SITE.email}</p>
            <p className="text-sm text-white/80">{SITE.address}</p>
          </div>
          <p className="text-sm text-white/60">Form messages are stored and emailed to our team — no message gets lost.</p>
        </aside>
      </section>
    </>
  );
}
