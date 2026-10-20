import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, ArrowRight, Compass, FileText, UserCheck } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Scholarship Guidance & Funding Advisory | Dellics Education Consult',
  description: 'Win global undergraduate and postgraduate scholarships. Expert coaching on Chevening, Commonwealth, Mastercard Foundation, Erasmus+, and university tuition discounts.',
};

export default function ScholarshipGuidancePage() {
  const fundingTypes = [
    {
      type: 'Fully-Funded Government Grants',
      range: '100% Tuition + Living Stipend + Flights',
      programs: 'Chevening (UK), Commonwealth Scholarships, DAAD (Germany), Australia Awards, Fulbright (USA)',
      desc: 'Prestigious national awards open to African graduates demonstrating proven leadership potential and strong academic performance.',
    },
    {
      type: 'Institutional Tuition Discounts',
      range: '£2,000 - £10,000 / $5,000 - $20,000 Off Tuition',
      programs: 'Vice-Chancellor Merit Scholarships, Dean’s Excellence Awards, Early-Bird Bursaries',
      desc: 'Direct fee reductions offered by our partner universities to qualified Ghanaian and international applicants based on academic GPA.',
    },
    {
      type: 'Development & NGO Fellowships',
      range: 'Full Ride / Need & Merit Hybrid',
      programs: 'Mastercard Foundation Scholars Program, Erasmus Mundus Joint Masters, Aga Khan Foundation',
      desc: 'Dedicated funding programs specifically created for transformative young leaders across Sub-Saharan Africa.',
    },
  ];

  const guidanceServices = [
    {
      icon: Compass,
      title: 'Profile & Eligibility Mapping',
      desc: 'We match your academic GPA, community impact, and career trajectory against global scholarship criteria to target realistic, high-yield opportunities.',
    },
    {
      icon: FileText,
      title: 'Motivation Letter & Essay Polishing',
      desc: 'Winning essays articulate why you deserve funding without sounding cliché. We guide you through structuring compelling personal statements and leadership narratives.',
    },
    {
      icon: UserCheck,
      title: 'Interview & Defense Preparation',
      desc: 'Mock panel interviews for Chevening and Commonwealth finalists to refine your communication, poise, and developmental impact answers.',
    },
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <Award className="w-4 h-4" />
              Financial Aid & Grants
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              International Scholarship <span className="text-brand-orange">Guidance</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Tuition costs should never limit your global potential. Our scholarship strategists help Ghanaian and African students uncover, apply for, and win competitive scholarships and university fee discounts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?service=scholarship"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Assess Scholarship Eligibility
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Create Student Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">$2.4M+</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Secured for Students</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">350+</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Partial Discounts Awarded</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">120+</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Partner University Schemes</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">45+</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Prestige Fellowships Won</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Funding Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Types of Scholarships Available
            </h2>
            <p className="text-slate-600">
              From global government initiatives to institutional tuition fee remissions, we position your profile where it earns highest recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {fundingTypes.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full inline-block mb-4">
                    {item.range}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{item.type}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notable Examples:</p>
                  <p className="text-xs text-slate-700 leading-normal">{item.programs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Application Strategy</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              How We Help You Win
            </h2>
            <p className="text-slate-600">
              Scholarship committees evaluate thousands of submissions. Our editorial guidance ensures yours commands serious attention.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {guidanceServices.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{svc.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Find Out Which Scholarships You Qualify For"
        desc="Book a profile audit with our funding desk. We will evaluate your GPA and draft a tailored scholarship schedule."
      />
    </main>
  );
}
