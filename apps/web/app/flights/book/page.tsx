"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  Calendar,
  User,
  ShieldCheck,
  Luggage,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Armchair,
  Utensils,
  Loader2,
  Lock,
  Clock,
  Check,
  Building2,
  Sparkles,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { checkoutFlightWithStripe } from "@/lib/flights";
import { CountryFlag } from "@/components/ui/country-flag";
import { toast } from "sonner";

function FlightBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Search parameters
  const rawFrom = searchParams.get("from") || "Accra (ACC)";
  const rawTo = searchParams.get("to") || "London (LHR)";
  const departDate = searchParams.get("departDate") || searchParams.get("depart") || "";
  const returnDate = searchParams.get("returnDate") || searchParams.get("return") || "";
  const tripType = searchParams.get("tripType") || "roundtrip";
  const cabinClass = searchParams.get("cabinClass") || "Economy";
  const adults = parseInt(searchParams.get("adults") || "1", 10) || 1;
  const children = parseInt(searchParams.get("children") || "0", 10) || 0;
  const totalPassengers = adults + children;

  const extractCode = (str: string, fallback: string) => {
    const match = str.match(/\(([A-Za-z]{3})\)/);
    if (match && match[1]) return match[1].toUpperCase();
    if (str.length === 3) return str.toUpperCase();
    return fallback;
  };

  const extractCity = (str: string, fallback: string) => {
    const parts = str.split("(");
    return parts[0]?.trim() || fallback;
  };

  const originCode = extractCode(rawFrom, "ACC");
  const destCode = extractCode(rawTo, "LHR");
  const originCity = extractCity(rawFrom, "Accra, Ghana");
  const destCity = extractCity(rawTo, "London, United Kingdom");

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Traveler info
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("GH");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");

  // Preferences
  const [seatPreference, setSeatPreference] = useState("Window");
  const [mealPreference, setMealPreference] = useState("Standard / No Restriction");
  const [extraBaggage, setExtraBaggage] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(true);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      if (user.fullName) {
        const parts = user.fullName.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.nationality) setNationality(user.nationality);
      if (user.passportNumber) setPassportNumber(user.passportNumber);
      if (user.passportExpiry) setPassportExpiry(user.passportExpiry);
      if (user.seatPreference) setSeatPreference(user.seatPreference);
      if (user.mealPreference) setMealPreference(user.mealPreference);
    }
  }, [user]);

  // Pricing calculations
  const baseRatePerPassenger = 850;
  const basePrice = baseRatePerPassenger * totalPassengers;
  const taxesFees = Math.round(basePrice * 0.14);
  const baggageFee = extraBaggage ? 45 * totalPassengers : 0;
  const insuranceFee = travelInsurance ? 29 * totalPassengers : 0;
  const totalPrice = basePrice + taxesFees + baggageFee + insuranceFee;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Passenger legal name is required as shown on passport/ID");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email address is required for e-ticket delivery");
      return;
    }
    if (!phone.trim()) {
      toast.error("Contact phone number is required for flight alerts");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalPayment = async () => {
    setLoading(true);
    try {
      const departureDate =
        departDate || new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0];

      const res = await checkoutFlightWithStripe({
        origin: originCode,
        destination: destCode,
        departureDate,
        returnDate: returnDate || undefined,
        airline: "IATA Certified Carrier",
        price: totalPrice,
        currency: "USD",
        email: email.trim(),
        customerName: `${title} ${firstName.trim()} ${lastName.trim()}`,
        cabinClass,
        passengerCount: totalPassengers,
      });

      if (res.url) {
        window.location.href = res.url;
        return;
      }
    } catch {
      // Fallback confirmation redirect
      window.location.href = `/flights/confirmation?origin=${encodeURIComponent(originCode)}&dest=${encodeURIComponent(destCode)}&airline=IATA%20Carrier&price=${totalPrice}&currency=USD&passenger=${encodeURIComponent(`${firstName} ${lastName}`)}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6 sm:pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-navy transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/flights" className="hover:text-navy transition-colors">
            Flights
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-navy font-bold">Secure Reservation</span>
        </nav>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200">
                <Plane className="size-3.5" />
                IATA Certified Ticketing
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Instant PNR Dispatch
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Complete Your Flight Booking
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review flight itinerary, enter traveler details, and finalize secure 256-bit checkout.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: "Passenger Details" },
              { num: 2, label: "Seat & Add-ons" },
              { num: 3, label: "Payment" },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-navy text-white shadow-xs"
                    : step > s.num
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {step > s.num ? (
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="size-4 rounded-full bg-current/15 flex items-center justify-center text-[10px]">
                    {s.num}
                  </span>
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT / MAIN COLUMN: FORM STEPS */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: TRAVELER INFORMATION */}
            {step === 1 && (
              <form
                onSubmit={handleStep1Submit}
                className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-navy text-white flex items-center justify-center">
                      <User className="size-5 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">
                        Primary Passenger Details
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Must match government-issued passport or national ID.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 1 of 3</span>
                </div>

                <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-4 text-xs text-blue-900 flex items-start gap-3">
                  <ShieldCheck className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed font-medium">
                    Ensure first and last names are spelled accurately. Airlines may charge change fees or deny boarding if name does not match travel document.
                  </p>
                </div>

                {/* Title & Names */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Title
                    </label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Dr">Dr.</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      First & Middle Names <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Kwame Kofi"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Last Name / Surname <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Mensah"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      E-Ticket Delivery Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kwame@example.com"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Phone / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 55 205 4174"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>

                {/* Nationality & Optional Passport */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Nationality
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <CountryFlag countryCode={nationality} className="w-4 h-2.5 rounded-2xs" />
                      </div>
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                      >
                        <option value="GH">Ghana (GH)</option>
                        <option value="NG">Nigeria (NG)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="US">United States (US)</option>
                        <option value="CA">Canada (CA)</option>
                        <option value="AE">UAE (AE)</option>
                        <option value="ZA">South Africa (ZA)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Passport No. (Optional)
                    </label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="G1234567"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 uppercase focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Passport Expiry
                    </label>
                    <input
                      type="date"
                      value={passportExpiry}
                      onChange={(e) => setPassportExpiry(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <Link
                    href="/flights"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Change Search</span>
                  </Link>

                  <Button
                    type="submit"
                    className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-12 px-8 gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Continue to Seat & Add-ons</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: PREFERENCES & ADD-ONS */}
            {step === 2 && (
              <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-navy text-white flex items-center justify-center">
                      <Armchair className="size-5 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">
                        Seat Selection & Travel Upgrades
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Personalize your flight preferences and baggage allowance.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 2 of 3</span>
                </div>

                {/* Seat & Meal Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-5 space-y-2 bg-slate-50/60">
                    <div className="flex items-center gap-2">
                      <Armchair className="size-4 text-brand-orange" />
                      <label className="text-xs font-bold text-navy">Seat Preference</label>
                    </div>
                    <select
                      value={seatPreference}
                      onChange={(e) => setSeatPreference(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    >
                      <option value="Window">Window Seat (Scenic View)</option>
                      <option value="Aisle">Aisle Seat (Easy Access)</option>
                      <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                    </select>
                    <p className="text-[11px] text-slate-500">Confirmed upon 24-hour airline online check-in.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5 space-y-2 bg-slate-50/60">
                    <div className="flex items-center gap-2">
                      <Utensils className="size-4 text-brand-orange" />
                      <label className="text-xs font-bold text-navy">In-Flight Dietary Meal</label>
                    </div>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    >
                      <option value="Standard / No Restriction">Standard / No Restriction</option>
                      <option value="Halal Certified">Halal Certified</option>
                      <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                      <option value="Kosher Meal">Kosher Meal</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                    <p className="text-[11px] text-slate-500">Dispatched directly to international airline catering.</p>
                  </div>
                </div>

                {/* Upgrade Options */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommended Add-ons
                  </h3>

                  <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <input
                        type="checkbox"
                        checked={extraBaggage}
                        onChange={(e) => setExtraBaggage(e.target.checked)}
                        className="size-4 rounded text-brand-orange focus:ring-brand-orange"
                      />
                      <div>
                        <span className="text-xs font-bold text-navy block">
                          Add 1x Extra 23kg Checked Bag (Per Passenger)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Save up to 40% compared to airport counter excess baggage fees.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-orange">
                      +${(45 * totalPassengers).toFixed(2)}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <input
                        type="checkbox"
                        checked={travelInsurance}
                        onChange={(e) => setTravelInsurance(e.target.checked)}
                        className="size-4 rounded text-brand-orange focus:ring-brand-orange"
                      />
                      <div>
                        <span className="text-xs font-bold text-navy block">
                          Comprehensive Flight & Medical Protection
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Includes flight delay reimbursement, lost baggage compensation, and emergency medical assistance.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-orange">
                      +${(29 * totalPassengers).toFixed(2)}
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-xl text-xs font-semibold h-11 px-5 gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back to Passenger Info</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-12 px-8 gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Review Booking & Checkout</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: FINAL REVIEW & PAYMENT */}
            {step === 3 && (
              <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-navy text-white flex items-center justify-center">
                      <CreditCard className="size-5 text-brand-orange" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">
                        Confirm Booking & Payment
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Instant e-ticket PNR generated upon successful card authorization.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 3 of 3</span>
                </div>

                {/* Summary Table */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Traveler Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Primary Passenger</span>
                      <span className="font-bold text-navy">{title} {firstName} {lastName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Contact Email</span>
                      <span className="font-bold text-navy">{email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Seat Preference</span>
                      <span className="font-bold text-navy">{seatPreference} Seat</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Dietary Meal</span>
                      <span className="font-bold text-navy">{mealPreference}</span>
                    </div>
                  </div>
                </div>

                {/* Guarantee Banner */}
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                  <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">100% Guaranteed IATA Ticketing</span>
                    <span className="text-[11px] text-emerald-800">
                      Your booking is protected with 256-bit SSL encryption. Official airline e-ticket and invoice are sent directly to your email.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={() => {
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-xl text-xs font-semibold h-11 px-5 gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </Button>

                  <Button
                    type="button"
                    disabled={loading}
                    onClick={handleFinalPayment}
                    className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm h-12 px-8 gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Opening Secure Checkout...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" />
                        <span>Pay ${totalPrice.toFixed(2)} USD</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY ITINERARY & PRICE SUMMARY */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            {/* Flight Route Card */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Plane className="size-4 text-brand-orange" />
                  <span className="font-bold text-sm text-navy">
                    IATA Certified Airline
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  {cabinClass}
                </span>
              </div>

              {/* Route Display */}
              <div className="grid grid-cols-3 items-center text-center py-1">
                <div className="text-left">
                  <span className="font-display text-2xl sm:text-3xl font-black text-navy block tracking-tight">
                    {originCode}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {originCity}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {departDate ? `Depart: ${departDate}` : "Flexible Date"}
                  </p>
                </div>

                <div className="flex flex-col items-center px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Direct
                  </span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-0.5 bg-slate-200 flex-1 rounded-full" />
                    <div className="size-6 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                      <Plane className="size-3 text-brand-orange rotate-90" />
                    </div>
                    <div className="h-0.5 bg-slate-200 flex-1 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 font-medium">
                    Scheduled
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-display text-2xl sm:text-3xl font-black text-navy block tracking-tight">
                    {destCode}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {destCity}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {returnDate ? `Return: ${returnDate}` : "One-Way / Arrival"}
                  </p>
                </div>
              </div>

              {/* Baggage Inclusions */}
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-medium bg-slate-50 px-3 py-2 rounded-xl">
                  <Luggage className="size-4 text-emerald-600 shrink-0" />
                  <span>1x 7kg Cabin Bag Included (Per Passenger)</span>
                </div>
                <div className="flex items-center gap-2 font-medium bg-slate-50 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>2x 23kg Checked Bags Included (Per Passenger)</span>
                </div>
              </div>
            </div>

            {/* Itemized Fare Breakdown Card */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3.5 shadow-sm">
              <h3 className="font-display text-base font-bold text-navy">
                Price Breakdown
              </h3>

              <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3.5">
                <div className="flex justify-between">
                  <span>Base Airfare ({totalPassengers} {totalPassengers === 1 ? "Traveler" : "Travelers"})</span>
                  <span className="font-semibold text-slate-900">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aviation Security & Airport Taxes</span>
                  <span className="font-semibold text-slate-900">${taxesFees.toFixed(2)}</span>
                </div>
                {extraBaggage && (
                  <div className="flex justify-between text-brand-orange font-semibold">
                    <span>Extra Checked Baggage (23kg)</span>
                    <span>+${baggageFee.toFixed(2)}</span>
                  </div>
                )}
                {travelInsurance && (
                  <div className="flex justify-between text-brand-orange font-semibold">
                    <span>Comprehensive Flight Protection</span>
                    <span>+${insuranceFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-display text-base font-bold text-navy">
                  Total Amount
                </span>
                <div className="text-right">
                  <span className="font-display text-2xl font-black text-brand-orange">
                    ${totalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 block">USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold">
            <Loader2 className="size-5 animate-spin text-brand-orange" />
            <span>Loading Flight Reservation...</span>
          </div>
        </div>
      }
    >
      <FlightBookingContent />
    </Suspense>
  );
}
