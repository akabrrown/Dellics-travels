"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email address and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await signIn(email.trim(), password);

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Welcome back!", {
        description: `Signed in as ${email}`,
      });

      setTimeout(() => {
        router.push(redirectUrl);
      }, 400);
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please verify your credentials.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-950 flex">
      {/* Left Column: Editorial Travel Backdrop (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden">
        <Image
          src="/images/services/plane.jpg"
          alt="Dellics Travels Aviation & Stays"
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
            <span>IATA Certified</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight text-white leading-tight">
            Manage your global itineraries and bookings in one place.
          </h2>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Real-time flight ticket confirmation & airline PNR tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Itemized hotel vouchers and private tour itineraries</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Direct access to your assigned travel consultant</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Dellics Travels & Tours Ltd.
        </div>
      </div>

      {/* Right Column: Focused Auth Form */}
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
                    unoptimized
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
                Sign in to your account
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter your registered email address to access your bookings.
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

          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Signed in successfully. Redirecting to your dashboard…</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="signin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  id="signin-email"
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
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signin-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-brand-orange hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
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

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-navy focus:ring-navy"
                />
                <span className="text-xs text-slate-600">Keep me signed in</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-navy hover:bg-navy-light text-white py-3.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? "Signing in…" : "Sign In"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center space-y-4">
            <p className="text-xs text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-navy hover:text-brand-orange transition-colors"
              >
                Create an account
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading sign in portal…</div>}>
      <SignInContent />
    </Suspense>
  );
}
