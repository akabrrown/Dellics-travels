"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plane,
  Building2,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  CheckCircle2,
  Mail,
  RotateCcw,
  Clock,
} from "lucide-react";

export default function BookingDetail() {
  const params = useParams();
  const bookingId = typeof params?.id === "string" ? params.id : "BK-8392";

  const [notes, setNotes] = useState<string[]>([
    "Traveler requested aisle seating on Emirates leg.",
    "Paystack payment verified and ticket issued automatically.",
  ]);
  const [newNote, setNewNote] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote("");
  };

  const handleResendConfirmation = () => {
    setActionMessage("Confirmation itinerary & e-ticket resent to traveler email.");
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header & Breadcrumb */}
      <div>
        <Link
          href="/bookings"
          className="text-xs font-semibold text-slate-500 hover:text-[#0A0060] mb-2 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Bookings Ledger</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-[#0A0060]">
                Booking #{bookingId}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                CONFIRMED
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Flight Reservation (ACC → DXB) · Duffel GDS Ticketed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResendConfirmation}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 text-xs transition-colors bg-white shadow-xs"
            >
              Resend Confirmation
            </button>
            <Link
              href={`/refunds?id=${bookingId}`}
              className="px-4 py-2 bg-rose-50 text-rose-700 font-bold rounded-full hover:bg-rose-100 text-xs transition-colors"
            >
              Issue Refund
            </Link>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Status Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="font-display font-bold text-sm text-slate-900 mb-4">
          Lifecycle Progression
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            <span className="block text-[10px] text-emerald-600 uppercase">Step 1</span>
            1. Held & Locked
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            <span className="block text-[10px] text-emerald-600 uppercase">Step 2</span>
            2. Paystack Settled
          </div>
          <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-xs">
            <span className="block text-[10px] text-emerald-200 uppercase">Step 3</span>
            3. Ticket Issued
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 font-medium">
            <span className="block text-[10px] text-slate-400 uppercase">Step 4</span>
            4. Trip Completed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itinerary Details Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plane className="size-4 text-[#0A0060]" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Flight Itinerary & PNR
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-[#0A0060]">PNR: 7F9K2A</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900">Emirates · Flight EK 788</p>
                  <p className="text-xs text-slate-500">Boeing 777-300ER · Economy Flex Plus</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Confirmed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">ACC (Accra)</p>
                  <p className="text-slate-500 text-[11px]">Kotoka Intl Airport</p>
                  <p className="text-slate-400 font-mono text-[10px] mt-0.5">Oct 18, 2026 · 17:50</p>
                </div>
                <div className="text-center px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Non-Stop</span>
                  <div className="w-20 h-px bg-slate-300 my-1 mx-auto" />
                  <span className="text-[10px] text-slate-500 font-medium">8h 40m</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">DXB (Dubai)</p>
                  <p className="text-slate-500 text-[11px]">Dubai Intl Airport</p>
                  <p className="text-slate-400 font-mono text-[10px] mt-0.5">Oct 19, 2026 · 06:30 (+1)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Internal Ops Notes & Audit Trail
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
                placeholder="Add internal note..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0A0060] text-white text-xs font-bold rounded-xl hover:bg-[#140882] transition-colors"
              >
                Post Note
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-6">
          {/* Traveler Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Traveler Profile
            </h3>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                KM
              </div>
              <div>
                <Link
                  href="/travelers/TRV-102"
                  className="font-bold text-xs text-slate-900 hover:text-[#0A0060] hover:underline"
                >
                  Kwame Mensah
                </Link>
                <p className="text-[11px] text-slate-500">kwame.m@example.com</p>
                <p className="text-[10px] text-slate-400 font-mono">+233 24 123 4567</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Membership Tier:</span>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                Elite VIP
              </span>
            </div>
          </div>

          {/* Payment & Settlement */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Financial Settlement
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Fare:</span>
                <span className="font-semibold text-slate-900">GHS 1,850.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Taxes & Carrier Fees:</span>
                <span className="font-semibold text-slate-900">GHS 300.00</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <span className="font-bold text-slate-900">Total Paid:</span>
                <span className="font-display font-extrabold text-[#0A0060] text-sm">GHS 2,150.00</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
              ✓ Paystack Reference: T9928172648 (Settled)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
