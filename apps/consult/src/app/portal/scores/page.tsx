"use client";

import React from "react";
import Link from "next/link";
import { 
  Award, 
  ArrowRight, 
  ExternalLink, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  HelpCircle,
  Calendar
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function ScoresPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Sam";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* College Board Top Bar */}
      <div className="bg-[#0A2540] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5">
            &larr; Back to Student Portal
          </Link>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-slate-300 font-semibold uppercase tracking-wider">
            SAT & PSAT Suite Score Reporting
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {firstName}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Reports</span>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            PSAT/NMSQT, PSAT 10, and PSAT 8/9 Scores
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
            Access your comprehensive score breakdown, subscores, cross-test scores, and National Merit Scholarship Corporation (NMSC) eligibility status.
          </p>
        </div>

        {/* Score Overview Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Most Recent Score</div>
              <div className="text-2xl font-display font-bold text-navy mt-1">PSAT/NMSQT Practice Diagnostic</div>
              <div className="text-xs text-slate-400 mt-0.5">Administered via Dellics Test Preparation Lab</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <div className="text-3xl font-display font-bold text-emerald-700">1340</div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Total Score / 1520</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-bold">Reading and Writing</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">680 / 760</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">Met College Readiness Benchmark</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-bold">Math</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">660 / 760</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">Met College Readiness Benchmark</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="https://satsuite.collegeboard.org/k-12-educators/scores"
              target="_blank"
              className="py-2.5 px-5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light flex items-center gap-1.5 transition-colors"
            >
              <span>Download Official Score Report (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/portal/sat/question-of-the-day"
              className="py-2.5 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <span>Target Weaknesses in Question of the Day</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Score Sends Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Score Sends to Universities</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your scores can be transmitted directly to participating universities in the United States, Canada, and the United Kingdom through your Dellics portal or your College Board account.
          </p>
        </div>
      </div>
    </div>
  );
}
