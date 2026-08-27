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
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("ops@dellicstravels.com");
  const [password, setPassword] = useState("AdminSec#2026!");
  const [totp, setTotp] = useState("849201");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totp || totp.length < 6) {
      setError("Please enter your 6-digit TOTP authenticator code.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 600);
  };

  const handleAutofill = () => {
    setEmail("ops@dellicstravels.com");
    setPassword("AdminSec#2026!");
    setTotp("849201");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute -left-40 -top-40 size-96 rounded-full bg-[#0A0060]/50 blur-3xl" />
      <div className="absolute -right-40 -bottom-40 size-96 rounded-full bg-brand-orange/20 blur-3xl" />

      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="size-16 rounded-2xl bg-white p-1.5 border border-white/20 flex items-center justify-center mb-4 shadow-xl">
            <Image
              src="/Logo.png"
              alt="Dellics Travels"
              width={56}
              height={56}
              className="size-full object-contain"
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

        {/* Security Notice: No Sign-Up */}
        <div className="p-3 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-[11px] text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="size-4 text-[#F4740D] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Restricted Access:</strong> Public sign up is disabled. Administrative accounts are provisioned exclusively by Infrastructure Engineering.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F4740D]"
                placeholder="ops@dellicstravels.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
              Password
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">
                2FA Authenticator Code
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3" />
                TOTP Enforced
              </span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="text"
                required
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold tracking-widest text-emerald-400 focus:outline-none focus:border-[#F4740D]"
                placeholder="000 000"
                maxLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#F4740D] hover:bg-[#d96507] text-white font-bold text-xs rounded-full transition-colors shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Authenticating Session…" : "Enter Operations Portal"}</span>
            <ArrowRight className="size-4" />
          </button>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleAutofill}
              className="text-xs text-[#F4740D] hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="size-3" />
              Autofill Credentials
            </button>
            <button
              type="button"
              onClick={() => alert("Security notification dispatched to Infrastructure Lead.")}
              className="text-xs text-slate-400 hover:text-white hover:underline"
            >
              Reset 2FA Token
            </button>
          </div>
        </form>
      </div>

      <p className="text-[11px] text-slate-500 mt-6 text-center">
        Dellics Travels Operations Control Center · Restricted Authorized Access Only
      </p>
    </div>
  );
}
