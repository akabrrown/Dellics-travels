"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Plane,
} from "lucide-react";
import { adminApi } from "@/lib/api";

function SetupAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!email || !token) {
    return (
      <div className="text-center space-y-4">
        <AlertCircle className="size-10 text-rose-500 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900">Invalid Link</h1>
        <p className="text-sm text-slate-500">
          This setup link is invalid or missing required parameters.
        </p>
      </div>
    );
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.post<{ status: string; message: string }>("/auth/admin/setup-account", {
        email,
        token,
        newPassword,
      });

      if (res.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to setup account.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <ShieldCheck className="size-16 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Setup Complete</h1>
        <p className="text-sm text-slate-500">
          Your password has been securely set. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-bold text-[#0A0060]">
          Set Your Password
        </h1>
        <p className="text-xs text-slate-500">
          Welcome, <strong>{email}</strong>. Please set a secure password for your administrative account.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSetup} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
            New Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type={showNew ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A0060]"
              placeholder="Minimum 8 characters"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A0060]"
              placeholder="Re-enter new password"
              minLength={8}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#0A0060] hover:bg-[#080050] text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
        >
          <KeyRound className="size-4" />
          <span>{loading ? "Setting up..." : "Save Password & Continue"}</span>
        </button>
      </form>
    </div>
  );
}

export default function SetupAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="flex justify-center mb-8">
          <div className="bg-[#0A0060] p-3 rounded-2xl">
            <Plane className="size-6 text-white rotate-45" />
          </div>
        </div>
        <Suspense fallback={<div className="text-center text-xs text-slate-500">Loading setup...</div>}>
          <SetupAccountForm />
        </Suspense>
      </div>
    </div>
  );
}
