import type { Metadata } from "next/types";
import { ShieldCheck, Lock, Eye, FileText, Database, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection",
  description:
    "Dellics Travels Privacy Policy. Learn how we collect, protect, and handle your travel booking and personal data in compliance with the Ghana Data Protection Act.",
};

const CLAUSES = [
  {
    icon: Database,
    title: "1. Information We Collect",
    text: "When you interact with Dellics Travels (via our website, booking search widgets, inquiry forms, or WhatsApp support), we collect personal details necessary to process travel reservations. This includes your full legal name, passport information (for international flight ticketing and visa processing), email address, contact telephone number, and payment transaction details.",
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    text: "Your personal data is used exclusively to search, reserve, issue, and manage your travel bookings with airlines (GDS Amadeus/Travelport), hotels (RateHawk), airport transfer chauffeurs, and embassy visa authorities. We do not sell, rent, or monetize your personal data with third-party advertisers under any circumstances.",
  },
  {
    icon: ShieldCheck,
    title: "3. Ghana Data Protection Act (Act 843) Compliance",
    text: "Dellics Travels adheres strictly to the principles of lawful processing, minimization, accuracy, and storage limitation outlined in the Ghana Data Protection Act 2012 (Act 843). Your personal records are retained only for the duration required to service your booking and fulfill statutory accounting obligations.",
  },
  {
    icon: Lock,
    title: "4. Data Security & Encryption",
    text: "All digital transmissions between your browser and our servers are encrypted using modern TLS protocols. Electronic payments processed through our Paystack gateway comply with PCI-DSS Level 1 security standards; sensitive credit card details are never stored on our local web servers.",
  },
  {
    icon: FileText,
    title: "5. Your Rights as a Data Subject",
    text: "Under applicable data protection legislation, you retain the right to access, rectify, or request deletion of your personal records from our active reservation systems upon conclusion of your travel itinerary, subject to airline and legal recordkeeping requirements.",
  },
  {
    icon: Mail,
    title: "6. Data Protection Inquiries",
    text: `For questions regarding this privacy policy or to exercise your data subject rights, please contact our Data Compliance Officer at ${SITE.email} or by post to Dellics Travels, Community 25 Devtraco Estate, P.O. Box CO 2686, Tema, Ghana.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy & Data Protection"
        subtitle="Last Updated: August 2026 · Committed to safeguarding your personal travel details and transaction security."
        badge="Legal & Compliance"
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {CLAUSES.map((clause) => {
            const Icon = clause.icon;
            return (
              <div
                key={clause.title}
                className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    {clause.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 pl-13">
                  {clause.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
