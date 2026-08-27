"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Gift,
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
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate account registration
      await new Promise((resolve) => setTimeout(resolve, 900));

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin?registered=true");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Could not complete registration. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Brand Card */}
        <div className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-2xl">
          {/* Header Banner */}
          <div className="bg-[#0A0060] p-8 text-center text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-brand-orange/20 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 size-32 rounded-full bg-brand-orange/15 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 shadow-md">
                <span className="font-display font-extrabold text-2xl text-brand-orange">D</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-white">
                Join Dellics Travels Club
              </h1>
              <p className="mt-1 text-xs text-white/80 font-light">
                Create an account for personalized luxury concierge, exclusive rates & rewards.
              </p>
            </div>
          </div>

          {/* Membership Bonus Highlight */}
          <div className="bg-gradient-to-r from-amber-500/10 via-brand-orange/10 to-amber-500/10 border-b border-brand-orange/20 px-6 py-3 flex items-center gap-3">
            <div className="size-8 rounded-full bg-brand-orange flex items-center justify-center text-white shrink-0 shadow-sm">
              <Gift className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Welcome Privilege: 500 Rewards Points
              </p>
              <p className="text-[11px] text-slate-600">
                Instantly unlocked upon sign up for flights, hotel credits and perks.
              </p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3">
                <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Registration Issue</p>
                  <p className="mt-0.5 text-rose-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Account Created Successfully!</p>
                  <p className="text-[11px] text-emerald-700">Redirecting you to sign in…</p>
                </div>
              </div>
            )}

            {/* Social Logins */}
            <button
              type="button"
              onClick={() => alert("Google OAuth register connected to Supabase")}
              className="w-full flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-3 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-6"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="relative mb-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-4 text-[11px] font-semibold uppercase text-slate-400">
                Or fill your details
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 chars"
                      className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="size-4 mt-0.5 rounded border-slate-300 text-[#0A0060] focus:ring-[#0A0060]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#0A0060] font-semibold underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#0A0060] font-semibold underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 text-sm font-bold shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? "Creating Account…" : "Create My Account"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>

            {/* Footer Prompt */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-bold text-[#0A0060] hover:text-brand-orange transition-colors"
                >
                  Sign in here
                </Link>
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>IATA Verified Travel Protection & Data Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
