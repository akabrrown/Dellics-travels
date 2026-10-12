import type { Metadata } from 'next';
import Link from 'next/link';
import { Plane, Luggage, Home, ShieldCheck, ArrowRight, CheckCircle2, PhoneCall, MapPin } from 'lucide-react';
import { CtaBanner } from '@/components/home';

export const metadata: Metadata = {
  title: 'Student Travel & Tour Logistics | Dellics Education Consult',
  description: 'Special student flight discounts, extra baggage allowances, verified university accommodation, airport pickup, and international eSIM cards powered by Dellics Travels.',
};

export default function StudentTravelPage() {
  const travelPerks = [
    {
      icon: Plane,
      title: 'Discounted Student Airfares',
      desc: 'Exclusive negotiated fares with British Airways, Qatar Airways, Emirates, KLM, and Delta with flexible date change options.',
    },
    {
      icon: Luggage,
      title: 'Extra Baggage Allowances',
      desc: 'Moving abroad requires packing your essentials. We secure student baggage waivers allowing up to 2 x 23kg or 2 x 32kg checked luggage.',
    },
    {
      icon: Home,
      title: 'Verified Student Housing',
      desc: 'Avoid rental scams. We connect you directly with university halls and verified private student residences (PBSA) with all bills included.',
    },
    {
      icon: MapPin,
      title: 'Airport Meet & Greet',
      desc: 'Arrival in a new country can be daunting. We arrange dedicated drivers to meet you at the airport terminal and transfer you to your campus dorm.',
    },
    {
      icon: PhoneCall,
      title: 'Global Travel eSIMs',
      desc: 'Stay connected the minute you touch down. We provide instant international eSIMs with high-speed data for UK, USA, Canada, and Europe.',
    },
    {
      icon: ShieldCheck,
      title: 'Comprehensive Travel Insurance',
      desc: 'Protect against flight cancellations, medical emergencies, and lost baggage with student-tier international travel insurance.',
    },
  ];

  const departureChecklist = [
    'Original Passport & Valid Student Visa Stamp',
    'Official CAS, Form I-20, or Letter of Acceptance',
    'Certified Medical & Tuberculosis Clearance Certificates',
    'Proof of Accommodation & Airport Transfer Voucher',
    'Financial Evidence & Tuition Deposit Receipts',
    'Valid International Travel eSIM Activation',
  ];

  return (
    <main className="min-h-screen font-sans pt-16 bg-slate-50">
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#26299c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
              <Plane className="w-4 h-4" />
              Powered by Dellics Travels
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Student Travel & <span className="text-brand-orange">Relocation Logistics</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Your admission and visa are granted. Now let us get you safely to your campus dorm. 
              Enjoy discounted student flights, verified housing, terminal pickups, and international eSIMs.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://dellicstravels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-orange/30 inline-flex items-center gap-2"
              >
                Book Flights via Dellics Travels
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact?service=travel"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Inquire on Housing & Transfers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Student Transit Services</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Everything You Need for Departure
            </h2>
            <p className="text-slate-600">
              We eliminate the stress of international transit so you arrive refreshed and ready for orientation week.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelPerks.map((perk, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-brand-orange/30 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-navy/5 text-navy flex items-center justify-center mb-6">
                  <perk.icon className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{perk.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-3">Pre-Departure Briefing</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Essential Travel Checklist</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                Our pre-departure orientation prepares you for airport security, transit customs, currency exchange, opening student bank accounts, and adapting to campus life.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {departureChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need Flight Quotes or Student Accommodation?"
        desc="Contact our travel coordination desk today. We will price-match student fares and reserve your accommodation."
      />
    </main>
  );
}
