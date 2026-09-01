import type { Metadata } from "next/types";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visa Assistance & Immigration Document Advisory",
  description:
    "Expert visa assistance and consultation in Ghana with Dellics Travels. 99.4% approval success rate for UK, USA, Canada, Schengen, Dubai, and South Africa visas.",
};

const COUNTRY_VISAS = [
  {
    country: "United Kingdom (UK)",
    category: "Standard Visitor (6 Months / 2 Years)",
    turnaround: "15–21 Working Days",
    approval: "99.2% Success Rate",
    flag: "🇬🇧",
    requirements: [
      "Bank statement audit (6 months)",
      "Proof of employment or business registration",
      "Confirmed flight reservation & itinerary",
      "Accommodation proof / host invitation letter",
    ],
  },
  {
    country: "Schengen Area (Europe)",
    category: "Short Stay Tourist / Business (Type C)",
    turnaround: "15–25 Working Days",
    approval: "98.8% Success Rate",
    flag: "🇪🇺",
    requirements: [
      "Valid passport (at least 6 months validity)",
      "Travel medical insurance (€30,000 minimum cover)",
      "Detailed daily travel itinerary",
      "Schengen application form completion",
    ],
  },
  {
    country: "United States of America (USA)",
    category: "B1/B2 Tourism & Business Visa",
    turnaround: "Expedited Appointment Prep",
    approval: "Comprehensive Coaching",
    flag: "🇺🇸",
    requirements: [
      "DS-160 online form review & submission",
      "Embassy visa fee payment confirmation",
      "Consular interview coaching session",
      "Supporting documentation binder preparation",
    ],
  },
  {
    country: "Canada",
    category: "Temporary Resident Visa (TRV)",
    turnaround: "30–45 Working Days",
    approval: "High Approval Track Record",
    flag: "🇨🇦",
    requirements: [
      "IRCC portal application filing",
      "Biometrics appointment booking (VFS Global)",
      "Proof of strong financial and social ties",
      "Detailed purpose-of-travel statement",
    ],
  },
  {
    country: "Dubai (United Arab Emirates)",
    category: "30-Day & 60-Day Tourist E-Visa",
    turnaround: "48–72 Hours",
    approval: "100% Guaranteed Issuance",
    flag: "🇦🇪",
    requirements: [
      "Clear passport bio-data page copy",
      "Passport-sized photograph with white background",
      "Return flight ticket booking",
      "Delivered electronically directly to your email",
    ],
  },
  {
    country: "South Africa",
    category: "Visitor & Holiday Visa",
    turnaround: "10–14 Working Days",
    approval: "Fast Track Processing",
    flag: "🇿🇦",
    requirements: [
      "DHA application forms preparation",
      "Proof of funds and flight reservations",
      "Hotel reservation proof in South Africa",
      "VFS appointment scheduling",
    ],
  },
];

const ROADMAP = [
  {
    step: "01",
    title: "Eligibility & Case Assessment",
    description: "We review your passport history, travel goals, employment status, and financial profile to identify the strongest application strategy.",
  },
  {
    step: "02",
    title: "Document Curation & Audit",
    description: "Our certified document analysts review bank statements, employer letters, and invitation affidavits to ensure 100% embassy compliance.",
  },
  {
    step: "03",
    title: "Form Submission & Appointments",
    description: "We complete official government portals, pay visa fees, and secure early biometric and embassy consular interview slots.",
  },
  {
    step: "04",
    title: "Interview Coaching & Collection",
    description: "Receive one-on-one mock consular interview coaching so you present your application with clarity and confidence.",
  },
];

export default function VisaPage() {
  return (
    <>
      <PageHero
        title="Visa Assistance & Document Consultation"
        subtitle="Navigate international embassy requirements with confidence. Over 3,000 successful visa applications guided by certified immigration document consultants."
        image="/images/services/documentation-support.jpg"
        breadcrumbs={[{ label: "Visa Assistance" }]}
      />

      {/* Country Requirements Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Supported Destinations"
          title="Visa Advisory for Major Global Embassies"
          subtitle="Select your target country to review turnaround times, required supporting documents, and application advisory."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRY_VISAS.map((visa) => (
            <div
              key={visa.country}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{visa.flag}</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 font-bold px-3 py-1 text-xs border border-emerald-200">
                    {visa.approval}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-navy">
                  {visa.country}
                </h3>
                <p className="mt-1 text-xs font-semibold text-brand-orange">
                  {visa.category}
                </p>
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Estimated Turnaround: {visa.turnaround}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy mb-2">
                    Key Requirements:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {visa.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/70">
                <Link
                  href={`/inquire?service=visa&country=${encodeURIComponent(visa.country)}&category=${encodeURIComponent(visa.category)}`}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 text-xs shadow-sm transition-colors"
                >
                  <span>Request Visa Consultation</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Stage Application Roadmap */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Proven Process"
            title="The 4-Step Visa Advisory Roadmap"
            subtitle="We eliminate paperwork stress, prevent common refusal mistakes, and maximize your visa issuance success."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm"
              >
                <span className="font-display text-3xl font-extrabold text-brand-orange/30">
                  {item.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethical Transparency Note */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-6 sm:p-8 flex items-start gap-4">
          <AlertCircle className="size-6 text-amber-600 shrink-0 mt-1" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed space-y-1">
            <p className="font-bold text-amber-950">Important Regulatory Notice:</p>
            <p>
              Dellics Travels is a registered travel management and documentation advisory firm. Final visa issuance decisions are made exclusively by the respective national embassies and consular authorities. We do not manufacture fraudulent documents; we ensure your legitimate documentation is presented accurately and completely in strict adherence to international immigration standards.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready To Start Your Visa Application?"
        copy="Book a confidential 1-on-1 consultation with our senior visa document specialist today."
        label="Schedule Consultation"
        href="/inquire"
      />
    </>
  );
}
