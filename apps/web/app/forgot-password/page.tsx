"use client";

import React, { useState } from "react";
import Image from "next/image";
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
      setError("Please provide your registered email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate password reset dispatch
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex">
      {/* Left Column: Editorial Backdrop (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden">
        <Image
          src="/images/services/corporate-travel-management.jpg"
          alt="Dellics Travels Account Security"
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to sign in</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-orange border border-white/15 backdrop-blur-sm">
            <ShieldCheck className="size-3.5" />
            <span>Account Security & Recovery</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight text-white leading-tight">
            Safeguarding your travel credentials & bookings.
          </h2>

          <p className="text-sm text-white/80 leading-relaxed">
            If you've forgotten your account password, submit your registered email address. We'll dispatch a secure, single-use recovery link valid for 60 minutes.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Dellics Travels & Tours Ltd.
        </div>
      </div>

      {/* Right Column: Reset Request Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Top Brand Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/" aria-label="Dellics Travels Home">
                <div className="relative h-14 w-20">
                  <Image
                    src="/Logo.png"
                    alt="Dellics Travels"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <Link
                href="/signin"
                className="text-xs font-medium text-slate-500 hover:text-navy lg:hidden flex items-center gap-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Sign in</span>
              </Link>
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Reset your password
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter your email address to receive password reset instructions.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Error</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {sent ? (
            <div className="text-center py-6 space-y-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
              <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                We've sent recovery instructions to <strong className="text-slate-900">{email}</strong>. Please check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-xl w-full">
                  <Link href="/signin">Return to sign in</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@example.com"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-navy hover:bg-navy-light text-white py-3.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? "Sending link…" : "Send Reset Instructions"}</span>
              </Button>
            </form>
          )}

          <div className="pt-6 border-t border-slate-100 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-brand-orange transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
