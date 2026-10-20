import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Calendar, DollarSign, Clock, Briefcase, ShieldCheck } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Study in Canada | Dellics Education Consult',
  description: 'Complete guide to studying in Canada: DLI college and university admissions, Provincial Attestation Letter (PAL), PGWP work permits, GIC living expense proof, and Canadian study permit processing.',
};

export default function StudyInCanadaPage() {
  const topInstitutions = [
    { name: 'University of Toronto', tag: 'Top Global Research', focus: 'Computer Science, Rotman Business, Life Sciences' },
    { name: 'McGill University', tag: 'World-Class Faculty', focus: 'Biomedical Science, Engineering, Law' },
    { name: 'University of Waterloo', tag: 'Global Co-op Leader', focus: 'Software Engineering, Math, Actuarial Science' },
    { name: 'University of Alberta', tag: 'High Graduate Employment', focus: 'Energy, AI & Machine Learning, Public Health' },
    { name: 'George Brown College', tag: 'Toronto Industry Hub', focus: 'Hospitality, Culinary Arts, Information Technology' },
    { name: 'Seneca Polytechnic', tag: 'Applied Career Skills', focus: 'Aviation, Digital Media, Supply Chain' },
  ];

  const keyFacts = [
    { icon: Briefcase, label: 'Post-Grad Work Permit', val: 'Up to 3 Years (PGWP)' },
    { icon: Clock, label: 'Work During Study', val: '24 hrs / week off-campus' },
    { icon: DollarSign, label: 'Average Tuition', val: 'CAD $16,000 - $28,000 / yr' },
    { icon: Calendar, label: 'Primary Intakes', val: 'September & January' },
  ];

  const milestones = [
    { phase: 'DLI Match', title: 'DLI Selection & Assessment', desc: 'Identify designated learning institutions (DLIs) offering eligible PGWP programs aligned with provincial labor demands.' },
    { phase: 'Acceptance', title: 'Letter of Acceptance (LOA)', desc: 'Submit authenticated academic transcripts and WAEC or degree certificates to secure a formal Letter of Acceptance.' },
    { phase: 'Compliance', title: 'PAL & GIC Financial Setup', desc: 'Acquire your Provincial Attestation Letter (PAL) and open an approved CAD $20,635 Guaranteed Investment Certificate (GIC).' },
    { phase: 'Permit Filing', title: 'Study Permit Submission', desc: 'Lodge your IRCC online study permit application with medical clearance, biometric booking, and strong home-tie documentation.' },
  ];

  const pgwpHighlights = [
    'Eligibility for up to 3 years open work permit upon graduation from eligible DLI programs',
    'Spouse open work permit eligibility for Master’s and Doctoral degree students',
    'Direct pathways to permanent residency via Canadian Experience Class (Express Entry) and Provincial Nominee Programs (PNP)',
    'World-renowned public healthcare, safety, and multicultural diversity across all Canadian provinces',
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-brand-orange text-white">CA</span>
              Top Immigrant & Study Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Study in <span className="text-brand-orange">Canada</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Benefit from globally acclaimed academic qualifications, co-op internship opportunities, 
              and a structured bridge to post-graduation career opportunities with the Post-Graduation Work Permit (PGWP).
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup?destination=canada"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Apply to Canadian Institutions
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?destination=canada"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Book Canada Consultation
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
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Designated Institutions</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Top Canadian Partner Universities & Colleges
            </h2>
            <p className="text-slate-600">
              Direct recruitment partnerships across Ontario, British Columbia, Alberta, and Atlantic Canada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topInstitutions.map((uni, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">{uni.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{uni.name}</h3>
                  <p className="text-slate-600 text-xs mb-4">Core Strengths: {uni.focus}</p>
                </div>
                <Link
                  href={`/contact?destination=canada&university=${encodeURIComponent(uni.name)}`}
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
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Immigration & Careers</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Post-Graduation Work Permit (PGWP) Advantages
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Canada remains one of the most attractive global destinations for ambitious international graduates. Our legal and visa advisors walk you through every regulatory requirement, including updated Provincial Attestation Letter (PAL) allocations and GIC compliance.
              </p>
              <div className="space-y-3">
                {pgwpHighlights.map((hl, idx) => (
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
                  <h3 className="font-bold text-white text-lg">PAL & GIC Advisory Protocol</h3>
                  <p className="text-xs text-slate-400">IRCC regulatory compliance</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Under current IRCC policy, every undergraduate and college applicant requires an authorized Provincial Attestation Letter (PAL) from the provincial ministry before visa lodgement. We ensure your designated institution guarantees your quota slot.
              </p>
              <div className="bg-navy-dark p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Mandatory GIC Living Funds:</span>
                  <span className="font-bold text-brand-orange">CAD $20,635</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Average Visa Processing:</span>
                  <span className="font-bold text-white">6-10 Weeks</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Accra Biometrics Center:</span>
                  <span className="font-bold text-white">VFS Global Accra</span>
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
              Your Pathway to Canada
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
        title="Ready to Start Your Canadian Journey?"
        desc="Connect with Dellics Travels education consultants for expert DLI matching, LOA admission, and study permit filing."
      />
    </main>
  );
}
