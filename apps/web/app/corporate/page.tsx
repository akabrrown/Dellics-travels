import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Building2,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corporate Travel Management & Business Accounts",
  description:
    "End-to-end corporate travel solutions for companies in Ghana and multinational enterprises. Monthly consolidated billing, executive flights, visas and dedicated account managers.",
};

const CORPORATE_SERVICES = [
  {
    icon: Plane,
    title: "Executive Flights & Flexible Routing",
    description: "Book complex multi-leg corporate itineraries across Star Alliance, SkyTeam, and oneworld with instant ticket modifications and corporate fare rules.",
  },
  {
    icon: Building2,
    title: "Corporate Hotel Portfolios",
    description: "Access negotiated corporate rates at top business hotels worldwide with high-speed internet, late check-out privileges, and breakfast included.",
  },
  {
    icon: Users,
    title: "Conference & Trade Mission Delegations",
    description: "Flawless group flight blocks, dedicated airport coach logistics, and hotel floor buy-outs for corporate retreats and trade delegations.",
  },
  {
    icon: FileText,
    title: "Expedited Business Visa Processing",
    description: "Fast-track documentation support, embassy appointment priority, and invitation letter audits for executives and traveling staff.",
  },
  {
    icon: CreditCard,
    title: "Consolidated Monthly Invoicing",
    description: "Eliminate messy employee reimbursement receipts. Receive transparent monthly VAT statements with complete expense breakdowns by department.",
  },
  {
    icon: UserCheck,
    title: "Dedicated Account Manager",
    description: "A seasoned corporate travel specialist assigned specifically to your company, reachable via direct phone line and priority email 24/7.",
  },
];

const STATS = [
  { value: "45+", label: "Corporate Retainers", sub: "Banks, NGOs & Enterprises" },
  { value: "100%", label: "Policy Compliance", sub: "Strict budget caps enforced" },
  { value: "< 15min", label: "Average Response Time", sub: "Dedicated corporate desk" },
  { value: "30-Day", label: "Credit Terms Available", sub: "For vetted corporate clients" },
];

export default function CorporatePage() {
  return (
    <>
      <PageHero
        title="Corporate Travel Management & Enterprise Solutions"
        subtitle="Streamline your company's global business travel. We manage flights, executive accommodations, visas, and VIP logistics under one unified account."
        image="/images/services/corporate-travel-management.jpg"
        breadcrumbs={[{ label: "Corporate Travel" }]}
      />

      {/* Stats Counter Strip */}
      <section className="relative z-20 -mt-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xl">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center p-2">
              <p className="font-display text-3xl font-extrabold text-brand-orange">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-bold text-navy">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-500">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Capabilities Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Enterprise Services"
          title="Engineered for Fast-Moving Organizations"
          subtitle="From local startup founders to multinational executives, we take the friction out of business travel logistics."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CORPORATE_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="group flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand-orange/30 hover:-translate-y-1"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-5 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-orange">
                  <span>Corporate Level Service</span>
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How To Open a Corporate Account */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Account Setup"
                title="Straightforward Corporate Onboarding"
                subtitle="Open a dedicated corporate travel account in three clear steps."
              />

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-navy">
                      Initial Consultation & Policy Review
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      We understand your travel frequency, preferred airlines, departmental budget limits, and invoicing requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-navy">
                      Dedicated Concierge Assigned
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Your company is paired with a certified corporate travel desk officer and an executive VIP escalation line.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-navy">
                      Direct Bookings & Invoicing
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Traveling employees simply message or email your account manager. Tickets are issued same-day and billed to your corporate ledger.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-lg">
                  <Link href="/inquire?service=corporate" className="inline-flex items-center gap-2">
                    <span>Open Corporate Account</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden rounded-3xl shadow-xl border border-slate-200">
              <Image
                src="/images/services/corporate-travel-management.jpg"
                alt="Corporate Travel Services"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Corporate Partnership
                </p>
                <p className="mt-1 font-display text-xl font-bold">
                  “Dellics Travels cut our company travel overheads by 18% while guaranteeing 24/7 rebooking support for our traveling executives.”
                </p>
                <p className="mt-3 text-xs text-white/70">
                  — Head of HR & Operations, West Africa Energy Group
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Upgrade Your Company's Business Travel?"
        copy="Contact our corporate travel director today to discuss bespoke monthly billing and wholesale corporate flight fares."
        label="Request Corporate Proposal"
        href="/inquire"
      />
    </>
  );
}
