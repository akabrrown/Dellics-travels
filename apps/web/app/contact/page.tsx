import type { Metadata } from "next/types";
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Dellics Travels — Office, Phone & 24/7 WhatsApp",
  description:
    "Contact Dellics Travels in Tema Community 25 Devtraco Estate, Ghana. Reach us via 24/7 WhatsApp concierge, phone, email, or schedule an office consultation.",
};

const CONTACT_CHANNELS = [
  {
    icon: MessageSquare,
    title: "24/7 WhatsApp Concierge",
    value: SITE.phoneDisplay,
    href: `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I would like to make an inquiry.")}`,
    action: "Chat with an Expert Now",
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
    title: "Physical Agency Office",
    value: SITE.address,
    href: "#",
    action: "P.O. Box CO 2686, Tema, Ghana",
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch with Our Travel Team"
        subtitle="Have a question about flights, tour packages, or visa consultation? Reach out via WhatsApp, phone, or visit our Tema office."
        badge="Live Support Available"
        image="/images/africa/accra-city-experience.jpg"
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      {/* Direct Channel Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    ? "bg-navy-dark text-white border border-brand-orange/40 shadow-lg"
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
                  {ch.action} →
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Form & Operating Hours Container */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
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
                    <span className="text-brand-orange font-bold">24/7 WhatsApp Emergency Desk</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-white/70">
                  <p className="flex items-center gap-2">
                    <Building2 className="size-4 text-brand-orange shrink-0" />
                    <span>Devtraco Estate, Community 25, Tema</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    <span>IATA Certified Agency</span>
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
                    Fast WhatsApp Response
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Need instant flight quote? Message our ticketing desk directly for live pricing.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
