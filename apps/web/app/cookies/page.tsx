import type { Metadata } from "next/types";
import { Cookie, ShieldCheck, Settings, Database, Info, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Dellics Travels Online Travel Company Cookie Policy. Understand how we use essential, performance, and functionality cookies to enhance your booking experience.",
};

const SECTIONS = [
  {
    icon: Cookie,
    title: "1. What Are Cookies",
    text: "Cookies are small data files stored on your device when you visit Dellics Travels. They enable our web platform to remember your session, selected travel dates, flight preferences, and currency settings between pages.",
  },
  {
    icon: Database,
    title: "2. Types of Cookies We Use",
    text: "We use strictly necessary cookies (essential for authentication, secure Stripe/Paystack checkout, and reservation holding), performance cookies (to monitor portal response times and server reliability), and functional cookies (to preserve your search filters, preferred currency, and language selections).",
  },
  {
    icon: ShieldCheck,
    title: "3. Third-Party Integrations",
    text: "Certain technical services integrated into our platform — such as Paystack payment security, interactive airport map visualization, and Airalo eSIM provisioning telemetry — set secure cookies to process real-time travel transactions safely.",
  },
  {
    icon: Settings,
    title: "4. Managing Your Cookie Preferences",
    text: "You can modify or disable non-essential cookies at any time through your browser settings. Please note that disabling essential cookies may impact flight search availability, booking checkout, and account login features.",
  },
  {
    icon: Mail,
    title: "5. Cookie Inquiries & Compliance",
    text: `For inquiries regarding our cookie practices or data privacy standards, please contact our compliance team at ${SITE.email} or visit our headquarters at Community 25, Devtraco Estate, Tema, Greater Accra, Ghana.`,
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        title="Cookie Policy"
        subtitle="Transparent information on how Dellics Travels uses cookies to optimize and protect your travel booking journey."
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Cookie Policy" }]}
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-50 p-3 text-brand-orange shrink-0">
                    <Icon className="size-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-navy">
                      {section.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {section.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
