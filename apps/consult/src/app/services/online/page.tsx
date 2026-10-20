import type { Metadata } from 'next';
import Link from 'next/link';
import { Video, ArrowRight, ShieldCheck, Clock, Calendar, Users, FileCheck2 } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Online Education Counselling | Dellics Education Consult',
  description: 'Book 1-on-1 virtual consultations with experienced international education advisors via video call. Available to students and parents across Ghana and West Africa.',
};

export default function OnlineCounsellingPage() {
  const sessionBenefits = [
    {
      icon: Clock,
      title: 'Location Independence',
      desc: 'Join high-definition video consultations from Accra, Kumasi, Takoradi, Lagos, or anywhere globally from your mobile phone or laptop.',
    },
    {
      icon: Users,
      title: 'Family & Parent Involvement',
      desc: 'Parents and guardians can join the video call to ask direct questions about tuition budgeting, campus safety, health insurance, and immigration policies.',
    },
    {
      icon: FileCheck2,
      title: 'Real-Time Document Review',
      desc: 'Share your screen or upload transcripts during the call for instant evaluation of GPA, entry eligibility, and scholarship potential.',
    },
    {
      icon: ShieldCheck,
      title: 'Actionable Study Roadmap',
      desc: 'Leave the session with a written diagnostic summary recommending target universities, realistic intakes, budget estimates, and next steps.',
    },
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <Video className="w-4 h-4" />
              Virtual 1-on-1 Consultations
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Personalized Online <span className="text-brand-orange">Counselling</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Cannot make it to our physical office? Connect directly with our senior study abroad advisors via secure video call. 
              Get clarity on universities, visa rules, and scholarships from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?service=counselling"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Book Virtual Session
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Access Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">45 Mins</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Dedicated Strategy Time</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">Zoom & Meet</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">High Definition Video</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">Free</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Initial Discovery Call</p>
            </div>
            <div className="p-4">
              <p className="text-3xl md:text-4xl font-display font-bold text-navy mb-1">Mon-Sat</p>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">Flexible Scheduling</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Remote Advisory</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              What to Expect in Your Session
            </h2>
            <p className="text-slate-600">
              Interactive consultation focused on actionable outcomes and personalized university shortlists.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionBenefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy text-brand-orange flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Connect with an Educational Advisor?"
        desc="Schedule your virtual video session today to get instant clarity on applications, fees, and requirements."
      />
    </main>
  );
}
