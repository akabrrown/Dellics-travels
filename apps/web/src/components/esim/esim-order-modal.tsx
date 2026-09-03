"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Download,
  Wifi,
  Globe2,
  Zap,
  CreditCard,
  Lock,
  Printer,
  Mail,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export interface EsimPlanDetails {
  country: string;
  flag: string;
  data: string;
  validity: string;
  price: string;
  operator?: string;
  region?: string;
}

export interface EsimOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: EsimPlanDetails | null;
}

const DATA_TIERS: Record<string, Array<{ data: string; validity: string; price: number }>> = {
  default: [
    { data: "1 GB", validity: "7 Days", price: 4.5 },
    { data: "3 GB", validity: "30 Days", price: 11.0 },
    { data: "5 GB", validity: "30 Days", price: 16.0 },
    { data: "10 GB", validity: "30 Days", price: 26.0 },
    { data: "20 GB", validity: "30 Days", price: 42.0 },
  ],
};

export function EsimOrderModal({ isOpen, onClose, plan }: EsimOrderModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"customize" | "details" | "payment" | "provisioning" | "success">("customize");

  // Plan configuration
  const [selectedData, setSelectedData] = useState("5 GB");
  const [selectedValidity, setSelectedValidity] = useState("30 Days");
  const [currentPrice, setCurrentPrice] = useState(16);

  // Traveler info
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [deviceModel, setDeviceModel] = useState("Apple iPhone 12 or newer");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");

  // Provisioning states
  const [loading, setLoading] = useState(false);
  const [provisioningStatus, setProvisioningStatus] = useState("Connecting to Airalo Roaming Network...");
  const [orderResult, setOrderResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [instructionTab, setInstructionTab] = useState<"ios" | "android">("ios");

  useEffect(() => {
    if (plan) {
      const num = parseFloat(plan.price.replace(/[^0-9.]/g, "")) || 16;
      setSelectedData(plan.data || "5 GB");
      setSelectedValidity(plan.validity || "30 Days");
      setCurrentPrice(num);
    }
  }, [plan]);

  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.fullName) setFullName(user.fullName);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep("customize");
      setOrderResult(null);
      setLoading(false);
      setCopiedCode(false);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const handleSelectTier = (tier: { data: string; validity: string; price: number }) => {
    setSelectedData(tier.data);
    setSelectedValidity(tier.validity);
    setCurrentPrice(tier.price);
  };

  const handleProceedToDetails = () => {
    setStep("details");
  };

  const handleProceedToPayment = () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid delivery email address.");
      return;
    }
    setStep("payment");
  };

  const handleExecuteOrder = async () => {
    setStep("provisioning");
    setLoading(true);
    setProvisioningStatus("Authenticating with Airalo Partner API...");

    try {
      setTimeout(() => {
        setProvisioningStatus("Allocating GSMA LPA Profile & Roaming ICCID...");
      }, 700);

      const res = await fetch("/api/esim/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: plan.country,
          data: selectedData,
          validity: selectedValidity,
          price: currentPrice,
          email: email.trim(),
          deviceModel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.order) {
        throw new Error(data.error || "Failed to provision Airalo eSIM");
      }

      setTimeout(() => {
        setOrderResult(data.order);
        setStep("success");
        setLoading(false);
        toast.success("eSIM Profile Ready!", {
          description: `Your QR code and installation guide for ${plan.country} are ready.`,
        });
      }, 1400);
    } catch (err: any) {
      toast.error("Provisioning Error", { description: err.message || "Please try again." });
      setStep("payment");
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!orderResult?.activationCode) return;
    navigator.clipboard.writeText(orderResult.activationCode);
    setCopiedCode(true);
    toast.success("Activation Code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Steps */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">{plan.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-navy">
                  {plan.country} eSIM
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  Airalo Partner Core
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {plan.region ? `${plan.region} · ` : ""}High-Speed 4G/5G Prepaid Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        {step !== "success" && (
          <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className={`flex items-center gap-1.5 ${step === "customize" ? "text-brand-orange font-bold" : "text-slate-700"}`}>
              <span className="size-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">1</span>
              <span>Package</span>
            </div>
            <div className="w-8 h-px bg-slate-300" />
            <div className={`flex items-center gap-1.5 ${step === "details" ? "text-brand-orange font-bold" : step === "payment" || step === "provisioning" ? "text-slate-700" : ""}`}>
              <span className="size-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">2</span>
              <span>Device & Email</span>
            </div>
            <div className="w-8 h-px bg-slate-300" />
            <div className={`flex items-center gap-1.5 ${step === "payment" || step === "provisioning" ? "text-brand-orange font-bold" : ""}`}>
              <span className="size-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">3</span>
              <span>Activation</span>
            </div>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP 1: CUSTOMIZE PACKAGE */}
          {step === "customize" && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Data Volume & Validity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(DATA_TIERS.default || []).map((tier) => {
                    const isSelected = selectedData === tier.data;
                    return (
                      <button
                        key={tier.data}
                        type="button"
                        onClick={() => handleSelectTier(tier)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-orange bg-orange-50/50 ring-2 ring-brand-orange/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <span className="font-display text-base font-extrabold text-navy block">
                          {tier.data}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {tier.validity}
                        </span>
                        <span className="text-xs font-bold text-brand-orange mt-1 block">
                          ${tier.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coverage & Operator Info Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                <span className="font-bold text-navy text-xs block">
                  📡 Roaming & Technical Specifications:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Carrier Partner:</span>
                    <span className="font-semibold text-slate-800">{plan.operator || "Tier-1 High Speed 4G/5G"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Plan Type:</span>
                    <span className="font-semibold text-slate-800">Prepaid Data Only</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Activation Policy:</span>
                    <span className="font-semibold text-slate-800">Upon connecting to local network</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hotspot / Tethering:</span>
                    <span className="font-semibold text-emerald-600">Supported</span>
                  </div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Total Price</span>
                  <span className="font-display text-2xl font-black text-brand-orange">
                    ${currentPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={handleProceedToDetails}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-6 shadow-md cursor-pointer gap-1.5"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DEVICE & DELIVERY CONTACT */}
          {step === "details" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Delivery Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@dellicstravels.com"
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 text-xs font-medium focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                <p className="text-[11px] text-slate-400">
                  Your official GSMA QR activation code and voucher will be dispatched here immediately.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Primary Device Hardware
                </label>
                <select
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none"
                >
                  <option value="Apple iPhone 12 or newer">Apple iPhone 12, 13, 14, 15, 16</option>
                  <option value="Apple iPhone XR / XS / 11">Apple iPhone XR, XS, 11</option>
                  <option value="Samsung Galaxy S20 / S21 / S22 / S23 / S24">Samsung Galaxy S20 / S21 / S22 / S23 / S24 / Fold / Flip</option>
                  <option value="Google Pixel 4 / 5 / 6 / 7 / 8 / 9">Google Pixel 4, 5, 6, 7, 8, 9</option>
                  <option value="Other GSMA eSIM Device">Other Unlocked eSIM Device</option>
                </select>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Zero Roaming Bill Shock:</strong> 100% prepaid. No recurring billing, no contracts, and no physical SIM card swap required.
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <Button
                  type="button"
                  onClick={() => setStep("customize")}
                  variant="outline"
                  className="rounded-2xl border-slate-200 text-slate-700 text-xs h-11 px-4 cursor-pointer gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-6 shadow-md cursor-pointer gap-1.5"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & ACTIVATION CONFIRMATION */}
          {step === "payment" && (
            <div className="space-y-4">
              {/* Order Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{plan.country} eSIM ({selectedData})</span>
                  <span className="font-bold text-navy">${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Validity Period</span>
                  <span className="font-medium text-slate-700">{selectedValidity}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Instant Digital Dispatch</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">Total Due</span>
                  <span className="font-display text-xl font-black text-brand-orange">
                    ${currentPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-navy bg-navy/5 text-navy ring-1 ring-navy"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <CreditCard className="size-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("momo")}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === "momo"
                        ? "border-navy bg-navy/5 text-navy ring-1 ring-navy"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <Smartphone className="size-4" />
                    <span>Mobile Money / Paystack</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Lock className="size-3.5 text-slate-400" />
                <span>256-bit SSL encrypted checkout. Powered by Paystack & Airalo Partners.</span>
              </div>

              {/* Step 3 Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <Button
                  type="button"
                  onClick={() => setStep("details")}
                  variant="outline"
                  className="rounded-2xl border-slate-200 text-slate-700 text-xs h-11 px-4 cursor-pointer gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleExecuteOrder}
                  className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-11 px-6 shadow-md cursor-pointer gap-1.5"
                >
                  <Zap className="size-4" />
                  <span>Pay & Provision eSIM (${currentPrice.toFixed(2)})</span>
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PROVISIONING LOADER */}
          {step === "provisioning" && (
            <div className="py-12 text-center space-y-4">
              <div className="size-16 rounded-full bg-brand-orange/10 text-brand-orange mx-auto flex items-center justify-center animate-pulse">
                <Loader2 className="size-8 animate-spin" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-navy">
                  Provisioning Your Digital eSIM
                </h4>
                <p className="text-xs text-slate-500 mt-1">{provisioningStatus}</p>
              </div>
            </div>
          )}

          {/* STEP 5: PROVISIONED SUCCESS & INSTALLATION HUB */}
          {step === "success" && orderResult && (
            <div className="space-y-5 text-center">
              <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>

              <div>
                <h4 className="font-display text-xl font-bold text-navy">
                  Your eSIM is Ready to Install!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan this QR code with your smartphone camera or enter the LPA code manually.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="inline-block p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-md">
                <img
                  src={orderResult.qrCodeUrl}
                  alt="eSIM Activation QR Code"
                  className="size-48 sm:size-52 mx-auto rounded-xl"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                  ICCID: {orderResult.iccid}
                </span>
              </div>

              {/* Manual LPA Code Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Manual LPA Activation Code
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand-orange hover:text-brand-orange-hover cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 break-all select-all">
                  {orderResult.activationCode}
                </div>
              </div>

              {/* Interactive Tabbed Setup Guide */}
              <div className="text-left space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">Installation Guide:</span>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setInstructionTab("ios")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        instructionTab === "ios" ? "bg-white text-navy shadow-xs" : "text-slate-500"
                      }`}
                    >
                      Apple iOS
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstructionTab("android")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        instructionTab === "android" ? "bg-white text-navy shadow-xs" : "text-slate-500"
                      }`}
                    >
                      Android
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
                  {instructionTab === "ios" ? (
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to <strong>Settings → Cellular / Mobile Data</strong>.</li>
                      <li>Tap <strong>&quot;Add eSIM&quot;</strong> or <strong>&quot;Set Up Mobile Service&quot;</strong>.</li>
                      <li>Select <strong>&quot;Use QR Code&quot;</strong> and scan the image above.</li>
                      <li>Label this line as <strong>&quot;Travel Data&quot;</strong>.</li>
                      <li>Turn on <strong>Data Roaming</strong> when you land in {plan.country}.</li>
                    </ol>
                  ) : (
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to <strong>Settings → Network & Internet → SIMs</strong>.</li>
                      <li>Tap <strong>&quot;Add SIM&quot; → &quot;Download a SIM instead&quot;</strong>.</li>
                      <li>Scan the QR code shown above with your camera.</li>
                      <li>Confirm download and enable <strong>&quot;Roaming&quot;</strong> upon arrival.</li>
                    </ol>
                  )}
                </div>
              </div>

              {/* Done & Print Actions */}
              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-1/2 rounded-xl border-slate-200 text-slate-700 font-bold text-xs h-11 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="size-3.5" />
                  <span>Save / Print</span>
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs h-11 cursor-pointer"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
