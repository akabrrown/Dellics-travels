"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Smartphone,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import type { TourPackage } from "@/lib/tours";

export interface TourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourPackage | null;
}

const USD_TO_GHS_RATE = 15.5;

export function TourBookingModal({ isOpen, onClose, tour }: TourBookingModalProps) {
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [departureDate, setDepartureDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("Accra Mall (Main Entrance)");

  // Step 2: Traveler details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [currency, setCurrency] = useState<"GHS" | "USD">("GHS");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
    // Default departure date to 7 days from today
    const d = new Date(Date.now() + 7 * 86400000);
    setDepartureDate(d.toISOString().split("T")[0] || "");
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !tour) return null;

  const totalUsd = tour.rawPrice * travelers;
  const totalGhs = Math.round(totalUsd * USD_TO_GHS_RATE);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate) {
      toast.error("Please select a tour departure date");
      return;
    }
    setStep(2);
  };

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !email.includes("@")) {
      toast.error("Please provide valid traveler contact details");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tours/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourName: tour.name,
          departureDate,
          travelers,
          email: email.trim(),
          customerName: fullName.trim(),
          phone: phone.trim(),
          pickupLocation,
          specialRequests,
          amountUsd: totalUsd,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error || "Failed to initialize Paystack checkout");
      }

      toast.success("Redirecting to Paystack Checkout...", {
        description: "Complete payment via Mobile Money or Card.",
      });

      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      toast.error("Payment error", {
        description: err.message || "Could not start Paystack checkout. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Compass className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded-md">
                  Dellics Signature Tour
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Paystack Direct</span>
              </div>
              <h3 className="font-display text-base font-bold text-navy mt-0.5 line-clamp-1">
                {tour.name}
              </h3>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP 1: DATES, TRAVELERS & PICKUP */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              {/* Tour Overview Banner */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Destination</span>
                  <span className="text-xs font-bold text-navy flex items-center gap-1">
                    <MapPin className="size-3.5 text-brand-orange" />
                    {tour.destination}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Duration</span>
                  <span className="text-xs font-bold text-navy">{tour.duration}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-500">Price per Traveler</span>
                  <span className="text-sm font-bold text-brand-orange">
                    ${tour.rawPrice} USD <span className="text-xs text-slate-400 font-normal">/ ~GH₵ {Math.round(tour.rawPrice * USD_TO_GHS_RATE).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Date & Group Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-brand-orange" />
                    <span>Departure Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="size-3.5 text-brand-orange" />
                    <span>Number of Travelers</span>
                  </label>
                  <div className="flex items-center h-11 border border-slate-300 rounded-xl px-2 justify-between">
                    <button
                      type="button"
                      disabled={travelers <= 1}
                      onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                      className="size-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-navy">
                      {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
                    </span>
                    <button
                      type="button"
                      disabled={travelers >= 20}
                      onClick={() => setTravelers((t) => t + 1)}
                      className="size-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-brand-orange" />
                  <span>Pickup Meeting Point</span>
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none"
                >
                  <option value="Accra Mall (Main Entrance)">Accra Mall (Main Entrance)</option>
                  <option value="Kotoka International Airport (Terminal 3)">Kotoka International Airport (Terminal 3 Arrivals)</option>
                  <option value="Achimota Mall (Main Entrance)">Achimota Mall (Main Entrance)</option>
                  <option value="Tema Community 25 Devtraco Gate">Tema Community 25 Devtraco Gate</option>
                  <option value="Private Hotel Pickup (Contact Coordinator)">Private Hotel Pickup (Accra / Destination)</option>
                </select>
              </div>

              {/* Total Price Banner */}
              <div className="rounded-2xl bg-orange-50/70 border border-orange-200 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange block">
                    Calculated Total
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {travelers}x Traveler ({tour.duration})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl font-black text-navy block">
                    GH₵ {totalGhs.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold block">
                    ${totalUsd.toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-12 gap-2 shadow-md cursor-pointer"
                >
                  <span>Enter Traveler Details</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: LEAD TRAVELER & PAYSTACK CHECKOUT */}
          {step === 2 && (
            <form onSubmit={handlePaystackCheckout} className="space-y-4">
              <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Payments are processed securely via Paystack. You can pay with MTN MoMo, Telecel Cash, or any Visa/Mastercard.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Lead Traveler Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Email for Booking Voucher *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@example.com"
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 55 205 4174"
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Special Requests / Dietary Requirements (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Vegetarian meals, child booster seat, wheelchair assistance"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-navy"
                />
              </div>

              {/* Currency Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Preferred Paystack Payment Currency</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrency("GHS")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      currency === "GHS"
                        ? "border-[#0A0060] bg-[#0A0060] text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Smartphone className="size-3.5" />
                    <span>GH₵ {totalGhs.toLocaleString()} (MoMo / Card)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      currency === "USD"
                        ? "border-[#0A0060] bg-[#0A0060] text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <CreditCard className="size-3.5" />
                    <span>${totalUsd.toLocaleString()} USD</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => setStep(1)}
                  className="rounded-xl text-xs font-semibold h-11 px-4 gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-6 gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Opening Paystack...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-4" />
                      <span>
                        Pay with Paystack ({currency === "GHS" ? `GH₵ ${totalGhs.toLocaleString()}` : `$${totalUsd.toLocaleString()}`})
                      </span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
