import Link from "next/link";
import { CheckCircle2, UserCircle2, LayoutDashboard, FileText, ClipboardList, Plane, FolderLock, ArrowRight } from "lucide-react";

export function DashboardShowcase() {
  return (
    <section id="dashboard" className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-navy/10 text-navy text-xs font-bold uppercase tracking-widest mb-4 border border-navy/20">Student Portal</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Your Personal <span className="text-brand-orange">Dashboard</span></h2>
          <p className="text-slate-600 text-lg">Track your study abroad application, test coordination, documents, and visa milestones in real time.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
          
          <div className="w-full md:w-64 bg-slate-50 p-6 border-r border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><UserCircle2 /></div>
              <div>
                <div className="text-sm font-bold text-slate-900">John Mensah</div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Student</div>
              </div>
            </div>
            
            <div className="px-3 py-2.5 rounded-lg bg-navy text-white font-medium text-sm flex items-center gap-3"><LayoutDashboard className="w-4 h-4 opacity-70" /> Overview</div>
            <div className="px-3 py-2.5 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-3"><ClipboardList className="w-4 h-4 opacity-70" /> Applications</div>
            <div className="px-3 py-2.5 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-3"><FileText className="w-4 h-4 opacity-70" /> Tests & Exams</div>
            <div className="px-3 py-2.5 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-3"><FolderLock className="w-4 h-4 opacity-70" /> Documents</div>
            <div className="px-3 py-2.5 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-3"><Plane className="w-4 h-4 opacity-70" /> Visa & Travel</div>
          </div>
          
          <div className="flex-1 p-8 space-y-8 bg-white">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Application Milestone Tracker</h3>
                <div className="text-xs text-slate-500">UK Undergraduate Route - Intake: Sept 2025</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 75% Profile Health
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs mb-1 font-medium">Shortlisted Universities</div>
                <div className="text-lg font-bold text-slate-900 mb-2">3 Selected</div>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block">1 Offer In Hand</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs mb-1 font-medium">English Test (IELTS)</div>
                <div className="text-lg font-bold text-slate-900 mb-2">Band 7.5</div>
                <div className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded inline-block">Verified</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs mb-1 font-medium">Document Locker</div>
                <div className="text-lg font-bold text-slate-900 mb-2">6 Uploaded</div>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block">100% Vetted</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs mb-1 font-medium">Assigned Advisor</div>
                <div className="text-lg font-bold text-slate-900 mb-2">L. Boateng</div>
                <div className="text-[10px] text-brand-orange-hover font-bold bg-brand-orange/10 px-2 py-0.5 rounded inline-block">Active</div>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-sm font-bold text-slate-900 mb-4">Recent Activity</div>
              <div className="flex gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Coventry University - Unconditional Offer Issued!</div>
                  <div className="text-xs text-slate-600 mt-1">Offer includes £3,000 Early Bird International Scholarship for BSc Computing (Sept 2025).</div>
                  <div className="text-[10px] text-slate-400 mt-2">2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Start managing your study-abroad journey today</h3>
            <p className="text-slate-600">Create your free student account to unlock university shortlists, test bookings, and real-time tracking.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white font-bold transition-colors">Create Student Account</Link>
            <Link href="/portal" className="px-8 py-3 rounded-lg bg-navy hover:bg-navy-light text-white font-bold transition-colors">Log In to Portal &rarr;</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
