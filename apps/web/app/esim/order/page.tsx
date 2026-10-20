"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wifi,
  Globe2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  ChevronRight,
  QrCode,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/ui/country-flag";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

function EsimOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const planId = searchParams.get("id") || "plan-gh-1";
  const countryName = searchParams.get("country") || "Ghana";
  const countryCode = searchParams.get("countryCode") || "GH";
  const dataAmount = searchParams.get("data") || "10 GB";
  const validity = searchParams.get("validity") || "30 Days";
  const rawPrice = searchParams.get("price") || "$24.00";
  const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 24.0;
  const network = searchParams.get("network") || "MTN / Vodafone 5G";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email address is required for instant eSIM QR delivery");
      return;
    }

    setLoading(true);
    try {
      toast.success("eSIM generated! Dispatched to your email with instant QR code.");
      router.push(`/profile?tab=esim`);
    } catch {
      toast.error("Order processing failed. Please try again.");
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
          <Link href="/esim" className="hover:text-navy transition-colors">
            eSIM
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-navy font-bold">Instant Activation</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200 mb-2">
              <Wifi className="size-3.5" />
              Global Airalo Roaming Network
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Get Your Travel eSIM
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Zero physical SIM cards needed. Scan QR code and connect instantly upon landing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <form
              onSubmit={handleOrderSubmit}
              className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="size-10 rounded-2xl bg-navy text-white flex items-center justify-center">
                  <QrCode className="size-5 text-brand-orange" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    eSIM Delivery Information
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Your QR code and installation profile are delivered immediately via email.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Delivery Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your QR code voucher and activation guide will be sent here within 60 seconds.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    WhatsApp Phone Number (For Backup Dispatch)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 55 205 4174"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Smartphone Device Model (Optional)
                  </label>
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro, Samsung Galaxy S24, Google Pixel 8"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-navy/20 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-900">
                <Smartphone className="size-5 text-blue-600 shrink-0" />
                <p className="text-xs leading-relaxed font-medium">
                  Compatible with all unlocked eSIM-ready devices (iPhone XR or newer, Samsung S20 or newer, Google Pixel 3 or newer).
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Link
                  href="/esim"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Plans</span>
                </Link>

                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-12 px-8 gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Activating eSIM...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      <span>Order & Activate (${numericPrice.toFixed(2)})</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Plan Summary Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CountryFlag countryCode={countryCode} className="w-8 h-5 rounded-xs" />
                <div>
                  <h3 className="font-display text-lg font-bold text-navy">
                    {countryName} eSIM
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {network}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Data Capacity</span>
                  <span className="font-display text-xl font-bold text-navy">{dataAmount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Validity</span>
                  <span className="font-display text-xl font-bold text-navy">{validity}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>High-speed 4G / 5G Mobile Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Personal Hotspot / Tethering Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>No physical SIM swapping required</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-baseline justify-between">
                <span className="font-bold text-sm text-navy">Total Price</span>
                <span className="font-display text-2xl font-black text-brand-orange">
                  ${numericPrice.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EsimOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold">
            <Loader2 className="size-5 animate-spin text-brand-orange" />
            <span>Loading eSIM Checkout...</span>
          </div>
        </div>
      }
    >
      <EsimOrderContent />
    </Suspense>
  );
}
