"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface RefundItem {
  id: string;
  bookingId: string;
  traveler: string;
  email: string;
  tier: "Standard" | "Plus Member" | "Elite Member";
  category: "Flight" | "Hotel" | "eSIM" | "Tour Package";
  route: string;
  amountGHS: number;
  policyReason: string;
  requestedAt: string;
  status: "PENDING_AGENT" | "ESCALATED" | "APPROVED" | "DENIED";
}

export default function RefundQueue() {
  const [filter, setFilter] = useState<"ALL" | "PENDING_AGENT" | "ESCALATED">("ALL");
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [showDenyModal, setShowDenyModal] = useState(false);

  const [refunds, setRefunds] = useState<RefundItem[]>([
    {
      id: "REF-9021",
      bookingId: "BK-8392",
      traveler: "Kwame Mensah",
      email: "kwame.m@example.com",
      tier: "Elite Member",
      category: "Flight",
      route: "Emirates (ACC → DXB)",
      amountGHS: 2150.0,
      policyReason: "Traveler initiated cancellation within 24hr free cancellation window.",
      requestedAt: "14 mins ago",
      status: "ESCALATED", // > GHS 500 requires Ops/Super Admin approval
    },
    {
      id: "REF-9020",
      bookingId: "BK-8344",
      traveler: "Afia Osei",
      email: "afia.o@example.com",
      tier: "Plus Member",
      category: "Hotel",
      route: "Cape Town Radisson Blu 4 Nights",
      amountGHS: 4890.0,
      policyReason: "Carrier flight cancellation forced itinerary abort. Doctor note verified.",
      requestedAt: "42 mins ago",
      status: "ESCALATED",
    },
    {
      id: "REF-9019",
      bookingId: "BK-8290",
      traveler: "David Asante",
      email: "david.a@example.com",
      tier: "Standard",
      category: "eSIM",
      route: "Airalo 10GB Global Package",
      amountGHS: 380.0,
      policyReason: "Airalo profile provisioning failed after 3 auto-retries.",
      requestedAt: "1 hour ago",
      status: "PENDING_AGENT", // <= GHS 500 agent can approve directly
    },
  ]);

  const handleApprove = (id: string) => {
    setRefunds(
      refunds.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    alert(`Refund ${id} approved and dispatched via Stripe Refunds API.`);
  };

  const handleDeny = () => {
    if (!selectedRefund) return;
    setRefunds(
      refunds.map((r) =>
        r.id === selectedRefund.id ? { ...r, status: "DENIED" } : r
      )
    );
    setShowDenyModal(false);
    alert(`Refund denied. Notification sent to ${selectedRefund.traveler}.`);
  };

  const filtered = refunds.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Refund & Cancellation Approval Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review refund requests against fare policies and agent limits (Support Agent threshold: GHS 500).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          <div className="flex rounded-full bg-white border border-slate-200 p-1 shadow-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                filter === "ALL"
                  ? "bg-[#0A0060] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("PENDING_AGENT")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                filter === "PENDING_AGENT"
                  ? "bg-[#0A0060] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Agent Level (≤ GHS 500)
            </button>
            <button
              onClick={() => setFilter("ESCALATED")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                filter === "ESCALATED"
                  ? "bg-[#0A0060] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Escalated (&gt; GHS 500)
            </button>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Request / Booking</th>
              <th className="px-6 py-4">Traveler & Tier</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Policy Justification</th>
              <th className="px-6 py-4">Approval State</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-slate-900 block">
                    {item.id}
                  </span>
                  <Link
                    href={`/bookings/${item.bookingId}`}
                    className="text-[11px] font-semibold text-[#0A0060] hover:underline"
                  >
                    #{item.bookingId} · {item.category}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{item.traveler}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 inline-block mt-0.5">
                    {item.tier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-display text-sm font-extrabold text-slate-900">
                    GHS {item.amountGHS.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400">{item.requestedAt}</p>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {item.policyReason}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {item.status === "PENDING_AGENT" && (
                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                      Support Agent Action
                    </span>
                  )}
                  {item.status === "ESCALATED" && (
                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                      <AlertTriangle className="size-3" />
                      Escalated (&gt; GHS 500)
                    </span>
                  )}
                  {item.status === "APPROVED" && (
                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="size-3" />
                      Approved & Refunded
                    </span>
                  )}
                  {item.status === "DENIED" && (
                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-200 text-slate-700">
                      Denied
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {item.status !== "APPROVED" && item.status !== "DENIED" && (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRefund(item);
                          setShowDenyModal(true);
                        }}
                        className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-[11px] transition-colors"
                      >
                        Deny
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deny Reason Modal */}
      {showDenyModal && selectedRefund && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Deny Refund Request #{selectedRefund.id}
            </h3>
            <p className="text-xs text-slate-500">
              Please document the policy justification. This explanation will be sent to the traveler via in-app chat.
            </p>

            <textarea
              rows={4}
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              placeholder="e.g. Rate booked was explicitly non-refundable beyond the 24-hour cooling-off window..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDenyModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeny}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
