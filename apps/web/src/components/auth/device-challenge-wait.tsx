"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";

interface DeviceChallengeWaitProps {
  challengeToken: string;
  verificationCode: string;
  primaryDeviceName: string;
  attemptedDevice: string;
  onApproved: (userData: any) => void;
  onCancelled: () => void;
}

export function DeviceChallengeWait({
  challengeToken,
  verificationCode,
  primaryDeviceName,
  onApproved,
  onCancelled,
}: DeviceChallengeWaitProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "DENIED" | "EXPIRED">("PENDING");

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll challenge status
  useEffect(() => {
    if (status !== "PENDING") return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/device/challenges/poll?token=${challengeToken}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "APPROVED") {
            setStatus("APPROVED");
            clearInterval(pollInterval);
            setTimeout(() => {
              onApproved(data.user);
            }, 1200);
          } else if (data.status === "DENIED") {
            setStatus("DENIED");
            clearInterval(pollInterval);
          } else if (data.status === "EXPIRED") {
            setStatus("EXPIRED");
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        // Poll retry
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [challengeToken, status, onApproved]);

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Animated Radar Shield */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        {status === "PENDING" && (
          <>
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-75" />
            <div className="absolute inset-2 rounded-full bg-amber-500/10 animate-pulse" />
          </>
        )}
        <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl ${
          status === "APPROVED"
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            : status === "DENIED" || status === "EXPIRED"
            ? "bg-red-500/20 text-red-400 border-red-500/40"
            : "bg-amber-500/20 text-amber-400 border-amber-500/40"
        }`}>
          {status === "APPROVED" ? (
            <CheckCircle2 className="w-9 h-9 animate-bounce text-emerald-400" />
          ) : status === "DENIED" || status === "EXPIRED" ? (
            <XCircle className="w-9 h-9 text-red-400" />
          ) : (
            <ShieldCheck className="w-9 h-9 animate-pulse" />
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {status === "APPROVED"
            ? "Access Approved!"
            : status === "DENIED"
            ? "Sign-In Denied"
            : status === "EXPIRED"
            ? "Request Expired"
            : "Check Your Main Device"}
        </h2>
        <p className="text-sm text-slate-400">
          {status === "APPROVED"
            ? "Your identity was confirmed. Unlocking your account..."
            : status === "DENIED"
            ? "This sign-in attempt was rejected by your primary device."
            : status === "EXPIRED"
            ? "The verification request timed out. Please try signing in again."
            : `A verification prompt was sent to your active device (${primaryDeviceName}).`}
        </p>
      </div>

      {/* 2-Digit Verification Code Banner (Google Style) */}
      {status === "PENDING" && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <span className="text-xs text-amber-400/90 font-semibold tracking-wider uppercase">
            Confirmation Number
          </span>
          <div className="text-4xl font-black text-amber-400 font-mono tracking-widest">
            {verificationCode}
          </div>
          <p className="text-xs text-slate-400">
            Confirm this exact number on your other device
          </p>
        </div>
      )}

      {/* Progress & Countdown */}
      {status === "PENDING" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              Waiting for approval...
            </span>
            <span className="font-mono text-amber-400 font-bold">{formatMinutes(timeLeft)}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(timeLeft / 300) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onCancelled}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Cancel and return to sign in
        </button>
      </div>
    </div>
  );
}
