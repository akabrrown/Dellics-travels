import type { Metadata } from "next/types";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  PhoneCall,
  Lock,
} from "lucide-react";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { InquireForm } from "@/components/forms/inquire-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request Custom Trip Consultation & Quote",
  description:
    "Submit your custom trip requirements to Dellics Travels. We provide transparent flight quotes, bespoke tour itineraries, stays, and visa advisory within hours.",
};

const INQUIRY_PROMISES = [
  {
    icon: Clock,
    title: "Fast Response Time",
    text: "Receive personalized itineraries and pricing within hours of submission.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Hidden Surcharges",
    text: "All taxes, fees, and accommodation terms are itemized clearly upfront.",
  },
  {
    icon: Lock,
    title: "100% Privacy Guaranteed",
    text: "Your contact and travel preferences are strictly confidential.",
  },
];

export default function InquirePage() {
  return (
    <>
      <PageHero
        title="Design Your Custom Itinerary"
        subtitle="Tell us where you want to travel, your dates, and budget. Our senior travel specialists will craft a tailored proposal with flights, stays, and tours."
        badge="Custom Trip Planner"
        image="/images/services/plane.jpg"
        breadcrumbs={[{ label: "Trip Inquiry" }]}
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main Form Container */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-sm">
            <SectionHeading
              align="left"
              eyebrow="Custom Itinerary"
              title="Tell Us About Your Dream Trip"
              subtitle="Fill out your travel preferences below. No booking commitment required."
            />

            <div className="mt-8">
              <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Loading travel inquiry planner...</div>}>
                <InquireForm />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-navy-dark p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Need Quick Answers?
                </span>
                <h3 className="font-display text-xl font-bold">
                  Speak Directly With an Advisor
                </h3>
                <p className="text-xs leading-relaxed text-white/80">
                  Prefer to speak by phone or visit our offices in Sheridan, USA or Greater Accra, Ghana?
                </p>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 text-xs shadow-md transition-colors"
                  >
                    <PhoneCall className="size-4" />
                    <span>View Contact & Office Directory</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Promises Card */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
              <h4 className="font-display text-sm font-bold text-navy">
                The Dellics Planning Guarantee
              </h4>
              <div className="space-y-3 text-xs text-slate-600">
                {INQUIRY_PROMISES.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="flex items-start gap-2.5">
                      <Icon className="size-4 text-brand-orange shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-navy">{p.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{p.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
