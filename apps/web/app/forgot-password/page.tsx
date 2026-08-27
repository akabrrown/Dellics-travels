"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate password reset email
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-2xl">
          {/* Header Banner */}
          <div className="bg-[#0A0060] p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 shadow-md">
                <Mail className="size-6 text-brand-orange" />
              </div>
              <h1 className="font-display text-2xl font-extrabold text-white">
                Reset Password
              </h1>
              <p className="mt-1 text-xs text-white/80 font-light">
                Enter your registered email address to receive reset instructions.
              </p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3">
                <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {sent ? (
              <div className="text-center py-4 space-y-4">
                <div className="size-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Check Your Email
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  We've sent password reset instructions to <strong className="text-slate-900">{email}</strong>.
                  Please check your inbox and spam folder.
                </p>
                <div className="pt-4">
                  <Button
                    asChild
                    className="rounded-full bg-[#0A0060] hover:bg-[#140882] text-white px-8 py-3 text-xs font-bold"
                  >
                    <Link href="/signin">Return to Sign In</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0A0060] hover:bg-[#140882] text-white py-3.5 text-sm font-bold shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? "Sending link…" : "Send Reset Link"}</span>
                </Button>

                <div className="text-center pt-4">
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0A0060] transition-colors"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Encrypted Security Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
