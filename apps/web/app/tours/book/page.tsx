"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  Clock,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

function TourBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const tourId = searchParams.get("id") || "gh-tour-01";
  const tourName = searchParams.get("name") || searchParams.get("tour") || "Cape Coast Castle & Kakum Canopy Walk";
  const destination = searchParams.get("destination") || "Central Region, Ghana";
  const rawPrice = searchParams.get("price") || "120";
  const unitPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 120;

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const totalAmount = unitPrice * guests;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select your preferred tour date");
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please complete all required lead traveler fields");
      return;
    }

    setLoading(true);
    try {
      // Direct redirect to confirmation
      router.push(
        `/tours/confirmation?tour=${encodeURIComponent(tourName)}&date=${encodeURIComponent(date)}&guests=${guests}&leadPassenger=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&total=${totalAmount}`
      );
    } catch {
      toast.error("Unable to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6 sm:pt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-navy transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/tours" className="hover:text-navy transition-colors">
            Tours
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-navy font-bold">Tour Reservation</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200 mb-2">
              <Compass className="size-3.5" />
              Verified Guided Experience
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Reserve Your Tour
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Guaranteed departure, private AC transport, and licensed tour guide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleBookingSubmit}
              className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="size-10 rounded-2xl bg-navy text-white flex items-center justify-center">
                  <Calendar className="size-5 text-brand-orange" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    Tour Schedule & Guests
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Select your date and number of participants.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Tour Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Number of Guests <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"} (${unitPrice * n})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="font-display text-base font-bold text-navy mb-3">
                  Lead Traveler Contact
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Abena Mensah"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="abena@example.com"
                        className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        WhatsApp / Phone <span className="text-rose-500">*</span>
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

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Hotel Pickup Location (Accra / Environs)
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Kempinski Hotel, Ridge or Airport Residential"
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Special Requests / Dietary Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Vegetarian lunch, wheelchair access, or child seat"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Tours</span>
                </Link>

                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-12 px-8 gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Confirming Tour...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Reserve (${totalAmount} USD)</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Tour Summary Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block">
                {destination}
              </span>
              <h3 className="font-display text-xl font-bold text-navy">
                {tourName}
              </h3>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-slate-400" />
                  <span>Full Day (Approx 8–10 hours)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Private Air-Conditioned Vehicle Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>All Entry Fees & Castle Permits Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Licensed Historian Tour Guide Included</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-baseline justify-between">
                <span className="font-bold text-sm text-navy">Total ({guests} {guests === 1 ? "Guest" : "Guests"})</span>
                <span className="font-display text-2xl font-black text-brand-orange">
                  ${totalAmount} USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold">
            <Loader2 className="size-5 animate-spin text-brand-orange" />
            <span>Loading Tour Reservation...</span>
          </div>
        </div>
      }
    >
      <TourBookingContent />
    </Suspense>
  );
}
