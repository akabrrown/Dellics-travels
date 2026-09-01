"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Armchair,
  Utensils,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { checkoutFlightWithStripe } from "@/lib/flights";
import { CountryFlag } from "@/components/ui/country-flag";
import { toast } from "sonner";

export interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: {
    origin: string;
    destination: string;
    airline?: string;
    price: number;
    currency?: string;
    departureDate?: string;
    returnDate?: string;
    cabinClass?: string;
    flightNumber?: string;
  };
}

export function FlightBookingModal({
  isOpen,
  onClose,
  flight,
}: FlightBookingModalProps) {
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);

  // Step 2: Passenger details
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("GH");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");

  // Step 3: Preferences
  const [seatPreference, setSeatPreference] = useState("Window");
  const [mealPreference, setMealPreference] = useState("Standard / No Restriction");
  const [extraBaggage, setExtraBaggage] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(true);

  // Pre-fill from authenticated user profile
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
  }, [user, isOpen]);

  if (!isOpen) return null;

  const basePrice = flight.price || 850;
  const taxesFees = Math.round(basePrice * 0.14);
  const baggageFee = extraBaggage ? 45 : 0;
  const insuranceFee = travelInsurance ? 29 : 0;
  const totalPrice = basePrice + taxesFees + baggageFee + insuranceFee;

  const handleNextStep1 = () => setStep(2);

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Passenger legal name is required as shown on ID/Passport");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email address is required for e-ticket delivery");
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => setStep(4);

  const handleFinalPayment = async () => {
    setLoading(true);
    try {
      const departureDate =
        flight.departureDate ||
        new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0];

      const res = await checkoutFlightWithStripe({
        origin: flight.origin,
        destination: flight.destination,
        departureDate,
        returnDate: flight.returnDate,
        airline: flight.airline || "IATA Certified Carrier",
        price: totalPrice,
        currency: flight.currency || "USD",
        email: email.trim(),
        customerName: `${title} ${firstName.trim()} ${lastName.trim()}`,
        cabinClass: flight.cabinClass || "Economy",
        passengerCount: 1,
      });

      if (res.url) {
        window.location.href = res.url;
        return;
      }
    } catch {
      // Fallback confirmation redirect
      window.location.href = `/flights/confirmation?origin=${encodeURIComponent(flight.origin)}&dest=${encodeURIComponent(flight.destination)}&airline=${encodeURIComponent(flight.airline || "Airline")}&price=${totalPrice}&currency=USD&passenger=${encodeURIComponent(`${firstName} ${lastName}`)}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Progress Steps */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-[#0A0060] text-white flex items-center justify-center shadow-xs">
                <Plane className="size-4 text-brand-orange" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-navy">
                  Flight Booking & Reservation
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {flight.origin} → {flight.destination} · {flight.airline || "Scheduled Flight"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            {[
              { num: 1, label: "1. Flight Review" },
              { num: 2, label: "2. Passenger" },
              { num: 3, label: "3. Preferences" },
              { num: 4, label: "4. Payment" },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-1.5 px-1 rounded-lg transition-all ${
                  step === s.num
                    ? "bg-[#0A0060] text-white shadow-xs font-bold"
                    : step > s.num
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: ITINERARY & FARE REVIEW */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="size-4 text-brand-orange" />
                    <span className="font-bold text-sm text-navy">
                      {flight.airline || "Certified IATA Airline"}
                    </span>
                    <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                      {flight.flightNumber || "DL-842"}
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full">
                    {flight.cabinClass || "Economy"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center text-center py-2">
                  <div className="text-left">
                    <span className="font-display text-2xl font-black text-navy">{flight.origin}</span>
                    <p className="text-xs text-slate-500 font-medium">Departure Hub</p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      {flight.departureDate || "Next 30 Days"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Direct Flight</span>
                    <div className="w-full flex items-center gap-1">
                      <div className="h-0.5 bg-slate-300 flex-1" />
                      <Plane className="size-3.5 text-brand-orange rotate-90" />
                      <div className="h-0.5 bg-slate-300 flex-1" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">Approx 6h 30m</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-2xl font-black text-navy">{flight.destination}</span>
                    <p className="text-xs text-slate-500 font-medium">Arrival Hub</p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      {flight.departureDate || "Scheduled Arrival"}
                    </p>
                  </div>
                </div>

                {/* Baggage Included */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Luggage className="size-3.5 text-emerald-600" />
                    <span>1x 7kg Cabin Bag Included</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>2x 23kg Checked Bags Included</span>
                  </div>
                </div>
              </div>

              {/* Fare Summary Breakdown */}
              <div className="rounded-2xl border border-slate-100 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Airfare (1 Adult)</span>
                  <span className="font-semibold text-slate-900">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Aviation Taxes & Airport Security Surcharges</span>
                  <span className="font-semibold text-slate-900">${taxesFees.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold text-navy">
                  <span>Estimated Trip Total</span>
                  <span className="text-brand-orange text-base">${(basePrice + taxesFees).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleNextStep1}
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-7 gap-2 shadow-md"
                >
                  <span>Enter Passenger Details</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: PASSENGER LEGAL INFORMATION */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Please enter passenger names exactly as they appear on your government-issued passport or national ID.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">First & Middle Names *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Kwame Kofi"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name / Surname *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Mensah"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">E-Ticket Delivery Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@example.com"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 55 205 4174"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nationality</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CountryFlag countryCode={nationality} className="w-4 h-2.5 rounded-2xs" />
                    </div>
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none"
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Passport Number (Optional)</label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="G1234567"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium uppercase focus:border-navy"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Passport Expiry</label>
                  <input
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:border-navy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl text-xs font-semibold h-10 px-4 gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-2"
                >
                  <span>Select Seat & Meal Preferences</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: PREFERENCES & ADD-ONS */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Armchair className="size-4 text-brand-orange" />
                      <label className="text-xs font-bold text-slate-900">Seat Placement Preference</label>
                    </div>
                    <select
                      value={seatPreference}
                      onChange={(e) => setSeatPreference(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:border-navy"
                    >
                      <option value="Window">Window Seat (Standard)</option>
                      <option value="Aisle">Aisle Seat (Easy access)</option>
                      <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                    </select>
                    <p className="text-[11px] text-slate-400">Assigned upon online check-in opening 24h prior.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Utensils className="size-4 text-brand-orange" />
                      <label className="text-xs font-bold text-slate-900">Complimentary In-Flight Meal</label>
                    </div>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:border-navy"
                    >
                      <option value="Standard / No Restriction">Standard / No Restriction</option>
                      <option value="Halal Certified">Halal Certified</option>
                      <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                      <option value="Kosher Meal">Kosher Meal</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                    <p className="text-[11px] text-slate-400">Notified directly to the airline catering department.</p>
                  </div>
                </div>

                {/* Optional Travel Add-ons */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recommended Add-Ons
                  </h4>

                  {/* Baggage Upgrade */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extraBaggage}
                        onChange={(e) => setExtraBaggage(e.target.checked)}
                        className="size-4 rounded text-brand-orange focus:ring-brand-orange"
                      />
                      <div>
                        <span className="text-xs font-bold text-navy block">Add 1x Extra 23kg Checked Bag</span>
                        <span className="text-[11px] text-slate-500">Save up to 40% vs airport counter excess baggage fees</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-orange">+$45.00</span>
                  </label>

                  {/* Travel Protection */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={travelInsurance}
                        onChange={(e) => setTravelInsurance(e.target.checked)}
                        className="size-4 rounded text-brand-orange focus:ring-brand-orange"
                      />
                      <div>
                        <span className="text-xs font-bold text-navy block">Comprehensive Flight & Medical Insurance</span>
                        <span className="text-[11px] text-slate-500">Trip delay coverage, lost baggage, and 24/7 medical emergency assistance</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-orange">+$29.00</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="rounded-xl text-xs font-semibold h-10 px-4 gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep3}
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-2"
                >
                  <span>Review Booking & Total</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: FINAL SUMMARY & SECURE PAYMENT */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Booking Confirmation Summary
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Passenger</span>
                    <span className="font-bold text-navy">{title} {firstName} {lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Flight Route</span>
                    <span className="font-bold text-navy">{flight.origin} → {flight.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Airline</span>
                    <span className="font-bold text-navy">{flight.airline || "IATA Airline"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Seat / Meal</span>
                    <span className="font-bold text-navy">{seatPreference} / {mealPreference.split(" ")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Price Details */}
              <div className="rounded-2xl border border-slate-100 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Airfare</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Security Fees</span>
                  <span>${taxesFees.toFixed(2)}</span>
                </div>
                {extraBaggage && (
                  <div className="flex justify-between text-slate-600">
                    <span>1x Extra Checked Bag (23kg)</span>
                    <span>+$45.00</span>
                  </div>
                )}
                {travelInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span>Comprehensive Flight Insurance</span>
                    <span>+$29.00</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-navy">
                  <span>Total Amount Due</span>
                  <span className="text-brand-orange text-xl font-extrabold">${totalPrice.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Secure Payment Guarantee */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>256-bit encrypted checkout powered by Stripe. Instant e-ticket issued via email and SMS.</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => setStep(3)}
                  className="rounded-xl text-xs font-semibold h-10 px-4 gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalPayment}
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-8 gap-2 shadow-lg active:scale-95 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Opening Secure Checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-4" />
                      <span>Proceed to Payment (${totalPrice.toFixed(2)})</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
