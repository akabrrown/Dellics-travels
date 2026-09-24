"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Info } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex flex-1 bg-navy p-12 flex-col justify-between">
        <Link href="/" className="inline-block">
          <Image src="/logo.jpg" alt="Dellics Education Consult" width={100} height={100} className="rounded-xl object-contain bg-white p-1" unoptimized />
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-semibold text-white mb-4">
            Manage your study abroad journey.
          </h2>
          <p className="text-slate-300">
            Access your application milestones, document locker, and university tracking in one secure place.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          ? {new Date().getFullYear()} Dellics Education Consult
        </p>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Image src="/logo.jpg" alt="Dellics Education Consult" width={80} height={80} className="rounded-xl object-contain bg-slate-50 p-1 mx-auto" unoptimized />
            </Link>
          </div>

          <h1 className="text-2xl font-display font-semibold text-slate-900 mb-2">
            {showForgot ? "Reset your password" : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            {showForgot
              ? "Enter the email address associated with your Dellics account."
              : "Sign in to continue to your dashboard."}
          </p>

          {!showForgot ? (
            <>
              {/* Ecosystem Notice */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 mb-6">
                <Info className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  <strong>Ecosystem Account</strong><br/>
                  Your account works across Dellics Education Consult and Dellics Travels.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <button type="button" onClick={() => setShowForgot(true)} className="text-xs font-medium text-slate-500 hover:text-navy transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 mt-2 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Log In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">Or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button type="button" className="w-full py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3">
                <svg width={18} height={18} viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/></svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-slate-500 mt-8">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-navy hover:text-brand-orange transition-colors">
                  Apply Now
                </Link>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      id="reset-email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                      placeholder="Enter your registered email"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-2.5 mt-2 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-6">
                Remember your password?{" "}
                <button type="button" onClick={() => setShowForgot(false)} className="font-medium text-navy hover:text-brand-orange transition-colors">
                  Back to Log In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
