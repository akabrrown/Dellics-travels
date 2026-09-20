import type { Metadata } from "next/types";
import Link from "next/link";
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Navigation,
  ExternalLink,
  Compass,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Dellics Travels - US & Ghana Offices, Phone & Inquiries",
  description:
    "Contact Dellics Travels in Sheridan, Wyoming, USA and Community 25 Devtraco Estate, Tema, Ghana. Reach us via online inquiry, phone, email, or schedule an office consultation.",
};

const LAT = "5.734937466165215";
const LNG = "0.036954806207670395";
const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${LAT},${LNG}&hl=en&z=16&output=embed`;
const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
const APPLE_MAPS_URL = `https://maps.apple.com/?ll=${LAT},${LNG}&q=Dellics+Travels+Ghana+HQ`;

const CONTACT_CHANNELS = [
  {
    icon: MessageSquare,
    title: "Online Inquiry Desk",
    value: "Bespoke Bookings & Trips",
    href: "/inquire",
    action: "Submit Booking Inquiry",
    primary: true,
  },
  {
    icon: PhoneCall,
    title: "Direct Telephone Line",
    value: SITE.phoneDisplay,
    href: `tel:${SITE.phone}`,
    action: "Call Our Ticketing Desk",
    primary: false,
  },
  {
    icon: Mail,
    title: "Official Email Address",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    action: "Send an Email",
    primary: false,
  },
  {
    icon: MapPin,
    title: "Ghana Office (HQ)",
    value: "Community 25, Devtraco Estate Tema",
    href: "#live-map",
    action: "View On Live Map",
    primary: false,
  },
  {
    icon: Building2,
    title: "United States Office",
    value: "30 N Gould ST, STER, SHERIDAN, WY 82801",
    href: "#us-office",
    action: "Dellics Travels, USA",
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch with Our Global Travel Team"
        subtitle="Have a question about flights, luxury stays, tour packages, or visa consultation? Reach out via WhatsApp, phone, or connect with our USA and Ghana offices."
        image="/images/africa/accra-city-experience.jpg"
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      {/* Direct Channel Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CONTACT_CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.title}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`group flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  ch.primary
                    ? "bg-navy-dark text-white border border-brand-orange/40 shadow-lg sm:col-span-2 lg:col-span-1"
                    : "bg-white text-navy border border-slate-200/80 shadow-sm"
                }`}
              >
                <div>
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl mb-4 ${
                      ch.primary
                        ? "bg-brand-orange text-white"
                        : "bg-brand-orange/10 text-brand-orange"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-display text-sm font-bold">
                    {ch.title}
                  </h3>
                  <p className={`mt-1 text-xs font-semibold ${ch.primary ? "text-brand-orange" : "text-slate-700"}`}>
                    {ch.value}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100/20 text-xs font-bold text-brand-orange">
                  {ch.action} â†’
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Form & Operating Hours Container */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Form Container */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-sm">
            <SectionHeading
              align="left"
              eyebrow="Send A Message"
              title="Leave Us a Message"
              subtitle="Fill out the secure form below and our certified ticketing officer will review your request and get back to you shortly."
            />

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* Office Details & Hours Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-navy-dark p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Agency Operating Hours
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold">
                    Office & Support Schedule
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-white/80">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Monday – Friday</span>
                    <span>8:00 AM – 6:00 PM GMT</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Saturday</span>
                    <span>9:00 AM – 4:00 PM GMT</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Sunday & Holidays</span>
                    <span className="text-brand-orange font-bold">Chat with Travel Consultant</span>
                  </div>
                </div>

                {/* Dual Office Locations */}
                <div className="border-t border-white/10 pt-5 space-y-4 text-xs text-white/90">
                  <div id="ghana-office" className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-brand-orange">
                      <Building2 className="size-4 shrink-0" />
                      <span>Dellics Travels (Ghana HQ)</span>
                    </div>
                    <p className="text-white/80">Community 25, Devtraco Estate Tema</p>
                    <p className="text-white/60">Greater Accra, Ghana</p>
                    <p className="text-white/80 pt-1">Tel: +233 55 205 4174</p>
                    <p className="text-white/60">Email: help@dellicstravels.com</p>
                  </div>

                  <div id="us-office" className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-brand-orange">
                      <Building2 className="size-4 shrink-0" />
                      <span>Dellics Travels (USA)</span>
                    </div>
                    <p className="text-white/80">30 N Gould ST, STER, SHERIDAN</p>
                    <p className="text-white/60">WYOMING, 82801, United States</p>
                    <p className="text-white/60 pt-1">Email: help@dellicstravels.com</p>
                  </div>

                  <p className="flex items-center gap-2 pt-2">
                    <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    <span className="text-white/80">IATA Accredited Global Travel Agency</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-emerald-50/80 border border-emerald-200/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-emerald-950">
                    Prompt Response Guarantee
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Our certified travel desk reviews and confirms your flight and vacation inquiries within hours.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Live Interactive Location Map Section */}
      <section id="live-map" className="bg-slate-50 border-t border-slate-200/80 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <SectionHeading
              align="left"
              eyebrow="Interactive Location Map"
              title="Visit Our Ghana Corporate Headquarters"
              subtitle="Located at Devtraco Estate, Community 25, Tema, Greater Accra. Drop in for in-person consultations, corporate ticketing, and bespoke tour planning."
            />

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-md">
                <a
                  href={GOOGLE_MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Navigation className="size-3.5" />
                  <span>Get Driving Directions</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-slate-300 text-xs font-semibold">
                <a
                  href={APPLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <Compass className="size-3.5 text-navy" />
                  <span>Apple Maps</span>
                  <ExternalLink className="size-3 text-slate-400" />
                </a>
              </Button>
            </div>
          </div>

          {/* Interactive Map Frame Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl">
            {/* Top Info Floating Strip */}
            <div className="bg-navy-dark text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Dellics Travels Corporate HQ</p>
                  <p className="text-white/70">Community 25, Devtraco Estate, Tema, Greater Accra, Ghana</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/60 font-mono text-[11px]">
                <span>Coordinates: {LAT}, {LNG}</span>
                <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" title="Live Office Status" />
              </div>
            </div>

            {/* Embedded Live Map IFrame */}
            <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full bg-slate-100">
              <iframe
                title="Dellics Travels Ghana HQ Live Map"
                src={GOOGLE_MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
