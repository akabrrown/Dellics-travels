import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Calendar, DollarSign, Clock, Briefcase, Award, ShieldCheck } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Study in the United States | Dellics Education Consult',
  description: 'Study at accredited US universities and colleges: Form I-20 issuance, 3-year STEM OPT work authorization, F-1 visa interview preparation, and merit scholarship guidance.',
};

export default function StudyInUSAPage() {
  const topUniversities = [
    { name: 'Northeastern University', tag: 'Top Global Co-op', focus: 'Computer Science, Data Science, International Business' },
    { name: 'Arizona State University', tag: '#1 in US for Innovation', focus: 'Software Engineering, Sustainability, Supply Chain' },
    { name: 'University of South Florida', tag: 'Tier 1 Public Research', focus: 'Public Health, Cybersecurity, Biomedical Engineering' },
    { name: 'Illinois Institute of Technology', tag: 'Chicago Tech Leader', focus: 'Architecture, Artificial Intelligence, Financial Math' },
    { name: 'Georgia State University', tag: 'Atlanta Business Hub', focus: 'Fintech, Health Informatics, Accountancy' },
    { name: 'University of North Texas', tag: 'High Value & Scholarships', focus: 'Logistics, Data Analytics, Music & Media' },
  ];

  const keyFacts = [
    { icon: Briefcase, label: 'STEM OPT Extension', val: 'Up to 36 Months' },
    { icon: Clock, label: 'Campus Employment', val: '20 hrs / wk on-campus' },
    { icon: DollarSign, label: 'Average Tuition', val: '$18,000 - $38,000 / yr' },
    { icon: Calendar, label: 'Primary Intakes', val: 'Fall (Aug) & Spring (Jan)' },
  ];

  const milestones = [
    { phase: 'Profile Review', title: 'Transcript & Profile Review', desc: 'Assess undergraduate transcripts or WASSCE results, waive standardized tests where eligible, and select target programs.' },
    { phase: 'Form I-20', title: 'Application & I-20 Processing', desc: 'Secure direct admission and your university Form I-20 (Certificate of Eligibility for Nonimmigrant Student Status).' },
    { phase: 'SEVIS Filing', title: 'SEVIS Fee & DS-160 Filing', desc: 'Pay the mandatory SEVIS I-901 fee and submit your accurate DS-160 consular application without discrepancies.' },
    { phase: 'Consular Prep', title: 'F-1 Consular Interview Prep', desc: 'Engage in rigorous 1-on-1 mock interviews to master non-immigrant intent, academic justification, and sponsor funding.' },
  ];

  const optHighlights = [
    '36 months total post-graduation work authorization for STEM degree programs (12-month standard OPT + 24-month STEM extension)',
    'Curricular Practical Training (CPT) enabling paid internships during your degree program',
    'Thousands of merit-based institutional scholarships and Graduate Teaching/Research Assistantships (TA/RA)',
    'Direct exposure to Fortune 500 employers, tech ecosystems, and high-impact research facilities',
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-brand-orange text-white">US</span>
              Global Leader in Innovation
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Study in the <span className="text-brand-orange">United States</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Access world-renowned academic prestige, state-of-the-art research laboratories, and up to 3 years 
              of STEM OPT career experience across premier American universities and colleges.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup?destination=usa"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Apply to US Universities
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?destination=usa"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Book US Admissions Advisory
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
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Featured US Institutions</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Top US Partner Universities
            </h2>
            <p className="text-slate-600">
              Direct institutional relationships ensuring prompt I-20 turnaround, English proficiency waivers, and high scholarship rates.
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
                  <p className="text-slate-600 text-xs mb-4">Academic Focus: {uni.focus}</p>
                </div>
                <Link
                  href={`/contact?destination=usa&university=${encodeURIComponent(uni.name)}`}
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
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Post-Study Work</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                STEM OPT Work Authorization in America
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Graduates of qualifying Science, Technology, Engineering, and Math programs can work in the United States for up to 3 years without requiring an immediate H-1B visa lottery petition. This provides unmatched global experience and financial returns.
              </p>
              <div className="space-y-3">
                {optHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-sm">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-8 h-8 text-brand-orange" />
                <div>
                  <h3 className="font-bold text-white text-lg">F-1 Visa Interview Masterclass</h3>
                  <p className="text-xs text-slate-400">Embassy prep for Accra and consular posts</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                The F-1 consular interview lasts just 2 to 3 minutes. Our certified interview coaches conduct intensive mock sessions simulating consular officer questions regarding home ties (Section 214b), funding veracity, and career plans.
              </p>
              <div className="bg-navy-dark p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">SEVIS I-901 Fee:</span>
                  <span className="font-bold text-brand-orange">$350 USD</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">MRV Visa Fee:</span>
                  <span className="font-bold text-white">$185 USD</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Dellics Visa Success Rate:</span>
                  <span className="font-bold text-brand-orange">94.8%</span>
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
              Your Pathway to the USA
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
        title="Ready to Pursue Your Studies in the US?"
        desc="Book a personalized consultation today to evaluate scholarship eligibility, I-20 options, and F-1 visa preparation."
      />
    </main>
  );
}
