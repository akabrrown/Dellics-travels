"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  User, 
  Lock, 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Search, 
  Check, 
  Edit3,
  BookOpen,
  Award,
  Compass
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function StudentProfilePage() {
  const { user, saveProfile } = useAuth();
  const profile = user?.profile;

  const firstName = user?.firstName || profile?.firstName || "Sam";
  const lastName = user?.lastName || profile?.lastName || "Nothing";
  const email = user?.email || profile?.email || "samgotnothingonme@gmail.com";
  const highSchool = profile?.highSchoolName || "Achimota School";
  const classYear = profile?.classYear || "Class of 2028";
  const consultId = profile?.studentId || "DEC-2026-8812";

  const [activeTab, setActiveTab] = useState<"info" | "subscriptions" | "privacy">("info");
  const [isMfaActive, setIsMfaActive] = useState(false);
  const [securityPhrase, setSecurityPhrase] = useState("Cape Coast Horizon 2026");
  const [nickname, setNickname] = useState(profile?.preferredName || "__");

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* College Board Global Top Bar */}
      <div className="bg-[#0A2540] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5">
            &larr; Back to Student Portal
          </Link>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-slate-300 font-semibold uppercase tracking-wider">
            The College Board & Dellics Consult
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {firstName}</span>
          <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-[11px]">
            {firstName.charAt(0)}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center text-2xl font-bold font-display shadow-md">
                {firstName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Welcome,</span>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  {firstName} {lastName}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-xs text-brand-orange font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>{classYear}</span>
                </div>
              </div>
            </div>

            <Link
              href="/portal/onboarding"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 self-start sm:self-auto transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Full Registration Form</span>
            </Link>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-200 mt-6 pt-2">
            {[
              { id: "info", label: "My Info" },
              { id: "subscriptions", label: "Subscriptions" },
              { id: "privacy", label: "Privacy Settings" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-navy text-navy font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="text-xs text-slate-500 italic">* = Required information</div>

            {/* 1. Personal Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-orange" /> Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Legal Name *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{firstName} {lastName}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Nickname</div>
                  <div className="text-sm text-slate-700 mt-0.5">{nickname}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Date of Birth *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {profile?.dobDay || "14"} {profile?.dobMonth || "August"} {profile?.dobYear || "2006"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Gender *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{profile?.gender || "Male"}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-slate-500 font-medium">Address *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {profile?.addressLine1 || "Plot 14, Independence Avenue, Airport Residential"}, {profile?.city || "Accra"}, {profile?.country || "Ghana"}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Security and Password */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-orange" /> Security and Password
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Email Address *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{email}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Password *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">••••••••••••</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Multi-Factor Authentication (MFA) *</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isMfaActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {isMfaActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMfaActive(!isMfaActive)}
                      className="text-xs text-brand-orange font-bold hover:underline"
                    >
                      {isMfaActive ? "Turn Off" : "Enable MFA"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Security Phrase *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{securityPhrase}</div>
                </div>
              </div>
            </div>

            {/* 3. School Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-orange" /> School Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Where do you go to school? *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{highSchool}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{profile?.highSchoolAddress || "Achimota Forest Rd, Accra, Ghana"}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">High School Graduation (or equivalent) *</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {profile?.gradMonth || "June"} {profile?.gradYear || "2024"}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. IDs */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Official IDs
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">AP ID</div>
                  <div className="text-sm font-mono text-slate-700 mt-0.5">AP-9921-GH</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Dellics Education Consult ID</div>
                  <div className="text-sm font-mono font-bold text-navy mt-0.5">{consultId}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Services for Students with Disabilities (SSD) Number</div>
                  <div className="text-sm text-slate-700 mt-0.5">__</div>
                </div>
              </div>
            </div>

            {/* 5. Parent Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Parent Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Parent / Guardian</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {profile?.parentFirstName || "Kofi"} {profile?.parentLastName || "Mensah"}
                  </div>
                  <div className="text-[11px] text-slate-400">{profile?.parentRelationship || "Father"}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Email</div>
                  <div className="text-sm text-slate-700 mt-0.5">{profile?.parentEmail || "kofi.mensah@gmail.com"}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Phone</div>
                  <div className="text-sm text-slate-700 mt-0.5">{profile?.parentPhone || "+233 20 987 6543"}</div>
                </div>
              </div>
            </div>

            {/* 6. My Content College Board Ecosystem Links */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                My Content
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {/* SAT */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-navy text-sm">SAT</div>
                  <Link href="/portal/sat" className="block text-slate-600 hover:text-brand-orange">
                    SAT, PSAT/NMSQT, PSAT 10, and PSAT 8/9 Scores
                  </Link>
                </div>

                {/* AP */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-navy text-sm">AP</div>
                  <Link href="/portal/ap-classroom" className="block text-slate-600 hover:text-brand-orange">
                    AP Portfolio & My AP Classroom
                  </Link>
                </div>

                {/* My Colleges */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-navy text-sm">My Colleges</div>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div>CSS Profile</div>
                    <div>Disability Accommodations</div>
                    <div>IDOC Documents</div>
                    <div>BigFuture Scholarships</div>
                    <div>CLEP & ACCUPLACER</div>
                  </div>
                </div>

                {/* BigFuture */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-navy text-sm">BigFuture</div>
                  <Link href="/portal/bigfuture" className="block text-slate-600 hover:text-brand-orange">
                    College Search & Career Quiz
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Email & WhatsApp Subscriptions</h2>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <input type="checkbox" defaultChecked className="rounded text-navy focus:ring-navy" />
                <span className="font-semibold text-slate-800">Dellics Consult University Placements & Scholarship Deadlines</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <input type="checkbox" defaultChecked className="rounded text-navy focus:ring-navy" />
                <span className="font-semibold text-slate-800">College Board SAT Question of the Day & Registration Reminders</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <input type="checkbox" defaultChecked className="rounded text-navy focus:ring-navy" />
                <span className="font-semibold text-slate-800">Student Search Service University Connections</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Privacy & Data Sharing Settings</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Control which participating non-profit institutions and universities can contact you through Dellics Consult and Student Search Service™.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">Student Search Service™ Participation</div>
                <div className="text-slate-500">Allow verified universities to send you admission opportunities.</div>
              </div>
              <Link href="/portal/student-search" className="text-brand-orange font-bold hover:underline">
                Manage Preferences &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
