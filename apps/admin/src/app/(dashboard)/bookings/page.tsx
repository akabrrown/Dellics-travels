"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Plane,
  Building2,
  Smartphone,
  MapPin,
  RefreshCw,
  CalendarCheck,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface BookingItem {
  id: string;
  type: string;
  status: string;
  supplierRef?: string | null;
  travelerName: string;
  travelerEmail: string;
  travelerPhone?: string;
  membershipTier: string;
  tripTitle: string;
  createdAt: string;
  paymentStatus: string;
  paymentReference?: string | null;
  amount: number;
  currency: string;
}

const PIPELINE_STATUSES = [
  { key: "ALL", label: "All Bookings" },
  { key: "HELD", label: "Held" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function BookingsList() {
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (activeStatus !== "ALL") queryParams.append("status", activeStatus);
      if (selectedType !== "ALL") queryParams.append("type", selectedType);
      if (search.trim()) queryParams.append("search", search.trim());
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/booking/admin/all?${queryString}` : "/booking/admin/all";
      const res = await adminApi.get<{ data: BookingItem[] }>(endpoint);
      if (res && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch live bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchBookings();
    });
  }, [activeStatus, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const getProductIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "FLIGHT":
        return <Plane className="size-3.5 text-[#0A0060]" />;
      case "HOTEL":
        return <Building2 className="size-3.5 text-blue-600" />;
      case "PACKAGE":
        return <MapPin className="size-3.5 text-emerald-600" />;
      default:
        return <Smartphone className="size-3.5 text-[#F4740D]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "HELD":
        return "bg-amber-100 text-amber-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Bookings Pipeline & Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live database sync for multi-supplier reservations (Duffel flights, RateHawk hotels, Airalo eSIMs, tours).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchBookings}
            className="px-3.5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/inquire"
            className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 w-fit"
          >
            <span>Create Offline Booking</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Pipeline Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PIPELINE_STATUSES.map((status) => (
          <button
            key={status.key}
            onClick={() => setActiveStatus(status.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeStatus === status.key
                ? "bg-[#0A0060] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{status.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Dropdown Filters */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Traveler Name, Booking ID, Reference, or Email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="FLIGHT">Flights (Duffel)</option>
            <option value="HOTEL">Hotels (RateHawk)</option>
            <option value="PACKAGE">Tour Packages</option>
            <option value="ESIM">eSIMs (Airalo)</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#0A0060] text-white text-xs font-bold rounded-xl hover:bg-[#140882] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Booking Reference</th>
                <th className="px-6 py-4">Traveler & Contact</th>
                <th className="px-6 py-4">Product Category</th>
                <th className="px-6 py-4">Gross Amount</th>
                <th className="px-6 py-4">Pipeline Status</th>
                <th className="px-6 py-4 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    Loading live bookings from database...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <CalendarCheck className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No bookings match the selected criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">New reservations through Web or Mobile will sync here instantly.</p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#0A0060] block">
                        {booking.id.slice(0, 8).toUpperCase()}
                      </span>
                      {booking.supplierRef && (
                        <span className="text-[10px] text-slate-400">Ref: {booking.supplierRef}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{booking.travelerName}</p>
                      <span className="text-[10px] text-slate-500 block">{booking.travelerEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        {getProductIcon(booking.type)}
                        <span>{booking.tripTitle || booking.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-display font-extrabold text-slate-900">
                        {booking.currency} {booking.amount > 0 ? booking.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "Included"}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {booking.paymentReference ? booking.paymentReference.slice(0, 10) + "..." : booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-[11px]">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
