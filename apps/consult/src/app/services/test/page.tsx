import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowRight, BookOpen, Target, ShieldCheck } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Test Preparation & Exam Coordination | Dellics Education Consult',
  description: 'Official test registration and preparation coordination for IELTS Academic/UKVI, TOEFL iBT, PTE Academic, SAT, and GRE. Maximize your test band scores for international admissions.',
};

export default function TestPreparationPage() {
  const exams = [
    {
      name: 'IELTS Academic & UKVI',
      badge: 'Most Popular',
      scoreTarget: 'Band 6.5 - 7.5',
      acceptedIn: 'UK, Canada, Australia, Europe, USA',
      desc: 'The global standard for English language testing. We provide official British Council and IDP test registration, practice materials, and mock evaluations for Listening, Reading, Writing, and Speaking.',
    },
    {
      name: 'TOEFL iBT',
      badge: 'ETS Partner',
      scoreTarget: '85 - 105+ / 120',
      acceptedIn: 'USA, Canada, Europe, Global',
      desc: 'Preferred by over 11,500 universities worldwide, particularly in the United States and Canada. Covers academic vocabulary, integrated speaking, and structured essays.',
    },
    {
      name: 'PTE Academic',
      badge: 'Fast Results (48 hrs)',
      scoreTarget: '58 - 68+ / 90',
      acceptedIn: 'Australia, UK, New Zealand, Canada',
      desc: 'Computer-based AI-scored English test with rapid turnaround. Accepted by Australian and New Zealand immigration authorities and major UK universities.',
    },
    {
      name: 'SAT (Digital SAT)',
      badge: 'Undergraduate USA',
      scoreTarget: '1250 - 1450+ / 1600',
      acceptedIn: 'United States, Canada',
      desc: 'Standardized examination measuring Reading & Writing and Math skills. High SAT scores significantly boost scholarship funding and entry into competitive US colleges.',
    },
    {
      name: 'GRE & GMAT',
      badge: 'Graduate / MBA',
      scoreTarget: 'GRE: 310+ / GMAT: 650+',
      acceptedIn: 'USA, UK, Europe, Canada',
      desc: 'Required for selective master’s, PhD, and MBA programs. Covers Verbal Reasoning, Quantitative Reasoning, and Analytical Writing.',
    },
    {
      name: 'Duolingo English Test (DET)',
      badge: 'Convenient Home Test',
      scoreTarget: '115 - 135+ / 160',
      acceptedIn: 'USA, Select UK/Canadian Universities',
      desc: 'Affordable, online on-demand test taken in 1 hour from your computer. Rapid results within 48 hours for qualifying partner institutions.',
    },
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: 'Official Test Registration Assistance',
      desc: 'We assist with test center booking at authorized venues in Accra, Kumasi, and regional testing centers, ensuring verified payment and valid test dates.',
    },
    {
      icon: Target,
      title: 'Diagnostic Benchmark Assessment',
      desc: 'Take an initial assessment test to identify your baseline score, weak question categories, and target band scores required for your shortlisted degree programs.',
    },
    {
      icon: ShieldCheck,
      title: 'Waiving English Tests (MOI Guidance)',
      desc: 'Graduated from a Ghanaian university where English was the primary language of instruction? We help obtain Medium of Instruction (MOI) waivers for universities that accept them, saving you test fees.',
    },
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <FileText className="w-4 h-4" />
              Standardized Testing Services
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Test Preparation & <span className="text-brand-orange">Exam Coordination</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Hit the required score bands for admission and visa approval. 
              We coordinate registration, diagnostic testing, and comprehensive preparation for IELTS, TOEFL, SAT, GRE, and PTE.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?service=test"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Inquire on Test Dates & Prep
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Register via Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">94%</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Met First-Attempt Target</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">6 Major</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Test Formats Supported</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">British Council</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Accredited Partner Pathway</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">MOI Waivers</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Evaluated for Qualified Degrees</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Exams We Coordinate</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Supported Standardized Examinations
            </h2>
            <p className="text-slate-600">
              Depending on your country of study, degree level, and university ranking, we recommend the exact test required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((test, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{test.badge}</span>
                    <span className="text-xs text-slate-500 font-semibold">{test.scoreTarget}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">{test.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Accepted in: {test.acceptedIn}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{test.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href={`/contact?service=test&exam=${encodeURIComponent(test.name)}`}
                    className="text-sm font-bold text-navy hover:text-brand-orange transition-colors inline-flex items-center gap-1.5"
                  >
                    Register for {test.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Strategic Advantage</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              How We Streamline Test Prep
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-navy text-brand-orange flex items-center justify-center font-bold mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need Advice on Test Requirements or Waivers?"
        desc="Talk to our admissions counselors. We will evaluate whether you need IELTS/TOEFL or qualify for an English language waiver."
      />
    </main>
  );
}
