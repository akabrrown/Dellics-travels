"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const update = (field: string, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex flex-1 bg-navy p-12 flex-col justify-between">
        <Link href="/" className="inline-block">
          <Image src="/logo.jpg" alt="Dellics Education Consult" width={100} height={100} className="rounded-xl object-contain bg-white p-1" unoptimized />
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-semibold text-white mb-4">
            Start your study-abroad journey.
          </h2>
          <p className="text-slate-300">
            Create an account to track university applications, upload documents, and connect with advisors.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          ? {new Date().getFullYear()} Dellics Education Consult
        </p>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Image src="/logo.jpg" alt="Dellics Education Consult" width={80} height={80} className="rounded-xl object-contain bg-slate-50 p-1 mx-auto" unoptimized />
            </Link>
          </div>

          <h1 className="text-2xl font-display font-semibold text-slate-900 mb-2">
            {isSuccess ? "Verify your email" : "Create an account"}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            {isSuccess
              ? "We've sent a verification link to your email address."
              : "Sign up to begin your application process."}
          </p>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" id="first-name" value={formData.firstName} onChange={(e) => update("firstName", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all" placeholder="First name" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" id="last-name" value={formData.lastName} onChange={(e) => update("lastName", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all" placeholder="Last name" required />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" id="email" value={formData.email} onChange={(e) => update("email", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all" placeholder="your@email.com" required />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" id="phone" value={formData.phone} onChange={(e) => update("phone", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all" placeholder="+233 ..." required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} id="password" value={formData.password} onChange={(e) => update("password", e.target.value)} className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all" placeholder="Password" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} id="confirm-password" value={formData.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all" placeholder="Re-enter" required minLength={6} />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input type="checkbox" checked={formData.terms} onChange={(e) => update("terms", e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy/20" required />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the <Link href="/about" className="font-medium text-navy hover:text-brand-orange transition-colors">Terms of Service</Link> and <Link href="/about" className="font-medium text-navy hover:text-brand-orange transition-colors">Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" disabled={isLoading} className="w-full py-2.5 mt-2 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-center text-sm text-slate-500 pt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-navy hover:text-brand-orange transition-colors">Log in</Link>
              </p>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-navy" />
              </div>
              <div className="inline-block px-4 py-2 rounded-md bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                {formData.email || "student@example.com"}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Please verify your email to continue. Click the link we sent to confirm and proceed to complete your student profile.
              </p>
              <button type="button" className="w-full py-2.5 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-light transition-colors">
                Continue to Profile &rarr;
              </button>
              <button type="button" className="text-xs font-medium text-slate-500 hover:text-navy transition-colors">
                Resend verification email
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
