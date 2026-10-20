import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, CheckCircle2, ArrowRight, BookOpen, Clock, Building, Compass, FileText, SendHorizontal, Award } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'University Admissions Advisory | Dellics Education Consult',
  description: 'Expert university admissions guidance for undergraduate and postgraduate study in UK, USA, Canada, and Australia. Profile assessment, SOP review, and guaranteed partner placement.',
};

export default function UniversityAdmissionsPage() {
  const processMilestones = [
    {
      phase: 'Diagnostic Audit',
      icon: Compass,
      title: 'Profile Assessment & Consultation',
      desc: 'We analyze your academic transcripts, English proficiency, career goals, and budget to identify high-acceptance target universities.',
    },
    {
      phase: 'Institutional Matching',
      icon: Building,
      title: 'Course & Institution Shortlisting',
      desc: 'Selecting 3-5 matched institutions across top-ranked, affordable, and high-scholarship tiers in your preferred study destination.',
    },
    {
      phase: 'Dossier Refinement',
      icon: FileText,
      title: 'Document Dossier Preparation',
      desc: 'Comprehensive review and polishing of your Statement of Purpose (SOP), CV, reference letters, and portfolio to stand out to admissions boards.',
    },
    {
      phase: 'Direct Submission',
      icon: SendHorizontal,
      title: 'Direct Application Submission',
      desc: 'Direct submission through our official university portal partnerships, expediting offer letters and eliminating institutional application fees where available.',
    },
    {
      phase: 'Acceptance & CAS/I-20',
      icon: Award,
      title: 'Offer Acceptance & Visa Document Issuance',
      desc: 'Guidance on choosing between conditional and unconditional offers, meeting academic conditions, tuition deposits, and receiving CAS/I-20.',
    },
  ];

  const highlights = [
    { label: 'Application Success Rate', val: '98%' },
    { label: 'Partner Universities', val: '120+' },
    { label: 'Average Offer Turnaround', val: '2-4 Weeks' },
    { label: 'Dedicated Education Counsellors', val: '1-on-1' },
  ];

  const programLevels = [
    {
      title: 'Undergraduate Programs',
      duration: '3-4 Years',
      desc: 'Bachelor’s degrees, Foundation pathways, and International Year One entries for WASSCE, A-Level, and IB diploma holders.',
      intakes: 'September / January',
    },
    {
      title: 'Postgraduate Taught (Masters)',
      duration: '1-2 Years',
      desc: 'MSc, MA, and MBA programs with flexible entry requirements, dissertation support, and post-study work visa rights.',
      intakes: 'September / January / May',
    },
    {
      title: 'Postgraduate Research (PhD)',
      duration: '3-4 Years',
      desc: 'Research proposal review, potential supervisor identification, and funding application guidance for doctoral candidates.',
      intakes: 'Rolling Admissions',
    },
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <GraduationCap className="w-4 h-4" />
              Academic Placement Advisory
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              University Admissions <span className="text-brand-orange">Guidance</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Securing admission into leading universities worldwide doesn’t have to be overwhelming. 
              Our certified counsellors handle your entire application lifecycle from course selection to unconditional offer letters.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Apply for Admission Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?service=admissions"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {highlights.map((stat, i) => (
              <div key={i} className="p-4">
                <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">{stat.val}</p>
                <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Qualifications We Support</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Programs & Degrees
            </h2>
            <p className="text-slate-600">
              Whether you are transitioning from high school or advancing your professional career, we have matched academic pathways.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programLevels.map((lvl, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{lvl.duration}</span>
                    <span className="text-xs text-slate-500 font-medium">{lvl.intakes}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{lvl.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{lvl.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href={`/contact?service=admissions&program=${encodeURIComponent(lvl.title)}`}
                    className="text-sm font-bold text-brand-orange hover:text-navy transition-colors inline-flex items-center gap-1.5"
                  >
                    Check Eligibility <ArrowRight className="w-3.5 h-3.5" />
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
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Admissions Pipeline</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Milestone Admission Framework
            </h2>
            <p className="text-slate-600">
              A transparent, proven process designed to remove uncertainty and maximize your admission offers.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {processMilestones.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-brand-orange/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-navy text-brand-orange flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-brand-orange/10 text-brand-orange uppercase">
                        {item.phase}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Begin Your University Application?"
        desc="Connect with Dellics Education Consult today for expert course shortlisting and direct university placement."
      />
    </main>
  );
}
