"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@dellicstravels.com");
  const [password, setPassword] = useState("••••••••");
  const [totp, setTotp] = useState("");
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
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="size-14 rounded-2xl bg-[#0A0060] flex items-center justify-center mb-4 shadow-md">
            <span className="font-display font-extrabold text-[#F4740D] text-2xl">D</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0A0060]">
            Dellics Operations Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with administrative credentials & 2FA authenticator.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                placeholder="ops@dellicstravels.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-slate-500">
                2FA Authenticator Code
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3" />
                Enforced
              </span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                required
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-[#0A0060]"
                placeholder="000 000"
                maxLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A0060] hover:bg-[#140882] text-white font-bold text-xs rounded-full transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Authenticating Session…" : "Enter Operations Portal"}</span>
            <ArrowRight className="size-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => alert("Password reset instructions emailed to registered administrator.")}
              className="text-xs text-slate-500 hover:text-[#0A0060] hover:underline"
            >
              Forgot password? Contact Security Lead
            </button>
          </div>
        </form>
      </div>

      <p className="text-[11px] text-slate-400 mt-6 text-center">
        Dellics Travels Operations Control Center · Restricted Authorized Access Only
      </p>
    </div>
  );
}
