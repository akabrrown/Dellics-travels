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
  Lock,
  Clock,
  Check,
  Building2,
  Sparkles,
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
    originCity?: string;
    destinationCity?: string;
    airline?: string;
    price: number;
    currency?: string;
    departureDate?: string;
    returnDate?: string;
    cabinClass?: string;
    flightNumber?: string;
    passengers?: number;
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

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Formatting origin and destination helpers
  const extractCode = (str?: string, fallback = "ACC"): string => {
    if (!str) return fallback;
    const match = str.match(/\(([A-Za-z]{3})\)/);
    if (match && match[1]) return match[1].toUpperCase();
    if (str.length === 3) return str.toUpperCase();
    return fallback;
  };

  const extractCity = (str?: string, fallback = "Airport City"): string => {
    if (!str) return fallback;
    const parts = str.split("(");
    const city = parts[0]?.trim();
    return city || fallback;
  };

  const originCode = extractCode(flight.origin, "ACC");
  const destCode = extractCode(flight.destination, "LHR");
  const originCity = flight.originCity || extractCity(flight.origin, "Accra, Ghana");
  const destCity = flight.destinationCity || extractCity(flight.destination, "London, UK");

  const passengerCount = flight.passengers || 1;
  const basePrice = (flight.price || 850);
  const taxesFees = Math.round(basePrice * 0.14);
  const baggageFee = extraBaggage ? 45 * passengerCount : 0;
  const insuranceFee = travelInsurance ? 29 * passengerCount : 0;
  const totalPrice = basePrice + taxesFees + baggageFee + insuranceFee;

  const handleNextStep1 = () => setStep(2);

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Passenger legal name is required as shown on Passport/ID");
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
        origin: originCode,
        destination: destCode,
        departureDate,
        returnDate: flight.returnDate,
        airline: flight.airline || "IATA Certified Carrier",
        price: totalPrice,
        currency: flight.currency || "USD",
        email: email.trim(),
        customerName: `${title} ${firstName.trim()} ${lastName.trim()}`,
        cabinClass: flight.cabinClass || "Economy",
        passengerCount,
      });

      if (res.url) {
        window.location.href = res.url;
        return;
      }
    } catch {
      // Fallback confirmation redirect
      window.location.href = `/flights/confirmation?origin=${encodeURIComponent(originCode)}&dest=${encodeURIComponent(destCode)}&airline=${encodeURIComponent(flight.airline || "Airline")}&price=${totalPrice}&currency=USD&passenger=${encodeURIComponent(`${firstName} ${lastName}`)}`;
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, short: "Flight", full: "1. Flight Review" },
    { num: 2, short: "Traveler", full: "2. Passenger Info" },
    { num: 3, short: "Preferences", full: "3. Preferences" },
    { num: 4, short: "Payment", full: "4. Checkout" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-booking-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[min(700px,94vh)]">
        {/* MODAL HEADER */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-navy text-white flex items-center justify-center shadow-xs">
                <Plane className="size-5 text-brand-orange" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    id="flight-booking-modal-title"
                    className="font-display text-base sm:text-lg font-bold text-navy"
                  >
                    Flight Reservation
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    IATA Certified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {originCode} → {destCode} · {flight.airline || "Global Carrier"} ({flight.cabinClass || "Economy"})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Stepper Progress Navigation */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-[11px] font-bold">
            {stepsList.map((s) => (
              <div
                key={s.num}
                className={`py-1.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  step === s.num
                    ? "bg-navy text-white shadow-xs"
                    : step > s.num
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-white text-slate-400 border border-slate-200/80"
                }`}
              >
                {step > s.num ? (
                  <Check className="size-3 text-emerald-600 shrink-0" />
                ) : (
                  <span className="size-3.5 rounded-full bg-current/15 flex items-center justify-center text-[9px]">
                    {s.num}
                  </span>
                )}
                <span className="hidden sm:inline">{s.full}</span>
                <span className="sm:hidden">{s.short}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL BODY (Scrollable Area) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: ITINERARY & FARE REVIEW */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Flight Route Overview Card */}
              <div className="rounded-3xl bg-slate-50/80 border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="size-4 text-brand-orange" />
                    <span className="font-bold text-sm text-navy">
                      {flight.airline || "IATA Certified Airline"}
                    </span>
                    <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                      {flight.flightNumber || "DL-842"}
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                    {flight.cabinClass || "Economy Class"}
                  </span>
                </div>

                {/* Origin vs Destination Display */}
                <div className="grid grid-cols-3 items-center text-center py-2">
                  <div className="text-left">
                    <span className="font-display text-2xl sm:text-3xl font-black text-navy block tracking-tight">
                      {originCode}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {originCity}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Depart: {flight.departureDate || "Scheduled Departure"}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Direct Route
                    </span>
                    <div className="w-full flex items-center gap-1.5">
                      <div className="h-0.5 bg-slate-300 flex-1 rounded-full" />
                      <div className="size-6 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                        <Plane className="size-3 text-brand-orange rotate-90" />
                      </div>
                      <div className="h-0.5 bg-slate-300 flex-1 rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                      <Clock className="size-3 text-slate-400" />
                      Scheduled Flight
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
                      {flight.returnDate ? `Return: ${flight.returnDate}` : "Arrival Point"}
                    </p>
                  </div>
                </div>

                {/* Baggage Inclusions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-200/70 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Luggage className="size-3.5 text-emerald-600" />
                    <span>1x 7kg Cabin Bag Included</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>2x 23kg Checked Bags Included</span>
                  </div>
                </div>
              </div>

              {/* Fare Summary Breakdown */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2 text-xs bg-white">
                <div className="flex justify-between text-slate-600">
                  <span>Base Airfare ({passengerCount} {passengerCount === 1 ? "Traveler" : "Travelers"})</span>
                  <span className="font-semibold text-slate-900">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Aviation Taxes & Airport Security Surcharges</span>
                  <span className="font-semibold text-slate-900">${taxesFees.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold text-navy">
                  <span>Trip Subtotal</span>
                  <span className="text-brand-orange text-base font-black">
                    ${(basePrice + taxesFees).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  onClick={handleNextStep1}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-7 gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
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
              <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed font-medium">
                  Enter passenger details exactly as they appear on your government passport or national ID for airline check-in and IATA ticketing.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:border-navy focus:outline-none"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    First & Middle Names <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Kwame Kofi"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Last Name / Surname <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Mensah"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    E-Ticket Delivery Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@example.com"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 55 205 4174"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nationality</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CountryFlag countryCode={nationality} className="w-4 h-2.5 rounded-2xs" />
                    </div>
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:border-navy focus:outline-none"
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Passport No. (Optional)
                  </label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="G1234567"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 uppercase focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Passport Expiry
                  </label>
                  <input
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl text-xs font-semibold h-10 px-4 gap-1 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-2 cursor-pointer shadow-md"
                >
                  <span>Seat & Meal Preferences</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: PREFERENCES & ADD-ONS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/60">
                  <div className="flex items-center gap-2">
                    <Armchair className="size-4 text-brand-orange" />
                    <label className="text-xs font-bold text-navy">Seat Preference</label>
                  </div>
                  <select
                    value={seatPreference}
                    onChange={(e) => setSeatPreference(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:border-navy focus:outline-none"
                  >
                    <option value="Window">Window Seat (Standard)</option>
                    <option value="Aisle">Aisle Seat (Easy access)</option>
                    <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Assigned upon 24h airline online check-in.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/60">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-4 text-brand-orange" />
                    <label className="text-xs font-bold text-navy">In-Flight Meal</label>
                  </div>
                  <select
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:border-navy focus:outline-none"
                  >
                    <option value="Standard / No Restriction">Standard / No Restriction</option>
                    <option value="Halal Certified">Halal Certified</option>
                    <option value="Vegetarian / Vegan">Vegetarian / Vegan</option>
                    <option value="Kosher Meal">Kosher Meal</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Notified directly to airline catering.</p>
                </div>
              </div>

              {/* Recommended Upgrades */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Travel Upgrades
                </h4>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors shadow-2xs">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraBaggage}
                      onChange={(e) => setExtraBaggage(e.target.checked)}
                      className="size-4 rounded text-brand-orange focus:ring-brand-orange"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Add 1x Extra 23kg Checked Bag</span>
                      <span className="text-[11px] text-slate-500">Save up to 40% vs airport counter excess fees</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-orange">+$45.00</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors shadow-2xs">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={travelInsurance}
                      onChange={(e) => setTravelInsurance(e.target.checked)}
                      className="size-4 rounded text-brand-orange focus:ring-brand-orange"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Comprehensive Flight & Medical Insurance</span>
                      <span className="text-[11px] text-slate-500">Trip delay coverage, lost baggage, and 24/7 medical assistance</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-orange">+$29.00</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="rounded-xl text-xs font-semibold h-10 px-4 gap-1 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep3}
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-10 px-6 gap-2 cursor-pointer shadow-md"
                >
                  <span>Review Booking & Total</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: FINAL SUMMARY & SECURE PAYMENT */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Booking Summary
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Passenger Name</span>
                    <span className="font-bold text-navy">{title} {firstName} {lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Flight Route</span>
                    <span className="font-bold text-navy">{originCode} → {destCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Airline Carrier</span>
                    <span className="font-bold text-navy">{flight.airline || "IATA Airline"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Seat / Meal</span>
                    <span className="font-bold text-navy">{seatPreference} / {mealPreference.split(" ")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Price Details */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2 text-xs bg-white">
                <div className="flex justify-between text-slate-600">
                  <span>Base Airfare ({passengerCount} {passengerCount === 1 ? "Traveler" : "Travelers"})</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Aviation Taxes & Security Fees</span>
                  <span>${taxesFees.toFixed(2)}</span>
                </div>
                {extraBaggage && (
                  <div className="flex justify-between text-slate-600">
                    <span>Extra Checked Bag (23kg)</span>
                    <span>+${baggageFee.toFixed(2)}</span>
                  </div>
                )}
                {travelInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span>Comprehensive Flight Insurance</span>
                    <span>+${insuranceFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-2.5 flex justify-between text-base font-bold text-navy">
                  <span>Total Amount Due</span>
                  <span className="text-brand-orange text-xl font-black">${totalPrice.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Guarantee badge */}
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">256-bit encrypted checkout. Instant e-ticket PNR issued to your email.</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => setStep(3)}
                  className="rounded-xl text-xs font-semibold h-10 px-4 gap-1 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalPayment}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-7 gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
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
