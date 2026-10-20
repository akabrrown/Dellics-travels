"use client";

import Link from "next/link";
import { Plane, Home, FileText, CheckCircle, HeadphonesIcon, Globe2, Briefcase, GraduationCap } from "lucide-react";

const services = [
  {
    title: "Visa Assistance",
    description: "Expert guidance for your student visa application, including mock interviews and financial document checks.",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Student Accommodation",
    description: "Find secure, verified, and affordable student housing near your university campus before you arrive.",
    icon: Home,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Discounted Flights",
    description: "Access exclusive student fares and generous baggage allowances through our travel partnerships.",
    icon: Plane,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Pre-departure Briefing",
    description: "Comprehensive sessions covering culture shock, budgeting, part-time work, and essential packing lists.",
    icon: HeadphonesIcon,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "University Placements",
    description: "Direct partnerships with hundreds of top-ranking universities globally to secure your admission.",
    icon: GraduationCap,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Career & Internships",
    description: "Advice on post-study work visas and connecting you with internship opportunities abroad.",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600",
  }
];

export function RecommendedServices() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">Support Services</span>
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
            Explore recommended services for your <span className="text-brand-orange">journey abroad</span>
          </h2>
          <p className="text-slate-600">Beyond admissions, we ensure every aspect of your relocation is handled with professional care.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-brand-blue/20 flex flex-col h-full">
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors mt-auto group/link">
                Learn more
                <span className="transition-transform group-hover/link:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
