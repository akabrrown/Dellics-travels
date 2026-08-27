"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions to proceed.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate account creation handshake
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin?registered=true");
      }, 700);
    } catch (err: any) {
      setError(err.message || "Unable to register account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex">
      {/* Left Column: Editorial Heritage Backdrop (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden">
        <Image
          src="/images/africa/accra-city-experience.jpg"
          alt="Dellics Travels World Destinations"
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Return to website</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-orange border border-white/15 backdrop-blur-sm">
            <ShieldCheck className="size-3.5" />
            <span>IATA Certified Travel Agency</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight text-white leading-tight">
            Create an account for personalized travel management.
          </h2>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Save passenger details and passport info for fast checkout</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Instant alerts on flight schedule updates and gate changes</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Direct communication with your personal travel specialist</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Dellics Travels & Tours Ltd.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-7">
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
                href="/"
                className="text-xs font-medium text-slate-500 hover:text-navy lg:hidden flex items-center gap-1"
              >
                <ArrowLeft className="size-3.5" />
                <span>Home</span>
              </Link>
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Create a traveler account
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage your international flights, accommodations, and private tours.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3">
              <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Issue</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Account registered! Redirecting to sign in…</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  id="signup-email"
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

            <div>
              <label
                htmlFor="signup-phone"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Phone / WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 55 205 4174"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-navy focus:ring-navy mt-0.5"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold text-navy hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-navy hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-navy hover:bg-navy-light text-white py-3.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Creating account…" : "Create Account"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-navy hover:text-brand-orange transition-colors"
              >
                Sign in
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              Protected by 256-bit SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
