import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Crown,
  Trees,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";
import { getTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Diaspora Homecoming & Heritage Tourism Ghana",
  description:
    "Connect with your ancestral roots through Dellics Travels heritage tours in Ghana. Cape Coast Castle, Door of Return, traditional naming ceremonies, and Ashanti Kingdom.",
};

export default async function DiasporaPage() {
  const diasporaPackages = await getTours({ segment: 'DIASPORA' }).catch(() => []);
  return (
    <>
      <PageHero
        title="Diaspora Homecoming & Heritage Tourism"
        subtitle="Return to your roots. Deeply meaningful, respectful, and transformative ancestral experiences across Ghana with licensed heritage historians."
        image="/images/africa/cape-coast-castle.jpg"
        breadcrumbs={[{ label: "Diaspora Travel" }]}
      />

      {/* Signature Heritage Experiences */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Ancestral Heritage"
          title="Curated Heritage & Homecoming Expeditions"
          subtitle="Every itinerary is designed to connect you deeply with the history, soil, culture, and people of Ghana."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {diasporaPackages.length > 0 ? diasporaPackages.map((exp) => (
            <article
              key={exp.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={exp.image || "/images/africa/cape-coast-castle.jpg"}
                  alt={exp.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3.5 py-1 text-xs font-bold text-white shadow-md">
                  {exp.badge || "Heritage Tour"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  {exp.destination}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-navy">
                  {exp.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {exp.copy}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-6 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy mb-3">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {exp.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    Available All Year Round
                  </span>
                  <Link
                    href={`/inquire?service=diaspora&package=${encodeURIComponent(exp.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>Plan Pilgrimage</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why Choose Dellics for Diaspora Travel */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Dellics Standard"
            title="A Sacred Return, Managed With Care"
            subtitle="We treat your return to Africa with the dignity, historical reverence, and security you deserve."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DIASPORA_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Walk the Soil of Your Ancestors?"
        copy="Talk directly with our diaspora tourism coordinator. We will craft a respectful, customized homecoming itinerary for you and your family."
        label="Start Your Homecoming Plan"
        href="/inquire"
      />
    </>
  );
}


