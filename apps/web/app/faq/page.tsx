"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Plane,
  Building2,
  FileCheck2,
  Heart,
  CreditCard,
  Smartphone,
  HelpCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE } from "@/lib/site";

interface FAQItem {
  id: string;
  category: "all" | "flights" | "hotels" | "visa" | "diaspora" | "payments" | "esim_transfers";
  categoryLabel: string;
  question: string;
  answer: string;
  badge?: string;
  keyPoints?: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "g1",
    category: "all",
    categoryLabel: "General",
    question: "Is Dellics Travels a legitimate travel agency?",
    answer: "Dellics Travels is a registered travel agency serving customers with flight bookings, holidays, tours and other travel services. Where applicable, display your GTA licence, IATA accreditation and TOUGHA membership with genuine verification information.",
  },
  {
    id: "g2",
    category: "all",
    categoryLabel: "General",
    question: "Is my payment secure?",
    answer: "Payments are processed through the payment method presented at checkout. Dellics Travels does not recommend sending card details, PINs or passwords through WhatsApp, email or social media.",
  },
  {
    id: "g3",
    category: "all",
    categoryLabel: "General",
    question: "When is my booking actually confirmed?",
    answer: "A flight search or temporary reservation does not necessarily mean a ticket has been issued. Your booking should be considered ticketed only when Dellics Travels provides the applicable confirmed booking/e-ticket information.",
  },
  {
    id: "g4",
    category: "all",
    categoryLabel: "General",
    question: "Why did the flight price change after I selected it?",
    answer: "Airline inventory and fares can change before ticket issuance. The final price is the price confirmed at the time of ticket issuance.",
  },
  {
    id: "g5",
    category: "all",
    categoryLabel: "General",
    question: "Can I contact Dellics Travels before booking?",
    answer: "Yes. Customers can contact Dellics Travels for assistance with flight selection, itinerary questions, baggage, changes, cancellations and other travel services.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    g1: true,
    f1: true,
    v1: true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions & Help Center"
        subtitle="Clear, authoritative answers regarding our IATA flight ticketing, 3.3M+ verified hotel stays, diaspora heritage tours, visa advisory, and secure payments."
        image="/images/services/corporate-travel-management.jpg"
        breadcrumbs={[{ label: "FAQs" }]}
      />

      {/* Main FAQ Content Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Search & Header Bar */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <SectionHeading
            eyebrow="Knowledge Base"
            title="How Can We Help You Today?"
            subtitle="Search our official operational FAQs or select a service category below."
          />

          {/* Search Box */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by topic, e.g. IATA ticketing, visa approval, refunds, Cape Coast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-4 rounded-2xl bg-white border-slate-200 text-sm font-medium shadow-sm focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 rounded-md px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? "bg-brand-orange text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:border-brand-orange/30"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-navy/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                          {faq.categoryLabel}
                        </span>
                        {faq.badge && (
                          <span className="rounded-md bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-orange">
                            {faq.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-navy">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-brand-orange text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <ChevronDown className="size-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 text-slate-700 space-y-4 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-150">
                      <p>{faq.answer}</p>

                      {faq.keyPoints && faq.keyPoints.length > 0 && (
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-navy">
                            Key Verified Highlights:
                          </p>
                          <ul className="space-y-1.5">
                            {faq.keyPoints.map((point) => (
                              <li key={point} className="flex items-start gap-2 text-xs text-slate-600">
                                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
              <HelpCircle className="size-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-slate-800">
                No matching questions found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or speak directly to our team.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full text-xs"
                >
                  Clear Search
                </Button>
                <Button asChild className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white text-xs">
                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I have a question regarding: " + searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ask on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-navy-dark text-white p-8 sm:p-10 relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-orange border border-white/15">
                <Headphones className="size-3.5" />
                <span>Chat with Travel Consultant</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Have a specific question not listed here?
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Our certified travel consultants are available on WhatsApp to assist with instant flight fares, custom itineraries, and consular guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I would like to make an inquiry.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 px-6 text-xs shadow-lg transition-colors"
              >
                <MessageCircle className="size-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/inquire"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 text-xs border border-white/20 transition-colors"
              >
                <span>Submit Inquiry Form</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Plan Your Next Journey?"
        copy="Work with an IATA-certified agency that guarantees transparent pricing, direct airline ticketing, and round-the-clock peace of mind."
        label="Start Your Travel Inquiry"
        href="/inquire"
      />
    </>
  );
}
