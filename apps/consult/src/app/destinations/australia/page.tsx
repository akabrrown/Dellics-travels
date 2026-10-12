import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Calendar, DollarSign, Clock, Briefcase, HeartHandshake } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Study in Australia | Dellics Education Consult',
  description: 'Study at Australia’s leading Group of Eight (Go8) and modern universities: Subclass 500 Student Visa, Genuine Student (GS) criteria, CoE issuance, OSHC health insurance, and Subclass 485 post-study work rights.',
};

export default function StudyInAustraliaPage() {
  const topUniversities = [
    { name: 'University of Melbourne', tag: 'Group of Eight (#14 QS)', focus: 'Biomedical Science, Law, Economics, IT' },
    { name: 'University of Sydney', tag: 'Group of Eight (#18 QS)', focus: 'Engineering, Business Analytics, Medicine' },
    { name: 'UNSW Sydney', tag: 'Group of Eight (#19 QS)', focus: 'Renewable Energy, Artificial Intelligence, Finance' },
    { name: 'Monash University', tag: 'Group of Eight (#37 QS)', focus: 'Pharmacy, Mechanical Engineering, Public Policy' },
    { name: 'Deakin University', tag: 'Top Student Satisfaction', focus: 'Nursing, Cybersecurity, Exercise & Sports Science' },
    { name: 'Western Sydney University', tag: '#1 for Impact & Sustainability', focus: 'Information Systems, Accounting, Health Science' },
  ];

  const keyFacts = [
    { icon: Briefcase, label: 'Post-Study Work Visa', val: '2-4+ Years (Subclass 485)' },
    { icon: Clock, label: 'Fortnight Work Rights', val: '48 hrs / fortnight in session' },
    { icon: DollarSign, label: 'Average Tuition', val: 'AUD $22,000 - $38,000 / yr' },
    { icon: Calendar, label: 'Primary Intakes', val: 'February & July' },
  ];

  const milestones = [
    { phase: 'Course Match', title: 'Course Match & GS Assessment', desc: 'Select your program and perform our pre-screening check under Australia’s Genuine Student (GS) evaluation model.' },
    { phase: 'Offer Letter', title: 'Offer Letter & Initial Deposit', desc: 'Secure your Conditional or Unconditional Offer Letter and pay initial tuition installment to trigger CoE generation.' },
    { phase: 'CoE & OSHC', title: 'CoE & OSHC Health Cover', desc: 'Acquire your official electronic Confirmation of Enrolment (eCoE) and mandatory Overseas Student Health Cover (OSHC).' },
    { phase: 'Visa Lodgement', title: 'Subclass 500 Visa Lodgement', desc: 'Lodge your online visa petition with panel doctor health examination, police character clearances, and biometric capture.' },
  ];

  const ausHighlights = [
    'Subclass 485 Temporary Graduate Visa granting 2 to 4 years post-study employment rights, with additional years for regional areas',
    'Legal workplace protections with Australia’s national minimum wage of AUD $24.10/hr ensuring fair student compensation',
    'Overseas Student Health Cover (OSHC) providing comprehensive medical and hospital access throughout your stay',
    'Vibrant lifestyle, exceptional safety, and top student cities including Melbourne, Sydney, Brisbane, Perth, and Adelaide',
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-brand-orange text-white">AU</span>
              Top Southern Hemisphere Destination
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Study in <span className="text-brand-orange">Australia</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Experience education from world-ranked Group of Eight (Go8) universities, 
              flexible work rights, and high-demand post-study career opportunities across Australia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup?destination=australia"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Apply to Australian Universities
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?destination=australia"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Book Australian Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyFacts.map((fact, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-2xl bg-navy/5 text-navy flex items-center justify-center shrink-0">
                  <fact.icon className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{fact.label}</p>
                  <p className="text-lg font-bold text-navy">{fact.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Australian Institutions</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Leading Australian Partner Universities
            </h2>
            <p className="text-slate-600">
              Representative agreements spanning Go8 research institutions and career-connected tech universities across all states.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUniversities.map((uni, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">{uni.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{uni.name}</h3>
                  <p className="text-slate-600 text-xs mb-4">Program Strengths: {uni.focus}</p>
                </div>
                <Link
                  href={`/contact?destination=australia&university=${encodeURIComponent(uni.name)}`}
                  className="text-xs font-bold text-navy hover:text-brand-orange inline-flex items-center gap-1 transition-colors"
                >
                  Explore Admissions <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy text-white relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Immigration & Policy</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Genuine Student (GS) & Work Rights
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Australia has modernized its student visa framework with the Genuine Student (GS) requirement, replacing the old GTE statement. Our experienced education counsel ensures your submission articulates clear course relevance, realistic career projections, and compliance with Home Affairs guidelines.
              </p>
              <div className="space-y-3">
                {ausHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-sm">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <HeartHandshake className="w-8 h-8 text-brand-orange" />
                <div>
                  <h3 className="font-bold text-white text-lg">Subclass 500 Compliance Protocol</h3>
                  <p className="text-xs text-slate-400">Department of Home Affairs standard checks</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Every visa application is systematically audited for evidence of living costs (12 months AUD $29,710), genuine funding provenance, OSHC insurance coverage, and health clearances with accredited panel doctors in Accra.
              </p>
              <div className="bg-navy-dark p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Department Living Costs:</span>
                  <span className="font-bold text-brand-orange">AUD $29,710 / yr</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Visa Processing Window:</span>
                  <span className="font-bold text-white">4-8 Weeks</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Post-Study Visa (485):</span>
                  <span className="font-bold text-white">Bachelor: 2yr | Master: 3yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Roadmap</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Your Pathway to Australia
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((st, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-orange/30 transition-all">
                <div>
                  <span className="inline-block text-xs font-mono font-bold text-brand-orange uppercase bg-brand-orange/10 px-2.5 py-1 rounded-md mb-3">
                    {st.phase}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{st.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Begin Your Australian Journey?"
        desc="Connect with Dellics Travels education consultants for course matching, CoE processing, and Subclass 500 visa filing."
      />
    </main>
  );
}
