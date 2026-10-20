"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  DollarSign, 
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Sparkles as SparklesBan,
  Compass
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function BigFutureDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Sam";

  const [collegeQuery, setCollegeQuery] = useState("");
  const [helpfulFeedback, setHelpfulFeedback] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* College Board BigFuture Global Header */}
      <div className="bg-[#002D62] text-white px-4 sm:px-8 py-3 flex items-center justify-between text-xs border-b border-white/10">
        <div className="flex items-center gap-6">
          <Link href="/portal" className="text-slate-300 hover:text-white font-semibold flex items-center gap-1.5">
            &larr; Student Portal
          </Link>
          <span className="text-lg font-display font-extrabold tracking-tight text-white">
            BigFuture<span className="text-brand-orange">®</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search careers, colleges, scholarships..."
              value={collegeQuery}
              onChange={e => setCollegeQuery(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-300 focus:outline-none focus:bg-white focus:text-slate-900 transition-all w-64"
            />
          </div>
          <span className="text-slate-300 font-medium">Hi, {firstName}</span>
        </div>
      </div>

      {/* BigFuture Sub-Navbar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-6 overflow-x-auto py-3 text-xs font-semibold text-slate-600">
          <span className="text-navy font-bold border-b-2 border-navy pb-1">My BigFuture</span>
          <Link href="#vision" className="hover:text-navy transition-colors whitespace-nowrap">Vision Builder</Link>
          <Link href="#careers" className="hover:text-navy transition-colors whitespace-nowrap">Explore Careers</Link>
          <Link href="#plan" className="hover:text-navy transition-colors whitespace-nowrap">Plan for College</Link>
          <Link href="#pay" className="hover:text-navy transition-colors whitespace-nowrap">Pay for College</Link>
          <Link href="#resources" className="hover:text-navy transition-colors whitespace-nowrap">Resources & Programs</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Onboarding Progress (Getting Started) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Getting Started</span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
                Hi, {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Finish completing your BigFuture Profile to personalize scholarship and college discovery.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <div className="w-12 h-12 rounded-full border-4 border-brand-orange/30 border-t-brand-orange flex items-center justify-center font-bold text-xs text-navy">
                0%
              </div>
              <div className="text-xs font-bold text-slate-700">Profile Progress</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "Add your grades",
              "Pick subjects you’re interested in",
              "Start a college list",
              "Get noticed by colleges and scholarships"
            ].map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-slate-700 leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Find the Right College For You Hero Search */}
        <div className="bg-gradient-to-r from-navy via-[#0A2540] to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider">
              College Search Tool
            </span>
            <h2 className="text-3xl font-display font-bold text-white">
              Find the Right College For you
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore 4,000+ universities worldwide. Filter by majors, campus size, admission rate, scholarship availability, and location.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by college name (e.g. Harvard, Manchester, Toronto, ASU)..."
                  value={collegeQuery}
                  onChange={e => setCollegeQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="py-3 px-6 rounded-xl bg-brand-orange text-white font-bold text-xs hover:bg-brand-orange-light shadow-md transition-colors"
              >
                Search Colleges
              </button>
            </div>
          </div>
        </div>

        {/* My Saved Items Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">My Saved Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">College List</div>
                <div className="text-xl font-display font-bold text-slate-900">0</div>
              </div>
              <GraduationCap className="w-6 h-6 text-slate-400" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Career List</div>
                <div className="text-xl font-display font-bold text-slate-900">0</div>
              </div>
              <Briefcase className="w-6 h-6 text-slate-400" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Scholarship List</div>
                <div className="text-xl font-display font-bold text-slate-900">0</div>
              </div>
              <DollarSign className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        </div>

        {/* SECTION: DO NOW */}
        <div className="space-y-4" id="vision">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900">Do Now</h3>
            <p className="text-xs text-slate-500">Take these steps to start planning for college, careers, and life after high school.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Vision Builder */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                <Unlock className="w-3 h-3" /> Unlocked
              </span>
              <h4 className="font-bold text-slate-900 text-base">Complete the Vision Builder</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create a vision board to help you plan for life after high school. Outline your dream lifestyle, college vibe, and goals.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:text-brand-orange flex items-center gap-1 pt-1">
                <span>Start Vision Board</span> &rarr;
              </button>
            </div>

            {/* Card 2: Career Quiz */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3" id="careers">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                <Unlock className="w-3 h-3" /> Unlocked
              </span>
              <h4 className="font-bold text-slate-900 text-base">Take the Career Quiz</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get personalized career recommendations based on your likes and dislikes. Match your interests to high-growth industries.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:text-brand-orange flex items-center gap-1 pt-1">
                <span>Take 10-Min Quiz</span> &rarr;
              </button>
            </div>

            {/* Card 3: Start Career List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                  <Unlock className="w-3 h-3" /> Unlocked
                </span>
                <span className="text-[11px] font-bold text-slate-500">0 of 3 Careers Added</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">Start Your Career List</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find careers that match your interests. Save 3 top professions to unlock salary comparisons and university requirements.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:text-brand-orange flex items-center gap-1 pt-1">
                <span>Browse Careers</span> &rarr;
              </button>
            </div>

            {/* Card 4: Community Library */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3" id="resources">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                <Unlock className="w-3 h-3" /> Unlocked
              </span>
              <h4 className="font-bold text-slate-900 text-base">Explore the BigFuture Community Library</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find expert college and career advice in one place. Explore videos and articles anytime on admissions essays, SAT prep, and interviews.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:text-brand-orange flex items-center gap-1 pt-1">
                <span>Open Library</span> &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* SECTION: DO LATER */}
        <div className="space-y-4" id="plan">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900">Do Later</h3>
            <p className="text-xs text-slate-500">Check back soon! More steps will unlock to help you prepare for college, pay for college, and explore careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Take the College Quiz (In Progress) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                  In Progress
                </span>
                <span className="text-[11px] font-bold text-brand-orange">1 of 5 Questions Answered</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Take the College Quiz</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover colleges that are the right fit for you based on size, location, and campus life.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:underline">Continue Quiz &rarr;</button>
            </div>

            {/* Start Your College List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                  <Unlock className="w-3 h-3" /> Unlocked
                </span>
                <span className="text-[11px] font-bold text-slate-500">0 of 3 Colleges Added</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Start Your College List</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find the right college for you. Bookmark international universities across UK, Canada, and USA.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:underline">Build List &rarr;</button>
            </div>

            {/* Strengthen Your College List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                <Unlock className="w-3 h-3" /> Unlocked
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Strengthen Your College List</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A mix of reach, match, and safety schools will help you find the right college for you.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <div>Reach: <strong>0 / 3</strong> in progress</div>
                <div>Match: <strong>0 / 2</strong> in progress</div>
                <div>Safety: <strong>0 / 1</strong> in progress</div>
              </div>
            </div>

            {/* Start Your Scholarship List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3" id="pay">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                  <Unlock className="w-3 h-3" /> Unlocked
                </span>
                <span className="text-[11px] font-bold text-slate-500">0 of 3 Added</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Start Your Scholarship List</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find scholarships that match your background, grades, and intended study destination.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:underline">Find Scholarships &rarr;</button>
            </div>

            {/* Apply to Colleges (Locked) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 opacity-75">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                <Lock className="w-3 h-3" /> Unlocks Fall of Senior Year
              </span>
              <h4 className="font-bold text-slate-800 text-sm">Apply to Colleges</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                This is what you've been working toward. You've got this! Dellics advisors coordinate your UCAS, Common App, and OUAC filings.
              </p>
            </div>

            {/* Complete the FAFSA (Locked) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 opacity-75">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                <Lock className="w-3 h-3" /> Unlocks in December of Senior Year
              </span>
              <h4 className="font-bold text-slate-800 text-sm">Complete the FAFSA®</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The FAFSA and CSS Profile are critical steps to unlock institutional and federal aid for eligible students.
              </p>
            </div>

            {/* Financial Aid Quiz */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                <Unlock className="w-3 h-3" /> Unlocked
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Financial Aid Quiz</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estimate how much financial aid and merit grants you may qualify for with this preliminary estimation tool.
              </p>
              <button type="button" className="text-xs font-bold text-navy hover:underline">Estimate Aid &rarr;</button>
            </div>

            {/* Register for SAT (Locked) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 opacity-75">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                <Lock className="w-3 h-3" /> Unlocks Fall of 11th Grade
              </span>
              <h4 className="font-bold text-slate-800 text-sm">Register for the SAT</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Show what you know and stand out on college applications. Or register now on our dedicated SAT Hub.
              </p>
              <Link href="/portal/sat" className="text-xs font-bold text-brand-orange hover:underline block">
                Go to SAT Hub &rarr;
              </Link>
            </div>

            {/* Practice for SAT (Locked) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 opacity-75">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                <Lock className="w-3 h-3" /> Unlocks Winter of 11th Grade
              </span>
              <h4 className="font-bold text-slate-800 text-sm">Practice for the SAT</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The key to SAT success is free practice and preparation. Download Bluebook or answer the Daily Question.
              </p>
              <Link href="/portal/sat/question-of-the-day" className="text-xs font-bold text-brand-orange hover:underline block">
                Question of the Day &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Done Card */}
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-emerald-900">Done</div>
              <div className="text-xs text-emerald-700">Great job! You've taken big steps to prepare for life after high school.</div>
            </div>
          </div>
        </div>

        {/* Was this page helpful? */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="text-xs font-bold text-slate-800">Was this page helpful?</div>
          {helpfulFeedback ? (
            <div className="text-xs text-emerald-600 font-semibold">Thank you for your feedback!</div>
          ) : (
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setHelpfulFeedback("yes")}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-slate-500" /> Yes
              </button>
              <button
                type="button"
                onClick={() => setHelpfulFeedback("no")}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-slate-500" /> No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
