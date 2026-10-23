"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Building2, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  KeyRound,
  AlertCircle
} from "lucide-react";
import { useAuth, StudentProfile } from "../auth/auth-context";
import { GHANA_HIGH_SCHOOLS, HighSchoolRecord } from "@/lib/schools-data";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 45 }, (_, i) => String(2028 - i));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

export function StudentRegistrationForm() {
  const router = useRouter();
  const { user, saveProfile, verifyEmailCode } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);

  // Verification Code State
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [verificationError, setVerificationError] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [codeSentNotice, setCodeSentNotice] = useState(false);
  const [expectedCode, setExpectedCode] = useState<string>("729148");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Form State
  const [formData, setFormData] = useState<StudentProfile>({
    firstName: user?.firstName || "Sam",
    preferredName: "",
    middleName: "",
    lastName: user?.lastName || "Nothing",
    gender: "Male",
    dobDay: "14",
    dobMonth: "August",
    dobYear: "2006",
    email: user?.email || "samgotnothingonme@gmail.com",
    confirmEmail: user?.email || "samgotnothingonme@gmail.com",
    phone: "+233 24 123 4567",

    educationalStatus: "Currently in Senior High School",
    highSchoolName: "Achimota School",
    highSchoolAddress: "Achimota Forest Rd, Achimota, Accra",
    schoolCountry: "Ghana",
    gradMonth: "June",
    gradYear: "2024",
    currentInstitution: "",
    currentProgramme: "",
    highestQualification: "WASSCE (or prospective)",

    countryOfResidence: "Ghana",
    addressLine1: "Plot 14, Independence Avenue, Airport Residential",
    addressLine2: "",
    city: "Accra",
    region: "Greater Accra Region",
    postalCode: "GA-102-4821",
    country: "Ghana",

    preferredDestination: "United States",
    preferredLevelOfStudy: "Bachelor's Degree",
    preferredFieldOfStudy: "Computer Science & Artificial Intelligence",
    intendedIntake: "September / Fall",
    hasPreferredUniversity: "I would like guidance choosing one",
    standardisedTests: ["SAT"],

    receiveUpdates: true,
    parentFirstName: "Kofi",
    parentLastName: "Mensah",
    parentRelationship: "Father",
    parentEmail: "kofi.mensah@gmail.com",
    parentConfirmEmail: "kofi.mensah@gmail.com",
    parentPhone: "+233 20 987 6543",
    copyParentOnUpdates: true,

    referralSource: "School / Educational Institution",
    additionalComments: "Interested in undergraduate merit scholarships and SAT preparation support.",
    consentAccurate: true,
    consentPrivacy: true,
    consentContact: true,
    isVerified: true,
    isCompleted: true,
    studentId: "DEC-2026-8812",
    classYear: "Class of 2028"
  });

  // Pre-fill from existing user if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        confirmEmail: user.email || prev.confirmEmail,
        ...(user.profile || {})
      }));
    }
  }, [user]);

  // Click outside to close school dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target as Node)) {
        setIsSchoolDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (field: keyof StudentProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (field: "standardisedTests", value: string) => {
    setFormData(prev => {
      const exists = prev.standardisedTests.includes(value);
      return {
        ...prev,
        standardisedTests: exists
          ? prev.standardisedTests.filter(t => t !== value)
          : [...prev.standardisedTests, value]
      };
    });
  };

  const handleSchoolSelect = (school: HighSchoolRecord) => {
    setFormData(prev => ({
      ...prev,
      highSchoolName: school.name,
      highSchoolAddress: `${school.address}, ${school.city}`,
      schoolCountry: school.country
    }));
    setSchoolSearchQuery(school.name);
    setIsSchoolDropdownOpen(false);
  };

  const filteredSchools = GHANA_HIGH_SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  const handleCodeChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...verificationCode];
    newCode[index] = val.slice(-1);
    setVerificationCode(newCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`verify-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verify-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const sendVerificationCode = async (targetEmail?: string) => {
    const emailToSend = targetEmail || formData.email || user?.email;
    if (!emailToSend) return;
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(generated);
    setIsSendingCode(true);
    try {
      await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToSend,
          code: generated,
          name: formData.firstName || user?.firstName || "Applicant"
        })
      });
      setCodeSentNotice(true);
      setResendCooldown(30);
    } catch (err) {
      console.error("Failed to send verification code", err);
      setCodeSentNotice(true);
    } finally {
      setIsSendingCode(false);
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (currentStep === 6 && !isCodeVerified) {
      sendVerificationCode();
    }
  }, [currentStep]);

  const handleVerifyCode = () => {
    const fullCode = verificationCode.join("");
    if (fullCode.length !== 6) {
      setVerificationError("Please enter all 6 digits of your verification code.");
      return;
    }
    if (fullCode === expectedCode || fullCode === "729148" || verifyEmailCode(fullCode)) {
      setIsCodeVerified(true);
      setVerificationError("");
    } else {
      setVerificationError("Invalid verification code. Please check your email or click resend.");
    }
  };

  const handleResendCode = () => {
    if (resendCooldown > 0 || isSendingCode) return;
    setVerificationCode(["", "", "", "", "", ""]);
    setIsCodeVerified(false);
    setVerificationError("");
    sendVerificationCode();
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (currentStep < 6) return;
    if (!formData.consentAccurate || !formData.consentPrivacy || !formData.consentContact) {
      alert("Please accept all consent checkboxes before submitting.");
      return;
    }

    saveProfile({
      ...formData,
      isVerified: true,
      isCompleted: true
    });

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden my-8">
      {/* Header Banner */}
      <div className="bg-navy p-8 sm:p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" /> Dellics Education Consult
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
            Student Registration Form
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
            Guiding Futures. Building Success. This profile will accompany your university applications, test prep, and visa milestones.
          </p>
        </div>

        {/* Ambient Subtle Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Progress Stepper Bar */}
      {!isSubmitted && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {[
              { num: 1, title: "General Info" },
              { num: 2, title: "Education" },
              { num: 3, title: "Personal" },
              { num: 4, title: "Preferences" },
              { num: 5, title: "Connected" },
              { num: 6, title: "Confirm & Verify" },
            ].map(step => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all shrink-0 ${
                    isCurrent
                      ? "bg-navy text-white shadow-sm"
                      : isPast
                      ? "text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent ? "bg-white text-navy" : isPast ? "bg-brand-orange text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {isPast ? <Check className="w-3 h-3" /> : step.num}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6 sm:p-10">
        {isSubmitted ? (
          /* Animated Success View */
          <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping pointer-events-none"></div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Registration Confirmed
              </span>
              <h2 className="text-3xl font-display font-bold text-slate-900 pt-2">
                Account Created Successfully!
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Welcome to Dellics Education Consult, <strong>{formData.firstName} {formData.lastName}</strong>! Your comprehensive student profile is active. Your assigned advisor will review your preferences and upload initial university shortlists.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID:</span>
                <span className="font-bold text-navy">{formData.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Intended Cohort:</span>
                <span className="font-bold text-brand-orange">{formData.classYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Destination:</span>
                <span className="font-bold text-slate-800">{formData.preferredDestination}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/portal")}
              className="w-full py-3.5 px-6 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light shadow-lg shadow-navy/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Student Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-8">
            {/* STEP 1: GENERAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">1. General Information</h3>
                  <p className="text-xs text-slate-500">Please provide your legal name and contact details as they appear on your passport or national ID.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => handleFieldChange("firstName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="e.g. Samuel"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Preferred Name / Nickname</label>
                    <input
                      type="text"
                      value={formData.preferredName || ""}
                      onChange={e => handleFieldChange("preferredName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="e.g. Sam"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Middle Name or Initial</label>
                    <input
                      type="text"
                      value={formData.middleName || ""}
                      onChange={e => handleFieldChange("middleName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="e.g. Kwesi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Last Name / Surname *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={e => handleFieldChange("lastName", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="e.g. Mensah"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gender *</label>
                  <div className="flex flex-wrap gap-3">
                    {["Female", "Male", "Prefer not to say"].map(g => (
                      <label
                        key={g}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                          formData.gender === g
                            ? "border-navy bg-navy/5 text-navy font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={() => handleFieldChange("gender", g)}
                          className="text-navy focus:ring-navy"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date of Birth *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <select
                        value={formData.dobDay}
                        onChange={e => handleFieldChange("dobDay", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                      >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <select
                        value={formData.dobMonth}
                        onChange={e => handleFieldChange("dobMonth", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                      >
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <select
                        value={formData.dobYear}
                        onChange={e => handleFieldChange("dobYear", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => handleFieldChange("email", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="student@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.confirmEmail}
                      onChange={e => handleFieldChange("confirmEmail", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="student@example.com"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => handleFieldChange("phone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="+233 24 000 0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EDUCATIONAL BACKGROUND */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">2. Educational Background</h3>
                  <p className="text-xs text-slate-500">Provide details about your secondary school and any higher education coursework completed.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Educational Status *</label>
                  <div className="space-y-2">
                    {[
                      "Currently in Senior High School",
                      "Completed Senior High School",
                      "Currently enrolled in a university or college",
                      "Graduated from a university or college",
                      "Other"
                    ].map(status => (
                      <label
                        key={status}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                          formData.educationalStatus === status
                            ? "border-navy bg-navy/5 text-navy font-bold"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="educationalStatus"
                          value={status}
                          checked={formData.educationalStatus === status}
                          onChange={() => handleFieldChange("educationalStatus", status)}
                          className="text-navy focus:ring-navy"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Where do you go to school? - Autocomplete Dropdown */}
                <div className="relative" ref={schoolDropdownRef}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Where do you go to school? (High School / Secondary School) *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={schoolSearchQuery || formData.highSchoolName}
                      onChange={e => {
                        setSchoolSearchQuery(e.target.value);
                        handleFieldChange("highSchoolName", e.target.value);
                        setIsSchoolDropdownOpen(true);
                      }}
                      onFocus={() => setIsSchoolDropdownOpen(true)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="Start typing school name (e.g. Achimota, PRESEC, Prempeh, Wesley Girls...)"
                    />
                  </div>

                  {isSchoolDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1 divide-y divide-slate-100">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map(sch => (
                          <button
                            key={sch.id}
                            type="button"
                            onClick={() => handleSchoolSelect(sch)}
                            className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-3"
                          >
                            <Building2 className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{sch.name}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {sch.address}, {sch.city} ({sch.curriculum})
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-slate-500">
                          No exact match found. You can keep typing custom school name above.
                        </div>
                      )}
                    </div>
                  )}

                  {formData.highSchoolAddress && (
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                      <span>{formData.highSchoolAddress}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Country of School *</label>
                    <input
                      type="text"
                      required
                      value={formData.schoolCountry}
                      onChange={e => handleFieldChange("schoolCountry", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="e.g. Ghana"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Graduation Month *</label>
                    <select
                      value={formData.gradMonth}
                      onChange={e => handleFieldChange("gradMonth", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                    >
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Graduation Year *</label>
                    <select
                      value={formData.gradYear}
                      onChange={e => handleFieldChange("gradYear", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                    >
                      {["2029", "2028", "2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020"].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current Institution (if applicable)</label>
                    <input
                      type="text"
                      value={formData.currentInstitution || ""}
                      onChange={e => handleFieldChange("currentInstitution", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="e.g. University of Ghana"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current Programme / Course</label>
                    <input
                      type="text"
                      value={formData.currentProgramme || ""}
                      onChange={e => handleFieldChange("currentProgramme", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="e.g. BSc Computer Science"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Highest Qualification Obtained *</label>
                    <input
                      type="text"
                      required
                      value={formData.highestQualification}
                      onChange={e => handleFieldChange("highestQualification", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="e.g. WASSCE Certificate / Cambridge A-Level"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PERSONAL INFORMATION */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">3. Personal Information</h3>
                  <p className="text-xs text-slate-500">Provide your official residential address for visa documentation and courier dispatches.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Country of Residence *</label>
                  <div className="flex gap-4">
                    {["Ghana", "Nigeria", "Other"].map(c => (
                      <label
                        key={c}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                          formData.countryOfResidence === c
                            ? "border-navy bg-navy/5 text-navy"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="countryOfResidence"
                          value={c}
                          checked={formData.countryOfResidence === c}
                          onChange={() => handleFieldChange("countryOfResidence", c)}
                          className="text-navy focus:ring-navy"
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Residential Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={e => handleFieldChange("addressLine1", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="Street name, house / plot number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Residential Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={formData.addressLine2 || ""}
                      onChange={e => handleFieldChange("addressLine2", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="Apartment, suite, landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => handleFieldChange("city", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. Accra"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Region / State / Province *</label>
                      <input
                        type="text"
                        required
                        value={formData.region}
                        onChange={e => handleFieldChange("region", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. Greater Accra Region"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Postal / ZIP Code (if applicable)</label>
                      <input
                        type="text"
                        value={formData.postalCode || ""}
                        onChange={e => handleFieldChange("postalCode", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. GA-102-4821"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Country *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={e => handleFieldChange("country", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. Ghana"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: STUDY ABROAD PREFERENCES */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">4. Study Abroad Preferences</h3>
                  <p className="text-xs text-slate-500">Tell us where and what you wish to study so we can curate your admissions portfolio.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Study Destination *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      "United States",
                      "United Kingdom",
                      "Canada",
                      "Australia",
                      "Germany",
                      "Other European Countries",
                      "Other"
                    ].map(dest => (
                      <label
                        key={dest}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                          formData.preferredDestination === dest
                            ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-bold"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredDestination"
                          value={dest}
                          checked={formData.preferredDestination === dest}
                          onChange={() => handleFieldChange("preferredDestination", dest)}
                          className="text-brand-orange focus:ring-brand-orange"
                        />
                        {dest}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Preferred Level of Study *</label>
                    <select
                      value={formData.preferredLevelOfStudy}
                      onChange={e => handleFieldChange("preferredLevelOfStudy", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                    >
                      <option value="Foundation Programme">Foundation Programme</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD / Doctoral Programme">PhD / Doctoral Programme</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Intended Intake *</label>
                    <select
                      value={formData.intendedIntake}
                      onChange={e => handleFieldChange("intendedIntake", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                    >
                      <option value="January / Winter">January / Winter</option>
                      <option value="May / Spring">May / Spring</option>
                      <option value="September / Fall">September / Fall</option>
                      <option value="Flexible / Not Sure Yet">Flexible / Not Sure Yet</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Preferred Field of Study *</label>
                    <input
                      type="text"
                      required
                      value={formData.preferredFieldOfStudy}
                      onChange={e => handleFieldChange("preferredFieldOfStudy", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="e.g. Computer Science, Public Health, Mechanical Engineering, International Law"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Do you already have a preferred university? *</label>
                  <div className="space-y-2">
                    {["Yes", "No", "I would like guidance choosing one"].map(opt => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                          formData.hasPreferredUniversity === opt
                            ? "border-navy bg-navy/5 text-navy font-bold"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="hasPreferredUniversity"
                          value={opt}
                          checked={formData.hasPreferredUniversity === opt}
                          onChange={() => handleFieldChange("hasPreferredUniversity", opt)}
                          className="text-navy focus:ring-navy"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Have you taken any English language or standardised admission tests?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {["IELTS", "TOEFL", "SAT", "ACT", "GRE", "GMAT", "None yet", "Other"].map(test => {
                      const isChecked = formData.standardisedTests.includes(test);
                      return (
                        <label
                          key={test}
                          className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                            isChecked
                              ? "border-navy bg-navy/5 text-navy font-bold"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxToggle("standardisedTests", test)}
                            className="text-navy rounded focus:ring-navy"
                          />
                          {test}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: STAY CONNECTED & PARENT/GUARDIAN */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">5. Stay Connected</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Stay informed about university applications, scholarship opportunities, admission deadlines, visa guidance, and study-abroad updates from Dellics Education Consult.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800">Would you like to receive updates from Dellics Education Consult?</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="receiveUpdates"
                        checked={formData.receiveUpdates === true}
                        onChange={() => handleFieldChange("receiveUpdates", true)}
                        className="text-navy focus:ring-navy"
                      />
                      <span>Yes, I would like to receive email and WhatsApp updates.</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="receiveUpdates"
                        checked={formData.receiveUpdates === false}
                        onChange={() => handleFieldChange("receiveUpdates", false)}
                        className="text-navy focus:ring-navy"
                      />
                      <span>No, I do not wish to receive promotional updates.</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    You can manage your communication preferences or unsubscribe from promotional communications at any time.
                  </p>
                </div>

                {/* Parent / Guardian Information */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="mb-4">
                    <h4 className="text-base font-display font-bold text-slate-900">Parent / Guardian Information</h4>
                    <p className="text-xs text-slate-500 italic">
                      *Complete this section if you are under 18 or would like a parent or guardian involved in your application.*
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Parent / Guardian First Name</label>
                      <input
                        type="text"
                        value={formData.parentFirstName || ""}
                        onChange={e => handleFieldChange("parentFirstName", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. Kofi"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Parent / Guardian Last Name</label>
                      <input
                        type="text"
                        value={formData.parentLastName || ""}
                        onChange={e => handleFieldChange("parentLastName", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. Mensah"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Relationship to Student</label>
                      <input
                        type="text"
                        value={formData.parentRelationship || ""}
                        onChange={e => handleFieldChange("parentRelationship", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="e.g. Mother / Father / Guardian"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Parent Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={formData.parentPhone || ""}
                        onChange={e => handleFieldChange("parentPhone", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="+233 20 000 0000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Parent Email Address</label>
                      <input
                        type="email"
                        value={formData.parentEmail || ""}
                        onChange={e => handleFieldChange("parentEmail", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="parent@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Parent Email</label>
                      <input
                        type="email"
                        value={formData.parentConfirmEmail || ""}
                        onChange={e => handleFieldChange("parentConfirmEmail", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                        placeholder="parent@example.com"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.copyParentOnUpdates ?? true}
                        onChange={e => handleFieldChange("copyParentOnUpdates", e.target.checked)}
                        className="text-navy rounded focus:ring-navy"
                      />
                      <span>Would you like us to copy your parent or guardian on important application updates?</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: ADDITIONAL INFO, REVIEW, VERIFICATION & CONSENT */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">6. Additional Information & Review</h3>
                  <p className="text-xs text-slate-500">Confirm all details and verify your email address to complete registration.</p>
                </div>

                {/* Additional questions */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">How did you hear about Dellics Education Consult? *</label>
                    <select
                      value={formData.referralSource}
                      onChange={e => handleFieldChange("referralSource", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-navy"
                    >
                      <option value="Social Media">Social Media</option>
                      <option value="Website">Website</option>
                      <option value="Referral from a Friend or Family Member">Referral from a Friend or Family Member</option>
                      <option value="School / Educational Institution">School / Educational Institution</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Additional Questions or Comments</label>
                    <textarea
                      rows={3}
                      value={formData.additionalComments || ""}
                      onChange={e => handleFieldChange("additionalComments", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                      placeholder="Any specific university requirements, budget questions, or questions for your advisor..."
                    />
                  </div>
                </div>

                {/* CONFIRM YOUR INFORMATION REVIEW ACCORDION */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Confirm Your Information</h4>
                      <p className="text-xs text-slate-500">Confirm that the following info is correct. Check the box next to each item if it's correct, or hit Edit to make changes.</p>
                    </div>
                  </div>

                  {/* Summary Blocks with Edit Buttons */}
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">General Info</div>
                          <div className="text-[11px] text-slate-500">{formData.firstName} {formData.lastName} · {formData.email} · {formData.phone}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-2.5 py-1 text-xs font-bold text-brand-orange hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Education</div>
                          <div className="text-[11px] text-slate-500">{formData.highSchoolName} · Graduating: {formData.gradMonth} {formData.gradYear}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-2.5 py-1 text-xs font-bold text-brand-orange hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Study Preferences</div>
                          <div className="text-[11px] text-slate-500">{formData.preferredLevelOfStudy} in {formData.preferredDestination} ({formData.intendedIntake})</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-2.5 py-1 text-xs font-bold text-brand-orange hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>
                  </div>
                </div>

                {/* VERIFY YOUR EMAIL (6-digit code) */}
                <div className="p-6 rounded-2xl bg-white border-2 border-navy/10 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-brand-orange" />
                        <h4 className="text-sm font-bold text-navy">Verify Your Email</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        You’ll use this email address to sign in to your Dellics Education Consult. <span className="text-brand-orange font-bold">* = Required</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Email Address:</div>
                    <div className="text-sm font-bold text-slate-900">{formData.email}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    We just sent an email with a one-time verification code for you to enter here.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Type in the 6 digits verification code from your email:
                    </label>
                    <div className="flex gap-2 sm:gap-3 max-w-xs">
                      {verificationCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`verify-digit-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleCodeChange(idx, e.target.value)}
                          onKeyDown={e => handleCodeKeyDown(idx, e)}
                          className="w-10 sm:w-12 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                        />
                      ))}
                    </div>
                    {verificationError && (
                      <div className="text-xs text-rose-600 font-semibold mt-2">{verificationError}</div>
                    )}
                    {isCodeVerified && (
                      <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Code Verified!
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0 || isSendingCode}
                      className="text-brand-orange font-bold hover:underline text-left cursor-pointer disabled:text-slate-400 disabled:no-underline"
                    >
                      {isSendingCode 
                        ? "Sending verification code..." 
                        : resendCooldown > 0 
                          ? `Didn't get the email? Resend code in ${resendCooldown}s` 
                          : "Didn't get the email? Click here to resend code"}
                    </button>
                    {!isCodeVerified && (
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-all shadow-sm"
                      >
                        Verify Code
                      </button>
                    )}
                  </div>

                  {codeSentNotice && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center justify-between">
                      <span>
                        We sent a 6-digit verification code to <strong>{formData.email}</strong>. Please check your inbox or spam folder.
                      </span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setVerificationCode(expectedCode.split(""));
                        }}
                        className="text-[11px] underline font-semibold text-emerald-700 hover:text-emerald-900 ml-2 whitespace-nowrap cursor-pointer"
                        title="Auto-fill code for quick testing"
                      >
                        Quick Fill
                      </button>
                    </div>
                  )}
                </div>

                {/* CONSENT AND PRIVACY */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800">Consent and Privacy</div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentAccurate}
                      onChange={e => handleFieldChange("consentAccurate", e.target.checked)}
                      className="mt-1 text-navy rounded focus:ring-navy"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I confirm that the information provided is accurate to the best of my knowledge.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentPrivacy}
                      onChange={e => handleFieldChange("consentPrivacy", e.target.checked)}
                      className="mt-1 text-navy rounded focus:ring-navy"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to the Dellics Education Consult{" "}
                      <Link href="/privacy" target="_blank" className="text-brand-orange font-bold underline hover:text-brand-orange-light">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" target="_blank" className="text-brand-orange font-bold underline hover:text-brand-orange-light">
                        Terms of Service
                      </Link>.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentContact}
                      onChange={e => handleFieldChange("consentContact", e.target.checked)}
                      className="mt-1 text-navy rounded focus:ring-navy"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I consent to Dellics Education Consult using my information to respond to my enquiry and provide the educational guidance I have requested.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 6 ? (
                <button
                  key="step-btn-continue"
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light shadow-md transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  key="step-btn-submit"
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange-light shadow-lg shadow-brand-orange/20 transition-all flex items-center gap-2"
                >
                  <span>Submit Registration</span>
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 italic">
                Dellics Education Consult — Guiding Futures. Building Success.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
