"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface ReviewItem {
  id: string;
  bookingId: string;
  bookingType: string;
  travelerName: string;
  travelerEmail: string;
  rating: number;
  text: string;
  target: string;
  status: "APPROVED" | "PENDING" | "FLAGGED";
  verifiedStay: boolean;
  createdAt: string;
}

export default function ReviewsModeration() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (filter !== "ALL") params.status = filter;
      if (search.trim()) params.search = search.trim();
      const query = Object.keys(params).length
        ? `?${new URLSearchParams(params).toString()}`
        : "";

      const res = await adminApi.get<{ data: ReviewItem[] }>(`/reviews/admin/all${query}`);
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load client reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleModerate = async (id: string, newStatus: "APPROVED" | "FLAGGED") => {
    try {
      setActionLoading(id);
      await adminApi.patch(`/reviews/admin/${id}/status`, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      alert(`Moderation failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Approved & Live
          </span>
        );
      case "FLAGGED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
            Flagged / Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            Pending Moderation
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Verified Reviews & Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Community ratings and traveler feedback moderation for flights, hotels, and holiday packages.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <XCircle className="size-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by property, traveler, or booking ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Status: All Reviews</option>
          <option value="PENDING">Status: Pending Moderation</option>
          <option value="APPROVED">Status: Approved & Live</option>
          <option value="FLAGGED">Status: Flagged / Rejected</option>
        </select>
      </form>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {loading && (
          <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="size-6 animate-spin text-[#0A0060]" />
            <span>Loading reviews from database...</span>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <p className="font-bold text-slate-900 text-sm">No reviews found</p>
            <p className="text-xs text-slate-500">
              {filter !== "ALL"
                ? `There are currently no reviews matching filter: ${filter}.`
                : "No customer testimonials have been recorded in the database yet."}
            </p>
          </div>
        )}

        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {rev.travelerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "TR"}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{rev.travelerName}</p>
                  <p className="text-[11px] text-slate-500">
                    Booking #{rev.bookingId.slice(0, 8)} · {rev.verifiedStay ? "Verified Stay" : "Traveler"} ·{" "}
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#0A0060] text-white flex items-center gap-1">
                  <Star className="size-3 fill-[#F4740D] text-[#F4740D]" />
                  <span>{rev.rating}.0 / 10</span>
                </span>
                {getStatusBadge(rev.status)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-xs text-slate-900 mb-1">
                Target: {rev.target}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                "{rev.text}"
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => handleModerate(rev.id, "FLAGGED")}
                disabled={actionLoading === rev.id || rev.status === "FLAGGED"}
                className="px-4 py-2 rounded-full border border-slate-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 text-xs font-bold transition-colors"
              >
                {actionLoading === rev.id ? "Updating..." : "Reject / Flag"}
              </button>
              <button
                onClick={() => handleModerate(rev.id, "APPROVED")}
                disabled={actionLoading === rev.id || rev.status === "APPROVED"}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
              >
                {actionLoading === rev.id ? "Updating..." : "Approve & Publish"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
