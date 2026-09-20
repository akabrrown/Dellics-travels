"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldAlert,
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute -left-40 -top-40 size-96 rounded-full bg-[#0A0060]/50 blur-3xl" />
      <div className="absolute -right-40 -bottom-40 size-96 rounded-full bg-[#F4740D]/20 blur-3xl" />

      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-16 w-24 flex items-center justify-center mb-4">
            <Image
              src="/logo.jpeg"
              alt="Dellics Travels"
              fill
              sizes="(max-width: 768px) 64px, 96px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">
            Dellics <span className="text-[#F4740D]">Operations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Command Center & Administrative Portal
          </p>
        </div>

        <div className="p-3 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-[11px] text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="size-4 text-[#F4740D] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Restricted Access:</strong> Protected by Enterprise Role-Based Access Control (RBAC). Log in with your authorized operations credentials.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleInitSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F4740D]"
                  placeholder="admin@dellicstravels.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F4740D]"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F4740D] hover:bg-[#d96507] text-white font-bold text-xs rounded-full transition-colors shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Authenticating…" : "Continue"}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Secure Access Code *
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Mail className="size-3" />
                  Sent to Email
                </span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/D/g, "").slice(0, 6))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold tracking-widest text-emerald-400 focus:outline-none focus:border-[#F4740D] text-center"
                  placeholder="000 000"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#F4740D] hover:bg-[#d96507] text-white font-bold text-xs rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>{loading ? "Verifying…" : "Enter Operations Portal"}</span>
                <ShieldCheck className="size-4" />
              </button>
              

              <button
                type="button"
                disabled={resending || cooldown > 0}
                onClick={handleResendOtp}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-full transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <Mail className="size-3.5" />
                <span>{resending ? "Sending\u2026" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Access Code"}</span>
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
                className="w-full py-2 bg-transparent text-slate-400 hover:text-slate-300 font-bold text-xs rounded-full transition-colors flex items-center justify-center"
              >
                Go back
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mt-6 text-center">
        Dellics Travels Operations Control Center · Restricted Authorized Access Only
      </p>
    </div>
  );
}
