import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck2, ShieldCheck, ArrowRight, CheckCircle2, UserCheck, Search, Scale } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Visa Assistance & Compliance | Dellics Education Consult',
  description: 'Certified student visa guidance for UK Student Route, Canada Study Permit, US F-1 Visa, and Australia Subclass 500. Comprehensive financial audit and mock embassy interview prep.',
};

export default function VisaAssistancePage() {
  const visaCategories = [
    {
      country: 'United Kingdom',
      badge: 'Student Route (Tier 4)',
      overview: 'Requires a valid Confirmation of Acceptance for Studies (CAS), 28-day financial evidence rule, and TB screening.',
      deliverables: ['CAS verification', '28-Day Bank Statement Audit', 'Immigration Health Surcharge (IHS) calculation', 'VFS Global biometrics prep'],
    },
    {
      country: 'Canada',
      badge: 'Study Permit & PAL',
      overview: 'Requires Provincial Attestation Letter (PAL), letter of acceptance (LOA), proof of funds (GIC or verified sponsorship), and upfront medicals.',
      deliverables: ['Provincial Attestation Letter guidance', 'Study Plan & Letter of Explanation (LOE)', 'Guaranteed Investment Certificate (GIC) advisory', 'Sponsorship and proof of funds audit'],
    },
    {
      country: 'United States',
      badge: 'F-1 Academic Visa',
      overview: 'Requires Form I-20, SEVIS I-901 fee payment, DS-160 completion, and rigorous in-person embassy interview preparation.',
      deliverables: ['SEVIS Fee & DS-160 completion', 'Form I-20 financial reconciliation', 'Rigorous 1-on-1 mock embassy interview sessions', 'Ties to home country articulation'],
    },
    {
      country: 'Australia',
      badge: 'Subclass 500 & GS',
      overview: 'Requires Confirmation of Enrolment (CoE), Genuine Student (GS) criteria compliance, OSHC health cover, and verified financial capacity.',
      deliverables: ['Genuine Student (GS) statement drafting', 'Overseas Student Health Cover (OSHC) arrangement', 'Financial capacity documentation audit', 'Biometrics & health examination guidance'],
    },
  ];

  const assurancePoints = [
    {
      icon: Search,
      title: 'Forensic Financial Statement Audit',
      desc: 'Most visa refusals stem from incorrectly held bank statements or unexplained lump sums. We verify the 28-day holding period and source of funds prior to submission.',
    },
    {
      icon: UserCheck,
      title: 'Embassies Mock Interview Drill',
      desc: 'Simulated 1-on-1 interview practice tailored to your course, career trajectory, post-graduation plans, and home-country economic ties.',
    },
    {
      icon: Scale,
      title: 'Refusal Review & Appeal Filing',
      desc: 'Have you experienced a previous visa refusal? Our senior specialists conduct an in-depth refusal analysis and restructure your re-application dossier.',
    },
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Immigration & Compliance Guidance
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Student Visa Assistance & <span className="text-brand-orange">Compliance</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Navigate stringent immigration regulations with confidence. Our visa compliance team conducts thorough document audits, financial verification, and comprehensive embassy interview training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?service=visa"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Schedule Visa Advisory
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Start Student Portal Case
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">97.4%</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Visa Success Rate</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">1,200+</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Passports Stamped</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">Zero</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Compliance Compromise</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">4 Major</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Destinations Handled</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Country Specific Regulations</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Country-by-Country Visa Protocols
            </h2>
            <p className="text-slate-600">
              Every embassy maintains distinct verification standards. We ensure your application meets and exceeds each consular checklist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {visaCategories.map((cat, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-navy transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-navy">{cat.country}</h3>
                  <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{cat.badge}</span>
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{cat.overview}</p>
                
                <div className="space-y-2.5 mb-8">
                  {cat.deliverables.map((deliv, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/contact?service=visa&country=${encodeURIComponent(cat.country)}`}
                  className="inline-flex items-center gap-2 font-bold text-sm text-navy hover:text-brand-orange transition-colors"
                >
                  Request {cat.country} Visa Checklist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Application Safeguards</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Core Visa Protection Pillars
            </h2>
            <p className="text-slate-600">
              We catch clerical and structural errors before your application ever reaches the embassy portal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {assurancePoints.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-navy text-brand-orange flex items-center justify-center font-bold mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{pt.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Don’t Risk Your Tuition on a Visa Mistake"
        desc="Book an appointment with our visa advisory desk for a comprehensive document audit before you submit."
      />
    </main>
  );
}
