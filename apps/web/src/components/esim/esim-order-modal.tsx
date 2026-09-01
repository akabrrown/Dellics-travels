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
  ShieldCheck,
  Loader2,
  Download,
  Wifi,
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
}

export interface EsimOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: EsimPlanDetails | null;
}

export function EsimOrderModal({ isOpen, onClose, plan }: EsimOrderModalProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [deviceModel, setDeviceModel] = useState("Apple iPhone 12 or newer");
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setOrderResult(null);
      setLoading(false);
      setCopiedCode(false);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address for eSIM delivery");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/esim/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: plan.country,
          data: plan.data,
          validity: plan.validity,
          price: plan.price,
          email: email.trim(),
          deviceModel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.order) {
        throw new Error(data.error || "Failed to provision eSIM package");
      }

      setOrderResult(data.order);
      toast.success("eSIM Profile Provisioned!", {
        description: `Your QR code and installation details are ready for ${plan.country}.`,
      });
    } catch (err: any) {
      toast.error("Order error", { description: err.message || "Please try again." });
    } finally {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">{plan.flag}</span>
            <div>
              <h3 className="font-display text-base font-bold text-navy">
                {plan.country} Travel eSIM
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {plan.data} High-Speed 4G/5G Data · {plan.validity}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!orderResult ? (
            /* ORDER FORM */
            <form onSubmit={handleOrder} className="space-y-4">
              {/* Plan Summary Card */}
              <div className="rounded-2xl bg-orange-50/60 border border-orange-100 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange block">
                    Selected Package
                  </span>
                  <span className="font-display text-lg font-bold text-navy">
                    {plan.data} High-Speed Roaming
                  </span>
                  <span className="text-xs text-slate-500 block">Valid for {plan.validity}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block uppercase font-medium">Total</span>
                  <span className="font-display text-2xl font-black text-brand-orange">
                    {plan.price}
                  </span>
                </div>
              </div>

              {/* Delivery Email */}
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
                  Your eSIM profile QR code and activation token will be delivered here instantly.
                </p>
              </div>

              {/* Compatible Device Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Your Device Model
                </label>
                <select
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:border-navy focus:outline-none"
                >
                  <option value="Apple iPhone 12 or newer">Apple iPhone 12 or newer (Dual-SIM supported)</option>
                  <option value="Apple iPhone XR / XS / 11">Apple iPhone XR / XS / 11 (Dual-SIM supported)</option>
                  <option value="Samsung Galaxy S20 / S21 / S22 / S23 / S24">Samsung Galaxy S20 / S21 / S22 / S23 / S24 / Fold / Flip</option>
                  <option value="Google Pixel 4 / 5 / 6 / 7 / 8">Google Pixel 4 / 5 / 6 / 7 / 8</option>
                  <option value="Other eSIM-Compatible Device">Other GSMA eSIM-Compliant Device</option>
                </select>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>Zero physical store visits. Connects directly to tier-1 partner networks.</span>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs h-12 gap-2 shadow-lg active:scale-95 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Provisioning eSIM Profile...</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="size-4" />
                      <span>Order eSIM Profile ({plan.price})</span>
                      <ArrowRight className="size-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* ORDER SUCCESS SCREEN: QR CODE & ACTIVATION DETAILS */
            <div className="space-y-5 text-center">
              <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>

              <div>
                <h4 className="font-display text-lg font-bold text-navy">
                  Your eSIM is Ready to Install!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan this QR code with your phone camera or enter the activation details manually.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="inline-block p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-md">
                <img
                  src={orderResult.qrCodeUrl}
                  alt="eSIM Activation QR Code"
                  className="size-52 mx-auto rounded-xl"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                  ICCID: {orderResult.iccid}
                </span>
              </div>

              {/* Manual Activation Code Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Manual LPA Activation Code
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
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

              {/* 3 Quick Setup Steps */}
              <div className="text-left space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <p className="font-bold text-navy">How to install in 60 seconds:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-500 text-[11px]">
                  <li>Go to <strong>Settings → Cellular / Mobile Data → Add eSIM</strong></li>
                  <li>Scan the QR code shown above with your camera</li>
                  <li>Turn on <strong>Data Roaming</strong> once you land in {plan.country}</li>
                </ol>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs h-11"
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
