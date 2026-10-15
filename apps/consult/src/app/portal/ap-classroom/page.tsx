"use client";

import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  CheckCircle2,
  Lock
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function ApClassroomPage() {
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
            Advanced Placement® Classroom
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {firstName}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AP Suite</span>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            My AP Classroom
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
            Access practice questions, unit progress checks, AP daily videos, and exam registrations for college credits and advanced standing.
          </p>
        </div>

        {/* Featured AP Highlight Banner */}
        <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider">
              Career & Industry Pathways
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              The AP shaped by leading companies. Meet AP Cybersecurity.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore college-level courses recognized by thousands of universities worldwide. Earn credits before you even land on campus.
            </p>
            <Link
              href="https://apcentral.collegeboard.org/"
              target="_blank"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-orange text-white font-bold text-xs hover:bg-brand-orange-light shadow-md transition-colors"
            >
              <span>Explore Course Framework</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="text-xs font-bold text-brand-orange uppercase">Enrolled Course</div>
            <h3 className="font-bold text-slate-900 text-base">AP Computer Science Principles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore programming fundamentals, algorithmic thinking, data analysis, and digital impact.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Unit 3 Progress Check:</span>
              <span className="font-bold text-emerald-600">Complete</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="text-xs font-bold text-brand-orange uppercase">Enrolled Course</div>
            <h3 className="font-bold text-slate-900 text-base">AP English Language and Composition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cultivate reading comprehension, rhetorical analysis, and argument synthesis for university writing.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Unit 2 Progress Check:</span>
              <span className="font-bold text-navy">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
