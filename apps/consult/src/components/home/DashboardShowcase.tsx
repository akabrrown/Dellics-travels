import Link from "next/link";
import { CheckCircle2, UserCircle2 } from "lucide-react";

export function DashboardShowcase() {
  return (
    <section id="dashboard" className="py-24 bg-brand-blue text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4 border border-brand-orange/30">Student Service Platform</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Your Personal <span className="text-brand-orange">Student Dashboard</span></h2>
          <p className="text-slate-300 text-lg">Experience how Dellics tracks your study abroad application, test coordination, documents, and visa milestones in real time — zero guesswork, 100% transparency.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2rem] border border-slate-700 shadow-sm border border-neutral-200 overflow-hidden flex flex-col md:flex-row relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-yellow-500 to-brand-orange"></div>
          
          <div className="w-full md:w-64 bg-slate-800/50 p-6 border-r border-slate-700/50 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300"><UserCircle2 /></div>
              <div>
                <div className="text-sm font-bold text-white">John Mensah</div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Student</div>
              </div>
            </div>
            
            <div className="px-3 py-2.5 rounded-xl bg-brand-blue/30 text-white font-medium text-sm flex items-center gap-3 border border-brand-blue/50"><span className="opacity-70">📊</span> Overview</div>
            <div className="px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 font-medium text-sm flex items-center gap-3 cursor-not-allowed"><span className="opacity-70">🏛️</span> Applications</div>
            <div className="px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 font-medium text-sm flex items-center gap-3 cursor-not-allowed"><span className="opacity-70">🎯</span> Tests & Exams</div>
            <div className="px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 font-medium text-sm flex items-center gap-3 cursor-not-allowed"><span className="opacity-70">📁</span> Documents</div>
            <div className="px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 font-medium text-sm flex items-center gap-3 cursor-not-allowed"><span className="opacity-70">🛂</span> Visa & Travel</div>
          </div>
          
          <div className="flex-1 p-8 space-y-8 bg-slate-900/50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Application Milestone Tracker</h3>
                <div className="text-xs text-slate-400">UK Undergraduate Route · Intake: Sept 2025</div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 75% Profile Health
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                <div className="text-slate-400 text-xs mb-1 font-medium">Shortlisted Universities</div>
                <div className="text-lg font-bold text-white mb-2">3 Selected</div>
                <div className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded inline-block">1 Offer In Hand</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                <div className="text-slate-400 text-xs mb-1 font-medium">English Test (IELTS)</div>
                <div className="text-lg font-bold text-white mb-2">Band 7.5</div>
                <div className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded inline-block">Verified</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                <div className="text-slate-400 text-xs mb-1 font-medium">Document Locker</div>
                <div className="text-lg font-bold text-white mb-2">6 Uploaded</div>
                <div className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded inline-block">100% Vetted</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                <div className="text-slate-400 text-xs mb-1 font-medium">Assigned Advisor</div>
                <div className="text-lg font-bold text-white mb-2">L. Boateng</div>
                <div className="text-[10px] text-brand-orange font-bold bg-brand-orange/10 px-2 py-0.5 rounded inline-block">Active</div>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="text-sm font-bold text-white mb-4">Recent Activity</div>
              <div className="flex gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <div>
                  <div className="text-sm font-bold text-white">Coventry University — Unconditional Offer Issued!</div>
                  <div className="text-xs text-slate-400 mt-1">Offer includes £3,000 Early Bird International Scholarship for BSc Computing (Sept 2025).</div>
                  <div className="text-[10px] text-slate-500 mt-2">2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Start managing your study-abroad journey like John</h3>
            <p className="text-slate-300">Create your free student account to unlock university shortlists, test bookings, and real-time tracking.</p>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-light text-white font-bold transition-colors">Create Student Account</Link>
            <Link href="/portal" className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-colors">Launch Live Portal &rarr;</Link>
          </div>
        </div>
      </div>
    </section>
  );
}