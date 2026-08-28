"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserCheck, RefreshCw, Shield } from "lucide-react";
import { adminApi } from "@/lib/api";

interface TravelerUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  membershipTier: string;
  pointsBalance: number;
  nationality?: string | null;
  homeAirport?: string | null;
  passportNumber?: string | null;
  totalTrips: number;
  totalBookings: number;
  createdAt: string;
}

export default function TravelersList() {
  const [tierFilter, setTierFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<TravelerUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get<{ data: TravelerUser[] }>("/auth/admin/users");
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to load travelers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesTier = tierFilter === "ALL" || u.membershipTier === tierFilter;
    const matchesSearch =
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    return matchesTier && matchesSearch;
  });

  const getTierBadge = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "ELITE":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "VOYAGER":
      case "PLUS":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Traveler Directory & Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live client accounts, verified membership tiers, and passport verification records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Traveler Name, Email, or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">All Tiers</option>
            <option value="EXPLORER">Explorer (Standard)</option>
            <option value="VOYAGER">Voyager (Plus)</option>
            <option value="ELITE">Elite (VIP)</option>
          </select>
        </div>
      </div>

      {/* Travelers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Traveler Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Membership Tier</th>
                <th className="px-6 py-4">Points & Trips</th>
                <th className="px-6 py-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400">
                    Loading travelers from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <UserCheck className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No traveler accounts found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">New signups on Web or Mobile will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-medium">{user.email}</p>
                      <p className="text-[11px] text-slate-400">{user.phone || "No phone linked"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getTierBadge(user.membershipTier)}`}>
                        {user.membershipTier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{user.pointsBalance.toLocaleString()} pts</p>
                      <span className="text-[11px] text-slate-500">{user.totalTrips} trips · {user.totalBookings} bookings</span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
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
