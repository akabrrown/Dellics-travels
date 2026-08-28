"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  User,
  Plane,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  MapPin,
  FileCheck,
  Heart,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AirportCombobox } from "@/components/ui/airport-combobox";
import { toast } from "sonner";


export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Traveler Essentials
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("Ghana");

  // Step 2: Flight & Stay Preferences
  const [homeAirport, setHomeAirport] = useState("ACC - Kotoka International (Accra, Ghana)");
  const [seatPreference, setSeatPreference] = useState("Window");
  const [mealPreference, setMealPreference] = useState("Standard / No Restriction");

  // Step 3: Passport & Emergency Contact (Optional)
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      if (user.nationality) setNationality(user.nationality);
      if (user.homeAirport) setHomeAirport(user.homeAirport);
      if (user.seatPreference) setSeatPreference(user.seatPreference);
      if (user.mealPreference) setMealPreference(user.mealPreference);
      if (user.passportNumber) setPassportNumber(user.passportNumber);
      if (user.passportExpiry) setPassportExpiry(user.passportExpiry);
      if (user.emergencyContact) setEmergencyContact(user.emergencyContact);
      if (user.emergencyPhone) setEmergencyPhone(user.emergencyPhone);
    }
  }, [user]);

  const handleFinishOnboarding = async () => {
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim() || user?.fullName || "Traveler",
        phone: phone.trim() || user?.phone || "",
        nationality,
        homeAirport,
        seatPreference,
        mealPreference,
        passportNumber: passportNumber.trim(),
        passportExpiry,
        emergencyContact: emergencyContact.trim(),
        emergencyPhone: emergencyPhone.trim(),
        onboardingCompleted: true,
        pointsBalance: 500, // 500 Welcome bonus points
      });

      toast.success("Profile configured successfully!", {
        description: "You've earned 500 Welcome Bonus Voyager Points.",
      });

      router.push("/profile");
    } catch {
      router.push("/profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="size-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 size-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 bg-navy/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-20">
            <Image
              src="/Logo.png"
              alt="Dellics Travels"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-8 bg-brand-orange"
                  : s < step
                    ? "w-4 bg-emerald-500"
                    : "w-4 bg-white/20"
              }`}
            />
          ))}
          <span className="text-xs font-bold text-white/70 ml-2">Step {step} of 3</span>
        </div>
      </div>

      {/* Center Container Card */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 space-y-8 animate-in fade-in duration-300">
          
          {/* STEP 1: Traveler Essentials */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-brand-orange text-xs font-bold rounded-full border border-orange-200">
                  <User className="size-3.5" />
                  <span>Step 1: Traveler Essentials</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                  Welcome aboard! Let&apos;s set up your profile.
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Enter your legal passenger details as they appear on your government-issued ID for smooth airline booking and visa assistance.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Legal Passenger Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Primary WhatsApp & Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 55 205 4174"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">Used for instant flight gate updates and WhatsApp concierge itineraries.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Country of Residence / Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Ghana, United States, United Kingdom"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep(2)}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-md gap-2"
                >
                  <span>Continue to Preferences</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Travel Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-brand-orange text-xs font-bold rounded-full border border-orange-200">
                  <Plane className="size-3.5" />
                  <span>Step 2: Travel Preferences</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                  Customize your flying & stay experience.
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We&apos;ll automatically pre-select your preferred home airport and in-flight seat on Emirates, Qatar, Delta, and partner airlines.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Primary Home Airport</label>
                  <AirportCombobox
                    value={homeAirport}
                    onChange={setHomeAirport}
                    placeholder="Search international airport or city (e.g. Accra, London, JFK)..."
                  />
                  <p className="text-[11px] text-slate-400">Live search across global IATA international airports & departure hubs.</p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Seating Preference</label>
                    <select
                      value={seatPreference}
                      onChange={(e) => setSeatPreference(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    >
                      <option value="Window">Window Seat</option>
                      <option value="Aisle">Aisle Seat</option>
                      <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Dietary / Meal Preference</label>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    >
                      <option value="Standard / No Restriction">Standard / No Restriction</option>
                      <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                      <option value="Halal Certified">Halal Certified</option>
                      <option value="Kosher Meal">Kosher Meal</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="rounded-2xl text-xs font-bold gap-1.5"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep(3)}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-md gap-2"
                >
                  <span>Continue to Documents</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Passport & Security (Optional) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-brand-orange text-xs font-bold rounded-full border border-orange-200">
                  <ShieldCheck className="size-3.5" />
                  <span>Step 3: Document Readiness & Contact</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                  Add your passport details (Optional).
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Store your passport securely for 1-click international flight ticket issuance. You can also skip this and add it later in your Profile.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Passport Number (Optional)</label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g. G1234567"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Passport Expiry Date</label>
                    <input
                      type="date"
                      value={passportExpiry}
                      onChange={(e) => setPassportExpiry(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Emergency Contact (Optional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Contact Person Name</label>
                      <input
                        type="text"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="e.g. Parent / Spouse Name"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Emergency Phone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="+233 24 000 0000"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Voyager Welcome Reward Pill */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/60 flex items-center gap-3">
                  <Sparkles className="size-6 text-brand-orange shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-navy">500 Welcome Bonus Points</p>
                    <p className="text-[11px] text-slate-600">
                      Completing onboarding awards 500 Voyager Club points towards your next trip.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                  className="rounded-2xl text-xs font-bold gap-1.5"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  size="lg"
                  disabled={saving}
                  onClick={handleFinishOnboarding}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-lg gap-2"
                >
                  {saving ? (
                    <span>Saving Profile...</span>
                  ) : (
                    <>
                      <span>Complete & Enter Hub</span>
                      <CheckCircle2 className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Dellics Travels & Tours Ltd. · IATA Certified Agency
      </div>
    </div>
  );
}
