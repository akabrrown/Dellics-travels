import type { Metadata } from "next/types";
import { FileCheck2, CreditCard, RotateCcw, AlertTriangle, Scale, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service & Booking Conditions",
  description:
    "Dellics Travels Booking Terms & Conditions. Transparent guidelines on airline ticket issuance, cancellations, refunds, deposits, and traveler responsibilities.",
};

const TERMS = [
  {
    icon: Scale,
    title: "1. Acceptance of Terms & Agency Scope",
    text: "By engaging Dellics Travels for airline ticketing, hotel accommodation, tour packages, visa consultation, or airport transfers, you agree to be bound by these Booking Terms & Conditions. Dellics Travels acts as an IATA Certified travel management agency and premier tour operator.",
  },
  {
    icon: CreditCard,
    title: "2. Quotations, Pricing & Payment Terms",
    text: "Airline seat fares and hotel room rates are subject to live inventory changes and carrier tariff updates until full payment is received and official electronic tickets or hotel vouchers are issued. We accept payments in Ghanaian Cedi (GHS), USD, EUR, and GBP through Paystack (Momo, Bank Cards) and verified direct bank transfers.",
  },
  {
    icon: RotateCcw,
    title: "3. Cancellations, Rebooking & Refund Policy",
    text: "Cancellation, re-routing, and refund conditions are governed by the specific fare rules established by the respective airline, hotel, or tour provider. Dellics Travels facilitates ticket revalidation and refund claims on your behalf. Where tickets are non-refundable by airline policy, airline vouchers or partial tax refunds will be pursued. Tour cancellations require a minimum of 48 hours notice.",
  },
  {
    icon: FileCheck2,
    title: "4. Passports, Visas & Health Entry Regulations",
    text: "Travelers are legally responsible for holding valid travel documents (passports with at least 6 months validity from return date), transit visas, and mandatory health certificates. While Dellics provides professional visa consultation and document checks, sovereign embassies retain sole authority over final visa approvals and entry permissions.",
  },
  {
    icon: AlertTriangle,
    title: "5. Force Majeure & Flight Disruptions",
    text: "Dellics Travels is not liable for travel disruptions caused by severe weather events, airport strikes, airline operational delays, or acts of God. In the event of airline schedule changes, our 24/7 ticketing desk actively coordinates alternate flights and rebooking assistance.",
  },
  {
    icon: Mail,
    title: "6. Customer Support & Disputes",
    text: `For booking modifications, inquiries, or complaints, reach our client relations desk at ${SITE.email} or call ${SITE.phoneDisplay}. All contracts are governed under the laws of the Republic of Ghana.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service & Booking Conditions"
        subtitle="Last Updated: August 2026 · Transparent terms governing your travel bookings, flight ticketing, and tour packages."
        badge="Legal & Compliance"
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Terms of Service" }]}
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {TERMS.map((term) => {
            const Icon = term.icon;
            return (
              <div
                key={term.title}
                className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    {term.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 pl-13">
                  {term.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
