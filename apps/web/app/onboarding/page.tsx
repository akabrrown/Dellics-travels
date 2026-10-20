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
  Phone,
  MapPin,
  Crown,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AirportCombobox } from "@/components/ui/airport-combobox";
import { CountryFlag } from "@/components/ui/country-flag";
import { useLocaleCurrency } from "@/context/locale-currency-context";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();
  const { countries } = useLocaleCurrency();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Traveler Essentials
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("GH");

  // Step 2: Flight & Stay Preferences
  const [homeAirport, setHomeAirport] = useState("ACC - Kotoka International (Accra, Ghana)");
  const [seatPreference, setSeatPreference] = useState("Window");
  const [mealPreference, setMealPreference] = useState("Standard / No Restriction");

  // Step 3: Passport & Emergency Contact
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const handleStep1Continue = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name as it appears on your passport / ID.");
      toast.error("Full name is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your WhatsApp / phone number.");
      toast.error("Phone number is required.");
      return;
    }
    if (!nationality) {
      setError("Please select your country of residence / nationality.");
      toast.error("Nationality is required.");
      return;
    }

    setError("");
    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      nationality,
      id: user?.id,
      email: user?.email,
    });
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (!homeAirport || !homeAirport.trim()) {
      setError("Please select your primary departure airport.");
      toast.error("Departure airport is required.");
      return;
    }
    if (!seatPreference) {
      setError("Please select your seating preference.");
      toast.error("Seating preference is required.");
      return;
    }
    if (!mealPreference) {
      setError("Please select your in-flight meal option.");
      toast.error("Meal option is required.");
      return;
    }

    setError("");
    updateProfile({
      homeAirport,
      seatPreference,
      mealPreference,
      id: user?.id,
      email: user?.email,
    });
    setStep(3);
  };

  const handleFinishOnboarding = async () => {
    if (!passportNumber.trim()) {
      setError("Please enter your passport number.");
      toast.error("Passport number is required.");
      return;
    }
    if (!passportExpiry) {
      setError("Please enter your passport expiry date.");
      toast.error("Passport expiry date is required.");
      return;
    }
    if (!emergencyContact.trim()) {
      setError("Please enter your emergency contact person's name.");
      toast.error("Emergency contact name is required.");
      return;
    }
    if (!emergencyPhone.trim()) {
      setError("Please enter your emergency contact phone number.");
      toast.error("Emergency contact phone is required.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await updateProfile({
        id: user?.id,
        email: user?.email,
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
        pointsBalance: 500,
      });

      toast.success("Profile updated", {
        description: "500 welcome points credited to your account.",
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
      <div className="min-h-screen bg-[#050038] flex items-center justify-center">
        <div className="size-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050038] text-white flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
        <Link href="/" className="inline-block">
          <div className="relative h-10 w-24">
            <Image
              src="/logo.jpeg"
              alt="Dellics Travels"
              fill
              className="object-contain"
              priority
              unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          </div>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? "w-6 bg-brand-orange"
                    : s < step
                      ? "w-3 bg-emerald-400"
                      : "w-3 bg-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-white/70">
            {step} of 3
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="max-w-2xl mx-auto w-full my-6">
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Required Field Missing</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Contact & Legal Name */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  Step 1 · Passenger Details (All Fields Required)
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Primary contact and passenger name
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter your name as it appears on your passport or national ID to ensure issue-free airline ticketing.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label htmlFor="input-fullname" className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name (as on ID / Passport) *
                  </label>
                  <input
                    id="input-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. Kwame Mensah"
                    required
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>

                <div>
                  <label htmlFor="input-phone" className="text-xs font-semibold text-slate-700 block mb-1">
                    WhatsApp &amp; Phone Number *
                  </label>
                  <input
                    id="input-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    placeholder="+233 55 205 4174"
                    required
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Required for flight disruption notices and WhatsApp e-ticket delivery.
                  </p>
                </div>

                <div>
                  <label htmlFor="select-nationality" className="text-xs font-semibold text-slate-700 block mb-1">
                    Country of Residence / Nationality *
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                      <CountryFlag key={nationality} countryCode={nationality} className="w-4 h-2.5 rounded-2xs" />
                    </div>
                    <select
                      id="select-nationality"
                      value={nationality}
                      required
                      onChange={(e) => {
                        const nextNat = e.target.value;
                        setNationality(nextNat);
                        setError("");
                        updateProfile({ nationality: nextNat, id: user?.id, email: user?.email });
                      }}
                      className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy cursor-pointer"
                    >
                      {countries.map((c, index) => (
                        <option key={`${c.code}-${index}`} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  onClick={handleStep1Continue}
                  className="rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Flight & Stay Preferences */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  Step 2 · Travel Preferences (All Fields Required)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Default airport and seating preferences
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We pre-fill these when booking flights with our partner airlines.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Primary Departure Airport *
                  </label>
                  <AirportCombobox
                    value={homeAirport}
                    onChange={(nextAirport) => {
                      setHomeAirport(nextAirport);
                      setError("");
                      updateProfile({ homeAirport: nextAirport, id: user?.id, email: user?.email });
                    }}
                    placeholder="Search international airport or city..."
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Search and select from live international IATA airport hubs worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label htmlFor="select-seat" className="text-xs font-semibold text-slate-700 block mb-1">
                      Seat Preference *
                    </label>
                    <select
                      id="select-seat"
                      value={seatPreference}
                      required
                      onChange={(e) => {
                        const nextSeat = e.target.value;
                        setSeatPreference(nextSeat);
                        setError("");
                        updateProfile({ seatPreference: nextSeat, id: user?.id, email: user?.email });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy cursor-pointer"
                    >
                      <option value="Window">Window Seat</option>
                      <option value="Aisle">Aisle Seat</option>
                      <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="select-meal" className="text-xs font-semibold text-slate-700 block mb-1">
                      In-Flight Meal Option *
                    </label>
                    <select
                      id="select-meal"
                      value={mealPreference}
                      required
                      onChange={(e) => {
                        const nextMeal = e.target.value;
                        setMealPreference(nextMeal);
                        setError("");
                        updateProfile({ mealPreference: nextMeal, id: user?.id, email: user?.email });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy cursor-pointer"
                    >
                      <option value="Standard / No Restriction">Standard / No Restriction</option>
                      <option value="Halal Certified">Halal Certified</option>
                      <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                      <option value="Kosher Meal">Kosher Meal</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                  className="rounded-lg text-xs font-semibold h-10 px-4 gap-1 border-slate-300"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleStep2Continue}
                  className="rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Passport & Emergency Contact */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  Step 3 · Travel Documents &amp; Emergency Contact (All Fields Required)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Passport information &amp; emergency contact
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Save your passport credentials and emergency contact details for verified passenger manifest compliance.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="input-passport" className="text-xs font-semibold text-slate-700 block mb-1">
                      Passport Number *
                    </label>
                    <input
                      id="input-passport"
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => {
                        setPassportNumber(e.target.value);
                        setError("");
                      }}
                      placeholder="e.g. G1234567"
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label htmlFor="input-expiry" className="text-xs font-semibold text-slate-700 block mb-1">
                      Passport Expiry Date *
                    </label>
                    <input
                      id="input-expiry"
                      type="date"
                      required
                      value={passportExpiry}
                      onChange={(e) => {
                        setPassportExpiry(e.target.value);
                        setError("");
                      }}
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Emergency Contact *
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="input-em-name" className="text-[11px] font-medium text-slate-600 block mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        id="input-em-name"
                        type="text"
                        required
                        value={emergencyContact}
                        onChange={(e) => {
                          setEmergencyContact(e.target.value);
                          setError("");
                        }}
                        placeholder="e.g. Next of kin / Spouse"
                        className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-em-phone" className="text-[11px] font-medium text-slate-600 block mb-1">
                        Emergency Contact Phone *
                      </label>
                      <input
                        id="input-em-phone"
                        type="tel"
                        required
                        value={emergencyPhone}
                        onChange={(e) => {
                          setEmergencyPhone(e.target.value);
                          setError("");
                        }}
                        placeholder="+233 24 000 0000"
                        className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                    </div>
                  </div>
                </div>

                {/* Loyalty Bonus Card */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Crown className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">500 Welcome Bonus Points</p>
                    <p className="text-[11px] text-slate-600">
                      Credited to your Voyager Rewards balance upon completing setup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setError("");
                    setStep(2);
                  }}
                  className="rounded-lg text-xs font-semibold h-10 px-4 gap-1 border-slate-300"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  disabled={saving}
                  onClick={handleFinishOnboarding}
                  className="rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-1.5 shadow-sm"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <span>Complete &amp; Save Profile</span>
                      <CheckCircle2 className="size-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-white/40">
        © {new Date().getFullYear()} Dellics Travels. All rights reserved.
      </div>
    </div>
  );
}
