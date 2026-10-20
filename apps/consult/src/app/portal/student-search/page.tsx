"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Globe, 
  Award, 
  Lock,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function StudentSearchServicePage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Sam";
  const [optInStatus, setOptInStatus] = useState<"opted_in" | "opted_out" | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* College Board / Dellics Top Bar */}
      <div className="bg-[#0A2540] text-white border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5">
            &larr; Back to Student Portal
          </Link>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300 font-semibold uppercase tracking-wider">
            Student Search Service™
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {firstName}</span>
          <Link href="/portal/profile" className="text-slate-300 hover:text-white underline">
            Privacy Settings
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
          {/* Header */}
          <div className="space-y-3">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
              College & Scholarship Discovery
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Hi {firstName}! Welcome to the Student Search Service Portal.
            </h1>
          </div>

          {/* Core Prompt Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5">
              <Search className="w-5 h-5 text-brand-orange" />
              <h2 className="text-xl font-display font-bold text-slate-900">
                Help Colleges Find You
              </h2>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              Would you like us to share your information with nonprofit accredited colleges and universities (domestic and international), nonprofit scholarship providers, and government agencies administering educational programs so they can contact you about opportunities? Participating organizations may pay for this service, but there's no cost to you. You can opt out any time by visiting your Privacy Settings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <button
                type="button"
                onClick={() => setOptInStatus("opted_in")}
                className={`py-3.5 px-8 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  optInStatus === "opted_in"
                    ? "bg-emerald-600 text-white"
                    : "bg-[#F5A623] hover:bg-[#e09318] text-slate-950"
                }`}
              >
                {optInStatus === "opted_in" && <CheckCircle2 className="w-4 h-4 text-white" />}
                <span>Yes, definitely!</span>
              </button>

              <button
                type="button"
                onClick={() => setOptInStatus("opted_out")}
                className={`py-3.5 px-6 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                  optInStatus === "opted_out"
                    ? "bg-slate-200 text-slate-800 border-slate-300"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>No, Not Now</span>
              </button>
            </div>

            {optInStatus === "opted_in" && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1 animate-fade-in">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Your preference has been saved!
                </div>
                <div>You will now receive tailored scholarship alerts and outreach from eligible universities.</div>
              </div>
            )}

            {optInStatus === "opted_out" && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-700 space-y-1 animate-fade-in">
                <div className="font-bold">You have chosen not to participate at this time.</div>
                <div>You can change this anytime in your Account Settings & Privacy Preferences.</div>
              </div>
            )}
          </div>

          {/* Privacy & Trust Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Data Privacy & Protections
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For more information about Student Search Service™, including data we share, with whom, and on what terms, please visit the{" "}
              <Link href="/about" className="text-navy font-bold hover:text-brand-orange underline">
                Student Search page
              </Link>{" "}
              or review our{" "}
              <Link href="/about" className="text-navy font-bold hover:text-brand-orange underline">
                Privacy Policy
              </Link>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div className="text-xs font-bold text-slate-800">100% Free to Students</div>
                <p className="text-[11px] text-slate-500 leading-normal">Zero fees. Colleges connect directly to you.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <Award className="w-5 h-5 text-brand-orange" />
                <div className="text-xs font-bold text-slate-800">Accredited Only</div>
                <p className="text-[11px] text-slate-500 leading-normal">Only verified, non-profit institutions participate.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <Lock className="w-5 h-5 text-navy" />
                <div className="text-xs font-bold text-slate-800">Opt Out Anytime</div>
                <p className="text-[11px] text-slate-500 leading-normal">Full control over your data in privacy settings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
