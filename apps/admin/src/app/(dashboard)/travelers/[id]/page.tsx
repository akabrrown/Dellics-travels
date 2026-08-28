"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  Plane,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Award,
} from "lucide-react";

export default function TravelerDetail() {
  const params = useParams();
  const travelerId = typeof params?.id === "string" ? params.id : "TRV-102";

  const [tier, setTier] = useState("ELITE");
  const [points, setPoints] = useState(500);
  const [notes, setNotes] = useState<string[]>([
    "Frequent business traveler to Dubai and London.",
    "Prefers aisle seat and halal/kosher meal options.",
  ]);
  const [newNote, setNewNote] = useState("");
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote("");
  };

  const handleTierOverride = (newTier: string) => {
    setTier(newTier);
    setActionAlert(`Membership tier updated to ${newTier}. Synced to RewardsLedger.`);
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleResetPassword = () => {
    setActionAlert("Password reset link dispatched to traveler email.");
    setTimeout(() => setActionAlert(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <Link
          href="/travelers"
          className="text-xs font-semibold text-slate-500 hover:text-[#0A0060] mb-2 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Traveler Directory</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-[#0A0060] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
              KM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-slate-900">
                  Kwame Mensah
                </h1>
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                  {tier} MEMBER
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                ID: {travelerId} · kwame.m@example.com · +233 24 123 4567
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 text-xs transition-colors bg-white shadow-xs"
            >
              Reset Password
            </button>
            <button
              onClick={() => alert("Account suspension modal requires Super Admin reason logging.")}
              className="px-4 py-2 bg-rose-50 text-rose-700 font-bold rounded-full hover:bg-rose-100 text-xs transition-colors"
            >
              Suspend Account
            </button>
          </div>
        </div>
      </div>

      {actionAlert && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Passport & Travel Preferences */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Verified Passport & Preferences
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nationality</span>
                <p className="font-bold text-slate-800 mt-0.5">Ghanaian (GH)</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Passport Number</span>
                <p className="font-bold text-slate-800 font-mono mt-0.5">G2849102</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Expiry Date</span>
                <p className="font-bold text-slate-800 font-mono mt-0.5">2031-08-14</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Home Airport</span>
                <p className="font-bold text-slate-800 mt-0.5">ACC (Kotoka Intl)</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Seat Preference</span>
                <p className="font-bold text-slate-800 mt-0.5">Aisle</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Meal Preference</span>
                <p className="font-bold text-slate-800 mt-0.5">Standard</p>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Booking History & Reservations
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <Link href="/bookings/BK-8392" className="font-mono font-bold text-[#0A0060] hover:underline">
                    BK-8392
                  </Link>
                  <p className="text-slate-500 text-[11px]">Flight: ACC → DXB (Emirates)</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">GHS 2,150.00</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </div>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <Link href="/bookings/BK-8344" className="font-mono font-bold text-[#0A0060] hover:underline">
                    BK-8344
                  </Link>
                  <p className="text-slate-500 text-[11px]">Hotel: Radisson Blu Cape Town (4 Nights)</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">GHS 4,890.00</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Internal CRM Notes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Concierge Support Notes
            </h3>
            <div className="space-y-2.5">
              {notes.map((n, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  {n}
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add customer service note..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0A0060] text-white text-xs font-bold rounded-xl hover:bg-[#140882] transition-colors"
              >
                Save Note
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Tier Controls (1 col) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="size-4 text-[#F4740D]" />
              <h3 className="font-display font-bold text-sm text-slate-900">
                Membership Tier Override
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Content & Ops Admins can manually comp loyalty status. Writes are logged to A20 Audit Trail.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleTierOverride("EXPLORER")}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                  tier === "EXPLORER" ? "bg-[#0A0060] text-white border-[#0A0060]" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Explorer (Standard Tier)
              </button>
              <button
                type="button"
                onClick={() => handleTierOverride("VOYAGER")}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                  tier === "VOYAGER" ? "bg-[#0A0060] text-white border-[#0A0060]" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Voyager (Plus Member)
              </button>
              <button
                type="button"
                onClick={() => handleTierOverride("ELITE")}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                  tier === "ELITE" ? "bg-[#0A0060] text-white border-[#0A0060]" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Elite (VIP Member)
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-500 text-xs">Points Balance:</span>
              <p className="font-display font-extrabold text-slate-900 text-lg mt-0.5">
                {points.toLocaleString()} pts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
