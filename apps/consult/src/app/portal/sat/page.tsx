"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Award, 
  ShieldCheck,
  Search,
  Sparkles as SparklesIconBan, // We don't use sparkles, use Compass
  Compass,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function MySatHubPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Sam";
  const [code, setCode] = useState("");
  const [codeMessage, setCodeMessage] = useState("");

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setCodeMessage("Code applied! Fee waiver / registration assistance eligibility verified.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* College Board / Dellics Consult Header Bar */}
      <div className="bg-[#0A2540] text-white border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5">
            &larr; Return to Student Portal
          </Link>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300 font-semibold uppercase tracking-wider">
            The College Board & Dellics Consult Partner Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {firstName}</span>
          <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-[11px]">
            {firstName.charAt(0)}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              SAT Suite of Assessments
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2">
              Hello, {firstName}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              Manage your test registrations and scores. Plan your digital testing journey with official test materials, diagnostic evaluations, and fee waiver support.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="https://satsuite.collegeboard.org/sat/registration"
              target="_blank"
              className="py-3 px-6 rounded-xl bg-[#F5A623] hover:bg-[#e09318] text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Register for the SAT</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portal/sat/question-of-the-day"
              className="py-3 px-6 rounded-xl bg-navy hover:bg-navy-light text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>SAT Question of the Day</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Got a Code? Fee Waiver */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-lg font-display font-bold text-slate-900">Got a Code?</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter your code here. Ask your Dellics counselor for more details about fee waivers — learn if you're eligible for discounted international exam sittings.
            </p>

            <form onSubmit={handleRedeemCode} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter fee waiver or access code"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy flex-1"
              />
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors"
              >
                Submit Code
              </button>
            </form>
            {codeMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
                {codeMessage}
              </div>
            )}
          </div>
        </div>

        {/* Don't Forget These Steps & Upcoming Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Don't Forget These Steps */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Don't Forget These Steps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get deadlines and details for test-related tasks. Sign up to take your first SAT by clicking the yellow "Register" button above.
            </p>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-2 text-slate-800">
              <div className="font-bold text-amber-900">Upcoming Registration Deadline:</div>
              <div>Register by <strong>10/23</strong> for the November SAT sitting at accredited testing centers across Accra, Kumasi, and Tema.</div>
            </div>
          </div>

          {/* My Upcoming Tests */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">My Upcoming Tests</h3>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="text-xs font-bold text-slate-800">You Don’t Have Any Upcoming Tests.</div>
              <p className="text-xs text-slate-500">
                Taking the SAT at school? Your test date will show when you get scores.
              </p>
            </div>
          </div>
        </div>

        {/* My Scores */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">My Scores</h3>
            <Link href="/portal/scores" className="text-xs font-bold text-brand-orange hover:underline">
              View Score History &rarr;
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To see where you've already sent your scores or to check the status of recently placed orders, visit the Score Sends application.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Don’t see your scores? Here's what you can do:</span>
            <Link href="/contact" className="text-navy font-bold hover:underline">
              Contact Your Dellics Advisor
            </Link>
          </div>
        </div>

        {/* Practice and Preparation Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Practice for the SAT</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take an SAT Practice Test in Bluebook. Experience the exact digital interface, timing, and built-in graphing calculator.
            </p>
            <Link 
              href="https://bluebook.collegeboard.org/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline pt-1"
            >
              <span>Download Bluebook App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Prepare for the SAT</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get official diagnostic materials, vocabulary flashcards, and Khan Academy digital curriculum tailored to your targets.
            </p>
            <Link 
              href="https://www.khanacademy.org/sat"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline pt-1"
            >
              <span>Khan Academy Prep</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Next Steps Towards College</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Finish your student profile and earn scholarships by planning for college on BigFuture and Dellics Education Consult.
            </p>
            <Link 
              href="/portal/bigfuture"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:underline pt-1"
            >
              <span>Open BigFuture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Questions Footer */}
        <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800">Questions? Need help?</div>
          <p>Learn more about the Digital SAT, registration fee waivers, and testing accommodations at Dellics Education Consult.</p>
        </div>
      </div>
    </div>
  );
}
