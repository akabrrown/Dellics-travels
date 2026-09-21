"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldAlert,
  KeyRound,
} from "lucide-react";
import { loginAdminAccount, loginAdminAccountInit } from "@/lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleInitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid administrative email address.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await loginAdminAccountInit(email, password);
      if (!res.success) {
        setError(res.error || "Authentication failed. Check your credentials.");
        setLoading(false);
        return;
      }
      
      setStep(2);
      setMessage("A 6-digit access code has been sent to your email.");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit OTP code from your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await loginAdminAccount(email, password, otp);
      if (!res.success) {
        setError(res.error || "Authentication failed. Invalid or expired code.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 400);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setMessage("");

    try {
      const res = await loginAdminAccountInit(email, password);
      if (!res.success) {
        setError(res.error || "Failed to resend code.");
      } else {
        setMessage("A new 6-digit access code has been sent to your email.");
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex">
      {/* Left Column: Editorial Backdrop (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden">
        <Image
          src="/images/services/plane.jpg"
          alt="Dellics Travels Admin"
          fill
          className="object-cover opacity-35"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10">
          {/* Empty space for layout balance */}
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#F4740D] border border-white/15 backdrop-blur-sm">
            <ShieldAlert className="size-3.5" />
            <span>Restricted Access · Enterprise Staff Only</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight text-white leading-tight">
            Dellics Operations Command Center
          </h2>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Manage global itineraries and bookings</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Protected by Role-Based Access Control (RBAC)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Bank-grade 2FA authentication required</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Dellics Travels. All rights reserved.
        </div>
      </div>

      {/* Right Column: Focused Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Top Brand Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative h-14 w-20">
                <Image
                  src="/logo.jpeg"
                  alt="Dellics Travels"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Admin Authentication
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter your authorized credentials to access the portal.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {message && !success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-3">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Authentication successful. Accessing portal…</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleInitSignIn} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@dellicstravels.com"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0A0060] focus:ring-1 focus:ring-[#0A0060] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0A0060] focus:ring-1 focus:ring-[#0A0060] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#0A0060] hover:bg-[#0A0060]/90 text-white py-3.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? "Authenticating…" : "Continue"}</span>
                <ArrowRight className="size-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Secure Access Code
                  </label>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Mail className="size-3" />
                    Sent to Email
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-center font-mono text-lg tracking-widest text-slate-900 placeholder:text-slate-300 focus:border-[#0A0060] focus:ring-1 focus:ring-[#0A0060] outline-none transition-all"
                    placeholder="000 000"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#F4740D] hover:bg-[#d96507] text-white py-3.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>{loading ? "Verifying…" : "Enter Operations Portal"}</span>
                  <ShieldCheck className="size-4" />
                </button>
                
                <button
                  type="button"
                  disabled={resending || cooldown > 0}
                  onClick={handleResendOtp}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-900 font-semibold text-xs rounded-full transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Mail className="size-3.5" />
                  <span>{resending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Access Code"}</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setMessage("");
                    setError("");
                    setCooldown(0);
                  }}
                  className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold text-xs rounded-full transition-colors flex items-center justify-center"
                >
                  Go back
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 border-t border-slate-100 text-center space-y-4">
            <p className="text-[11px] text-slate-400">
              Operations Control Center · Restricted Authorized Access Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
