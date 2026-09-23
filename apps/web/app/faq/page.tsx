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
  // 1. General & Licensing
  {
    id: "g1",
    category: "all",
    categoryLabel: "General & Licensing",
    question: "Is Dellics Travels an officially certified and licensed travel agency?",
    answer: "Yes. Dellics Travels is fully licensed and regulated by the Ghana Tourism Authority (GTA) and holds active international certification with the International Air Transport Association (IATA). We are also active members of the Tour Operators Union of Ghana (TOUGHA) and operate with enterprise direct connections to global distribution systems (Amadeus, RateHawk, Travelport).",
    badge: "GTA & IATA Accredited",
    keyPoints: [
      "Ghana Tourism Authority (GTA) Statutory License",
      "IATA Accredited Travel Management Partner",
      "Tour Operators Union of Ghana (TOUGHA) Member",
      "Physical offices in Tema, Greater Accra (Ghana) and Sheridan, WY (USA)",
    ],
  },
  {
    id: "g2",
    category: "all",
    categoryLabel: "General & Licensing",
    question: "Where are Dellics Travels physical offices located?",
    answer: "Our Ghana corporate headquarters is located at GN-0490-2450, Community 25 Tema, Greater Accra . Our North American office is located at 30 N Gould ST, STER, Sheridan, WY 82801, USA. Clients can visit us in person or reach our dedicated travel consultant on WhatsApp.",
    badge: "Global Headquarters",
    keyPoints: [
      "Ghana HQ: GN-0490-2450, Community 25 Tema, Greater Accra",
      "USA Office: 30 N Gould ST, Sheridan, WY 82801",
      "Chat with Travel Consultant on WhatsApp",
    ],
  },

  // 2. Flights & Ticketing
  {
    id: "f1",
    category: "flights",
    categoryLabel: "Flights & Ticketing",
    question: "How are flight tickets issued and how do I receive my booking reference (PNR)?",
    answer: "Because Dellics Travels is IATA accredited and integrated directly with Amadeus and Travelport GDS, electronic tickets (e-tickets) and official airline 6-character PNR codes are generated instantly on genuine airline inventories with zero middleman markup. You receive your ticket and receipt via email and WhatsApp within minutes of payment.",
    badge: "Direct GDS Issuance",
    keyPoints: [
      "Instant airline PNR and official electronic ticket (e-ticket)",
      "Tickets verified on airline websites (Emirates, Delta, Qatar, etc.)",
      "Automated WhatsApp e-ticket dispatch",
    ],
  },
  {
    id: "f2",
    category: "flights",
    categoryLabel: "Flights & Ticketing",
    question: "Which global airlines can I book through Dellics Travels?",
    answer: "We issue tickets for over 500 scheduled global airlines across Africa, Europe, the Americas, the Middle East, and Asia. Major partner airlines include Emirates, Qatar Airways, Delta Air Lines, British Airways, KLM Royal Dutch Airlines, Ethiopian Airlines, RwandAir, Turkish Airlines, Virgin Atlantic, and Air France.",
    badge: "500+ Global Carriers",
  },
  {
    id: "f3",
    category: "flights",
    categoryLabel: "Flights & Ticketing",
    question: "Can Dellics Travels handle seat selection, extra baggage, and schedule rebooking?",
    answer: "Yes. Our travel consultant assists with advance preferred seat selection (extra legroom, window, aisle), purchasing discounted prepaid excess baggage allowances, special in-flight meal requests (Halal, Kosher, Vegetarian, Gluten-Free), and managing urgent airline schedule changes or voluntary date modifications.",
    badge: "24/7 Flight Support",
  },

  // 3. Hotels & Global Stays
  {
    id: "h1",
    category: "hotels",
    categoryLabel: "Hotels & Stays",
    question: "How many hotel properties are available and what is your RateHawk B2B partnership?",
    answer: "Through our enterprise partnership with RateHawk, Dellics Travels provides direct booking access to a global network of verified hotels, boutique apartments, and luxury villas across 190+ countries. This B2B integration delivers wholesale contracted room rates with instant server-side confirmation and zero surprise resort fees.",
    badge: "3.3M+ Verified Stays",
    keyPoints: [
      "Wholesale contracted rates below standard public OTAs",
      "Instant electronic stay voucher issued upon checkout",
      "Guaranteed room reservations confirmed directly with hotels",
    ],
  },
  {
    id: "h2",
    category: "hotels",
    categoryLabel: "Hotels & Stays",
    question: "What is your hotel cancellation and modification policy?",
    answer: "Each hotel listing clearly displays its specific cancellation policy (Free Cancellation until a set date vs. Non-Refundable Promotional Rate). If you book a flexible rate, you can cancel or amend your travel dates directly through your traveler profile or by contacting your assigned concierge.",
    badge: "Flexible Options",
  },

  // 4. Visa Advisory & Document Support
  {
    id: "v1",
    category: "visa",
    categoryLabel: "Visa Advisory",
    question: "How does the Dellics Travels Visa Advisory process work?",
    answer: "Our visa specialists conduct a rigorous 4-step consular preparation: 1) Initial profile and financial capability audit, 2) Comprehensive checklist curation tailored to your destination, 3) Verified document review and appointment scheduling, and 4) Mock consular interview coaching to prepare you for common questions with confidence.",
    badge: "99.4% Approval Record",
    keyPoints: [
      "Pre-assessment of financial profiles & employment ties",
      "Consular interview coaching & mock Q&A sessions",
      "Assistance for UK, USA (B1/B2), Canada TRV, Schengen, Dubai & South Africa",
    ],
  },
  {
    id: "v2",
    category: "visa",
    categoryLabel: "Visa Advisory",
    question: "Does Dellics Travels guarantee visa approval?",
    answer: "By international law, all visa issuance decisions rest solely with the consular officers of the respective embassy or high commission. However, our high approval success rate is achieved because we rigorously audit every document, detect discrepancies beforehand, and ensure 100% compliance with statutory immigration regulations before submission.",
    badge: "Strict Ethical Standards",
  },

  // 5. Diaspora Homecoming & Heritage Tours
  {
    id: "d1",
    category: "diaspora",
    categoryLabel: "Diaspora & Heritage Tours",
    question: "What makes Dellics Travels Ghana Heritage & Diaspora tours unique?",
    answer: "As an official partner of Ghana's 'Beyond The Return' initiative, our diaspora itineraries are curated with deep historical reverence and cultural sensitivity. We guide pilgrimages to Cape Coast Castle and Elmina Castle (including the Door of Return ceremony), the sacred Assin Manso Slave River, traditional village chieftaincy naming ceremonies, and the Ashanti Kingdom.",
    badge: "Beyond The Return Partner",
    keyPoints: [
      "Historically honest, trauma-informed local Ghanaian guides",
      "Door of Return ancestral prayer and libation ceremonies",
      "Traditional Akan naming ceremonies with chiefs & elders",
      "Vetted luxury air-conditioned transport & boutique stays",
    ],
  },
  {
    id: "d2",
    category: "diaspora",
    categoryLabel: "Diaspora & Heritage Tours",
    question: "Can diaspora tour packages be customized for private families, alumni, or church groups?",
    answer: "Yes. In addition to our scheduled group departures, our tour managers design bespoke private group itineraries for families, universities, organizations, and corporate retreats, complete with private executive transit, VIP Kotoka airport protocol, and flexible split-payment options through WeTravel.",
    badge: "Custom Group Itineraries",
  },

  // 6. Airport Transfers, Cars & eSIM
  {
    id: "e1",
    category: "esim_transfers",
    categoryLabel: "Transfers, Cars & eSIM",
    question: "How do Kotoka International Airport (ACC) transfers work and what if my flight is delayed?",
    answer: "When you book an airport pickup with Dellics, our operations team tracks your inbound flight in real time. If your flight arrives early or is delayed, your dedicated driver automatically adjusts arrival timing at no extra charge. Our executive drivers hold a personalized name placard at the arrivals hall and assist with luggage.",
    badge: "Live Flight Delay Tracking",
    keyPoints: [
      "Executive sedans, luxury 4x4 SUVs (Prado/Land Cruiser), and group coasters",
      "Real-time flight radar tracking with zero delay penalties",
      "Sanitized, air-conditioned executive fleet",
    ],
  },
  {
    id: "e2",
    category: "esim_transfers",
    categoryLabel: "Transfers, Cars & eSIM",
    question: "How does the Airalo eSIM digital mobile connectivity work?",
    answer: "Through our integration with Airalo, travelers can purchase affordable international high-speed mobile data for over 200+ countries. You receive an instant digital QR code via email-simply scan it in your smartphone settings before departure to enjoy high-speed 4G/5G data immediately upon landing without paying exorbitant roaming fees.",
    badge: "200+ Countries Coverage",
  },

  // 7. Payments, Currencies & Security
  {
    id: "p1",
    category: "payments",
    categoryLabel: "Payments & Security",
    question: "What payment methods does Dellics Travels accept?",
    answer: "We support seamless local and international payment methods secured by Paystack PCI-DSS Level 1 encryption: Ghana Mobile Money (MTN MoMo, Telecel Cash), Visa, Mastercard, American Express, and direct wire transfers for corporate accounts.",
    badge: "PCI-DSS Level 1 Secured",
    keyPoints: [
      "Ghana Mobile Money: MTN MoMo & Telecel Cash",
      "International Credit/Debit Cards: Visa & Mastercard",
      "256-bit bank-grade SSL encrypted checkout",
      "Instant electronic tax invoices & automated receipts",
    ],
  },
  {
    id: "p2",
    category: "payments",
    categoryLabel: "Payments & Security",
    question: "Which currencies can I pay in?",
    answer: "Our booking engine dynamically supports multi-currency settlement. You can view prices and complete checkout in Ghanaian Cedi (GHS), US Dollars (USD), British Pounds (GBP), or Euros (EUR) with live mid-market exchange rates and transparent pricing.",
    badge: "Multi-Currency Settlement",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "flights", label: "Flights & Ticketing", icon: Plane },
  { id: "hotels", label: "Hotels & Stays", icon: Building2 },
  { id: "visa", label: "Visa Advisory", icon: FileCheck2 },
  { id: "diaspora", label: "Diaspora Tours", icon: Heart },
  { id: "esim_transfers", label: "Transfers & eSIM", icon: Smartphone },
  { id: "payments", label: "Payments & Safety", icon: CreditCard },
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
