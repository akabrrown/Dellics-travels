"use client";

import { ShieldCheck, Headset, Globe2, PlaneTakeoff, PiggyBank, Smartphone, Luggage, Users } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const features = [
  {
    name: "Everything You Need, In One Place",
    description: "From flights and hotels to tours, airport transfers, car rentals, eSIMs and visa assistance, Dellics helps you plan and manage your journey from start to finish.",
    icon: PlaneTakeoff,
  },
  {
    name: "Local Expertise. Global Travel.",
    description: "As a Ghanaian travel company with international reach, we understand the needs of African travellers while connecting them to destinations and travel experiences around the world.",
    icon: Globe2,
  },
  {
    name: "Competitive Travel Options",
    description: "We help travellers compare available options and find travel solutions that match their budget, schedule and preferences.",
    icon: PiggyBank,
  },
  {
    name: "Trusted & Secure",
    description: "Your journey matters to us. We focus on secure booking processes, reliable travel partners and transparent information so you can travel with greater confidence.",
    icon: ShieldCheck,
  },
  {
    name: "Easy Digital Booking",
    description: "Search, compare and book your travel services through the Dellics online platform, designed to make travel planning more convenient.",
    icon: Smartphone,
  },
  {
    name: "Human Support When Needed",
    description: "Technology makes booking easier, but our travel professionals remain available to provide guidance, assistance and personalised support when required.",
    icon: Headset,
  },
  {
    name: "Curated Travel Experiences",
    description: "Discover carefully selected holiday packages, tours, day escapes and Diaspora tourism experiences designed to make your trip more memorable.",
    icon: Luggage,
  },
  {
    name: "Built for Modern Travellers",
    description: "Whether you are travelling for business, leisure, family, study, or exploration, Dellics brings multiple travel solutions together to simplify your journey.",
    icon: Users,
  },
];

export function TrustSection() {
  return (
    <section className="bg-navy py-24 border-y border-navy-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Travel Smarter. Travel Better. Travel with Dellics."
            title="Why Travellers Choose Dellics"
            dark={true}
            subtitle="At Dellics Travels, we make travel simpler, more convenient and more rewarding by bringing essential travel services together in one trusted platform."
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
                <p className="text-sm leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center rounded-3xl bg-navy-light/30 border border-white/5 p-8 max-w-3xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-white mb-4">Your Journey. Our Commitment.</h3>
          <p className="text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
            We don't just help you book a trip. We help you travel with confidence.
          </p>
          <div className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-medium text-sm">
            * Dellics Travels — Your Journey, Our Commitment
          </div>
        </div>
      </div>
    </section>
  );
}
