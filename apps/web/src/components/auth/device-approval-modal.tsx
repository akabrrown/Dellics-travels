"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { ShieldAlert, CheckCircle, XCircle, Smartphone, MapPin, Globe, Clock } from "lucide-react";

interface PendingChallenge {
  id: string;
  challenge_token: string;
  device_name: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  verification_code: string;
  expires_at: string;
  created_at: string;
}

export function DeviceApprovalModal() {
  const { user } = useAuth();
  const [activeChallenge, setActiveChallenge] = useState<PendingChallenge | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Poll for incoming sign-in challenges on active account
  const checkPendingChallenges = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/auth/device/challenges/pending?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.challenges && data.challenges.length > 0) {
          setActiveChallenge(data.challenges[0]);
        } else {
          setActiveChallenge(null);
        }
      }
    } catch (err) {
      // Background listener error suppression
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    // Check immediately and poll every 4 seconds
    checkPendingChallenges();
    const interval = setInterval(checkPendingChallenges, 4000);
    return () => clearInterval(interval);
  }, [user?.id, checkPendingChallenges]);

  const handleDecision = async (decision: "APPROVE" | "DENY") => {
    if (!activeChallenge || isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/auth/device/challenges/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken: activeChallenge.challenge_token,
          decision,
          userId: user?.id,
        }),
      });

      if (res.ok) {
        setActionSuccess(
          decision === "APPROVE"
            ? "New device approved successfully!"
            : "Sign-in attempt was blocked and recorded."
        );
        setTimeout(() => {
          setActiveChallenge(null);
          setActionSuccess(null);
        }, 2000);
      }
    } catch (err) {
      console.error("Decision response failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeChallenge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-100">
        
        {/* Glow Header */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 px-6 py-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Trying to Sign In?
              </h3>
              <p className="text-xs text-amber-300/90 font-medium">
                Google & Telegram Style Device Security Prompt
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {actionSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <p className="text-base font-semibold text-white">{actionSuccess}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-300 leading-relaxed">
                A new sign-in attempt was detected for your account <strong className="text-amber-400">{user?.email}</strong>. If this is you, confirm the verification code below to authorize access.
              </p>

              {/* Verification Code Box */}
              {activeChallenge.verification_code && (
                <div className="flex items-center justify-between p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                  <div>
                    <span className="text-xs text-amber-300/80 uppercase tracking-wider font-semibold">
                      Matching Number
                    </span>
                    <p className="text-xs text-slate-400">
                      Matches the code shown on the new device
                    </p>
                  </div>
                  <div className="text-3xl font-black text-amber-400 tracking-wider font-mono bg-slate-900/80 px-4 py-1.5 rounded-lg border border-amber-500/40">
                    {activeChallenge.verification_code}
                  </div>
                </div>
              )}

              {/* Attempt Details */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">Device:</span>
                  <span className="truncate">{activeChallenge.device_name}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Location:</span>
                  <span>{activeChallenge.location || "Accra, Ghana"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold text-white">IP Address:</span>
                  <span className="font-mono text-slate-400">{activeChallenge.ip_address || "102.176.x.x"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="font-semibold text-white">Time:</span>
                  <span>Just now</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDecision("DENY")}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  No, It's Not Me
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision("APPROVE")}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Yes, It's Me
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
