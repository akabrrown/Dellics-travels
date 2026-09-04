"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Real-time password criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isFormValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Recovery token is missing. Please open the exact link sent to your email.");
      return;
    }

    if (!email) {
      setError("Email address is missing. Please request a new password recovery link.");
      return;
    }

    if (!isFormValid) {
      setError("Please ensure your password satisfies all security criteria below.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: token.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to reset password. The link may have expired.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Automatically navigate to sign in after 2.5 seconds
      setTimeout(() => {
        router.push(`/signin?email=${encodeURIComponent(email)}&reset=success`);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
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
            <span>Account Security & Protection</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight text-white leading-tight">
            Secure your credentials & travel portfolio.
          </h2>

          <p className="text-sm text-white/80 leading-relaxed">
            Create a strong, unique password to safeguard your flight bookings, hotel reservations, loyalty tier points, and private traveler profiles.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Dellics Travels. All rights reserved.
        </div>
      </div>

      {/* Right Column: Reset Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Top Brand Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/" aria-label="Dellics Travels Home">
                <div className="relative h-14 w-20">
                  <Image
                    src="/logo.jpeg"
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
                Choose a new password
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter your new password below to regain access to your account.
              </p>
            </div>
          </div>

          {/* Missing Token Warning */}
          {!token && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Missing Recovery Token</p>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    This password reset link is invalid or incomplete. Please request a fresh recovery link from the forgot password page.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl text-xs font-semibold">
                <Link href="/forgot-password">Request New Recovery Link</Link>
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Failed</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {success ? (
            <div className="text-center py-6 space-y-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Password Successfully Reset
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Your password has been updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-2">
                <Button asChild className="rounded-xl w-full bg-navy hover:bg-navy-light text-white font-bold">
                  <Link href={`/signin?email=${encodeURIComponent(email)}`}>
                    Sign In to Your Account
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            token && (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* User Email Indicator */}
                {email && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Account Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-600 cursor-not-allowed outline-none font-medium"
                    />
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label
                    htmlFor="reset-new-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      id="reset-new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Password Requirements:
                  </p>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2">
                      {hasMinLength ? (
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-slate-300 mx-1" />
                      )}
                      <span className={hasMinLength ? "text-slate-900 font-medium" : ""}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasUppercase ? (
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-slate-300 mx-1" />
                      )}
                      <span className={hasUppercase ? "text-slate-900 font-medium" : ""}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasLowercase ? (
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-slate-300 mx-1" />
                      )}
                      <span className={hasLowercase ? "text-slate-900 font-medium" : ""}>
                        At least one lowercase letter (a-z)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasNumber ? (
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-slate-300 mx-1" />
                      )}
                      <span className={hasNumber ? "text-slate-900 font-medium" : ""}>
                        At least one number (0-9)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordsMatch ? (
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-slate-300 mx-1" />
                      )}
                      <span className={passwordsMatch ? "text-slate-900 font-medium" : ""}>
                        Passwords match
                      </span>
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full rounded-xl bg-navy hover:bg-navy-light disabled:opacity-50 text-white py-3.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>{loading ? "Updating Password…" : "Save New Password"}</span>
                </Button>
              </form>
            )
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
