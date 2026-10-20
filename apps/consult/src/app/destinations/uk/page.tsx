import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, DollarSign, Clock, Briefcase, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Study in the United Kingdom | Dellics Education Consult',
  description: 'Explore studying in the UK: 1-year Master’s programs, Russell Group universities, 2-year Graduate Route post-study work visa, tuition costs, and CAS application support.',
};

export default function StudyInUKPage() {
  const topUniversities = [
    { name: 'University of Manchester', ranking: '#32 Global QS', focus: 'Engineering, Business, Medicine' },
    { name: 'University of Birmingham', ranking: 'Russell Group', focus: 'Computer Science, Law, Biosciences' },
    { name: 'University of Leeds', ranking: 'Russell Group', focus: 'Business, Communication, Data Science' },
    { name: 'Coventry University', ranking: 'Top Modern University', focus: 'Automotive, Nursing, Management' },
    { name: 'University of Hertfordshire', ranking: 'Employment Focused', focus: 'Aerospace, Pharmacy, Creative Arts' },
    { name: 'University of Salford', ranking: 'MediaCityUK Partner', focus: 'Media, Robotics, Public Health' },
  ];

  const keyFacts = [
    { icon: Clock, label: 'Masters Duration', val: '1 Year Taught' },
    { icon: Briefcase, label: 'Graduate Work Visa', val: '2 Years (3 for PhD)' },
    { icon: DollarSign, label: 'Average Tuition', val: '£12,500 - £22,000 / yr' },
    { icon: Calendar, label: 'Key Intakes', val: 'September & January' },
  ];

  const milestones = [
    { phase: 'Selection', title: 'Consultation & Course Selection', desc: 'Select from over 50,000 degree courses aligned with your academic background and career goals.' },
    { phase: 'Offer Letter', title: 'Application & Offer Letter', desc: 'Receive conditional or unconditional offers within 2-4 weeks via our direct university partner channels.' },
    { phase: 'CAS Compliance', title: 'CAS Issuance & Financial Audit', desc: 'Fulfill academic conditions, pay the university tuition deposit, and obtain your Confirmation of Acceptance for Studies (CAS).' },
    { phase: 'Visa Lodgement', title: 'Student Route Visa Application', desc: 'Submit your UK Student Route visa dossier with verified 28-day funds, TB screening, and VFS biometrics.' },
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-brand-orange text-white">UK</span>
              Premier Destination
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Study in the <span className="text-brand-orange">United Kingdom</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Fast-track your career with globally renowned 1-year Master’s and 3-year Bachelor’s degrees. 
              Work 20 hours per week during term-time and stay up to 2 years post-graduation under the UK Graduate Route.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup?destination=uk"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Apply to UK Universities
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?destination=uk"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Book UK Study Advisory
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
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Partner Institutions</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Top UK Partner Universities
            </h2>
            <p className="text-slate-600">
              We represent top Russell Group and modern career-focused institutions across England, Scotland, and Wales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUniversities.map((uni, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">{uni.ranking}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{uni.name}</h3>
                  <p className="text-slate-600 text-xs mb-4">Notable Programs: {uni.focus}</p>
                </div>
                <Link
                  href={`/contact?destination=uk&university=${encodeURIComponent(uni.name)}`}
                  className="text-xs font-bold text-navy hover:text-brand-orange inline-flex items-center gap-1 transition-colors"
                >
                  Explore Admissions <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Application Pipeline</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Your Journey to the UK
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
        title="Ready to Study in the United Kingdom?"
        desc="Applications are actively open for the upcoming UK academic intakes. Contact our UK advisory desk now."
      />
    </main>
  );
}
