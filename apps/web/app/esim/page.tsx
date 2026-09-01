import type { Metadata } from "next/types";
import Link from "next/link";
import {
  Wifi,
  QrCode,
  Smartphone,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { EsimPlansGrid } from "@/components/esim/esim-plans-grid";

export const metadata: Metadata = {
  title: "Instant Global eSIM Data Plans — Dellics Travels",
  description:
    "Stay connected worldwide in 200+ countries with digital eSIM data plans powered by Airalo. Instant QR code delivery, keep your WhatsApp number, zero roaming fees.",
};

interface EsimPlan {
  id: string;
  country: string;
  flag: string;
  region: string;
  data: string;
  validity: string;
  price: string;
  operator: string;
  popular?: boolean;
}

const POPULAR_PLANS: EsimPlan[] = [
  {
    id: "esim-gh-1",
    country: "Ghana",
    flag: "🇬🇭",
    region: "West Africa",
    data: "3 GB",
    validity: "30 Days",
    price: "$12",
    operator: "MTN / Telecel 4G",
    popular: true,
  },
  {
    id: "esim-uk-1",
    country: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    data: "5 GB",
    validity: "30 Days",
    price: "$15",
    operator: "Vodafone / EE 5G",
    popular: true,
  },
  {
    id: "esim-us-1",
    country: "United States",
    flag: "🇺🇸",
    region: "North America",
    data: "5 GB",
    validity: "30 Days",
    price: "$16",
    operator: "T-Mobile / AT&T 5G",
    popular: true,
  },
  {
    id: "esim-ae-1",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Middle East",
    data: "3 GB",
    validity: "30 Days",
    price: "$18",
    operator: "du / Etisalat 5G",
    popular: true,
  },
  {
    id: "esim-eu-1",
    country: "Europe Regional (39 Countries)",
    flag: "🇪🇺",
    region: "Regional",
    data: "10 GB",
    validity: "30 Days",
    price: "$32",
    operator: "Multi-Carrier High Speed",
    popular: true,
  },
  {
    id: "esim-gl-1",
    country: "Global (130+ Countries)",
    flag: "🌐",
    region: "Worldwide",
    data: "5 GB",
    validity: "60 Days",
    price: "$38",
    operator: "Global Roaming Network",
  },
  {
    id: "esim-za-1",
    country: "South Africa",
    flag: "🇿🇦",
    region: "Southern Africa",
    data: "5 GB",
    validity: "30 Days",
    price: "$19",
    operator: "Vodacom / MTN 5G",
  },
  {
    id: "esim-ca-1",
    country: "Canada",
    flag: "🇨🇦",
    region: "North America",
    data: "5 GB",
    validity: "30 Days",
    price: "$22",
    operator: "Rogers / Bell LTE",
  },
  {
    id: "esim-fr-1",
    country: "France",
    flag: "🇫🇷",
    region: "Europe",
    data: "5 GB",
    validity: "30 Days",
    price: "$14",
    operator: "Orange / SFR 5G",
  },
];

const ESIM_FEATURES = [
  {
    icon: Zap,
    title: "Instant Digital QR Delivery",
    description:
      "Delivered to your email and WhatsApp within 60 seconds of checkout. Ready before your flight takes off.",
  },
  {
    icon: Smartphone,
    title: "Keep Your Existing Number",
    description:
      "Your physical SIM stays active for WhatsApp calls, banking OTPs, and text messages. No physical swaps required.",
  },
  {
    icon: Globe2,
    title: "200+ Destinations Covered",
    description:
      "Powered by tier-1 global carriers through our Airalo roaming partnership, giving you 4G and 5G local speeds.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Roaming Shock Fees",
    description:
      "Prepaid digital data. No hidden charges, no bill shock on your return. What you see is exactly what you pay.",
  },
];

const COMPATIBLE_DEVICES = [
  "Apple iPhone XS, XR, 11, 12, 13, 14, 15, 16 & SE (2nd/3rd Gen)",
  "Samsung Galaxy S20, S21, S22, S23, S24 Series, Z Flip & Z Fold",
  "Google Pixel 3, 4, 5, 6, 7, 8, 9 Series",
  "iPad Pro (11-inch & 12.9-inch Cellular models), iPad Air, iPad Mini",
];

export default function EsimPage() {
  return (
    <>
      <PageHero
        title="Instant Global eSIM Data Plans"
        subtitle="Connect seamlessly in 200+ countries with digital eSIM data. Zero plastic, zero roaming shock, instant QR activation."
        image="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1600&auto=format&fit=crop"
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: "eSIM Data Plans" }]}
      />

      {/* Value Proposition Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          eyebrow="Modern Travel Connectivity"
          title="Why Global Travelers Choose Dellics eSIM"
          subtitle="Arrive at any international airport connected the moment your plane wheels touch down."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ESIM_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-3xl bg-white p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-5">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-display text-base font-bold text-navy mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular eSIM Data Packages Grid */}
      <section className="bg-slate-50/80 py-20 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Airalo Roaming Partner
              </span>
              <h2 className="font-display text-3xl font-extrabold text-navy mt-1 tracking-tight">
                Top Travel Destination Plans
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              ⚡ Instant QR Code Dispatch
            </span>
          </div>

          <EsimPlansGrid plans={POPULAR_PLANS} />
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Simple 3-Minute Setup"
          title="How to Activate Your Digital Travel eSIM"
          subtitle="No technician needed. You can install your profile from home before you head to the airport."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-navy text-white font-display text-xl font-bold mb-5 shadow-md">
              1
            </div>
            <h3 className="font-display text-lg font-bold text-navy mb-2">
              Choose Destination & Plan
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Pick your country or multi-country region and select the data volume that matches your stay.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-orange text-white font-display text-xl font-bold mb-5 shadow-md">
              2
            </div>
            <h3 className="font-display text-lg font-bold text-navy mb-2">
              Receive Your QR Code
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Your digital eSIM profile QR code is emailed to you instantly with simple 1-step iOS and Android instructions.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-white font-display text-xl font-bold mb-5 shadow-md">
              3
            </div>
            <h3 className="font-display text-lg font-bold text-navy mb-2">
              Scan & Connect On Arrival
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Scan the QR in your phone’s Cellular settings. Turn on data roaming upon landing, and you are online!
            </p>
          </div>
        </div>

        {/* Compatible Devices Accordion Box */}
        <div className="mt-16 rounded-3xl bg-navy-dark p-8 sm:p-10 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Hardware Verification
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">
                Is My Smartphone eSIM-Compatible?
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white/90">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              Most 2019+ phones supported
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 max-w-3xl mb-6">
            Almost all modern unlocked smartphones support digital eSIM profiles alongside your physical nano-SIM card.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 text-xs text-slate-200">
            {COMPATIBLE_DEVICES.map((device) => (
              <div
                key={device}
                className="flex items-center gap-2.5 rounded-xl bg-white/5 p-3 border border-white/10"
              >
                <Smartphone className="size-4 text-brand-orange shrink-0" />
                <span>{device}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need a Custom Multi-Country Corporate eSIM Bundle?"
        copy="Traveling across multiple regions or organizing data plans for a corporate delegation? We provide centralized billing and bulk provisioning."
        label="Request Corporate eSIM Quote"
        href="/inquire?service=corporate_esim"
      />
    </>
  );
}
