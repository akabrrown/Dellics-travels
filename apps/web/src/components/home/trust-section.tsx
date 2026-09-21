"use client";

import { ShieldCheck, Award, BadgeCheck, Lock, Wallet, Headset, Globe2, Clock } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const features = [
  {
    name: "IATA Accredited",
    description: "Internationally recognized and certified to issue airline tickets globally.",
    icon: Award,
  },
  {
    name: "Licensed Travel Agency in Ghana",
    description: "Fully registered and compliant with all local tourism and business regulations.",
    icon: ShieldCheck,
  },
  {
    name: "TOUGHA Member",
    description: "Proud member of the Tour Operators Union of Ghana, upholding high industry standards.",
    icon: BadgeCheck,
  },
  {
    name: "Secure Online Booking",
    description: "Enterprise-grade encryption protecting your personal and payment data.",
    icon: Lock,
  },
  {
    name: "Transparent Pricing",
    description: "No hidden fees or surprise charges. What you see is exactly what you pay.",
    icon: Wallet,
  },
  {
    name: "Dedicated Travel Support",
    description: "A personal consultant assigned to manage your end-to-end travel experience.",
    icon: Headset,
  },
  {
    name: "Ghana & International Operations",
    description: "Local expertise paired with a strong global network of premium suppliers.",
    icon: Globe2,
  },
  {
    name: "24/7 Concierge Support",
    description: "Round-the-clock assistance for flight changes, emergencies, or last-minute requests.",
    icon: Clock,
  },
];

export function TrustSection() {
  return (
    <section className="bg-navy py-24 border-y border-navy-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Trust & Reliability"
            title="Why Thousands of Travelers Choose Dellics"
            dark={true}
            subtitle="We are committed to delivering secure, premium, and stress-free travel experiences."
          />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.name}
                className="group rounded-3xl bg-navy-light/40 border border-white/10 p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-orange/20 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-xs leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
