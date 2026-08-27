"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

export default function RolesAndTeam() {
  const [inviteModal, setInviteModal] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedRole, setInvitedRole] = useState("SUPPORT_AGENT");

  const TEAM_MEMBERS = [
    {
      id: "ADM-001",
      name: "Kwabena Osei",
      email: "kwabena.o@dellicstravels.com",
      role: "Super Admin",
      roleBadge: "bg-purple-100 text-purple-800",
      status: "Active",
      totpEnrolled: true,
      lastLogin: "10 mins ago",
    },
    {
      id: "ADM-002",
      name: "Akosua Mensah",
      email: "akosua.m@dellicstravels.com",
      role: "Content/Ops Admin",
      roleBadge: "bg-blue-100 text-blue-800",
      status: "Active",
      totpEnrolled: true,
      lastLogin: "2 hours ago",
    },
    {
      id: "ADM-003",
      name: "Emmanuel Tetteh",
      email: "emmanuel.t@dellicstravels.com",
      role: "Support Agent",
      roleBadge: "bg-slate-100 text-slate-800",
      status: "Active",
      totpEnrolled: true,
      lastLogin: "Yesterday",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Roles & Team Access Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage admin invitations, 2FA security enforcement, and role-scoped permissions.
          </p>
        </div>
        <button
          onClick={() => setInviteModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <UserPlus className="size-3.5" />
          <span>Invite Admin User</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-slate-900">
            Active Team Members (3)
          </h3>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="size-3.5" />
            100% 2FA Enforced
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Admin User</th>
              <th className="px-6 py-4">Role & Scope</th>
              <th className="px-6 py-4">2FA Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TEAM_MEMBERS.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{member.name}</p>
                      <p className="text-slate-500 text-[11px]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${member.roleBadge}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                    <CheckCircle2 className="size-3.5" />
                    Enrolled (TOTP)
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">
                  {member.lastLogin}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-xs font-semibold text-[#0A0060] hover:underline">
                    Edit Role
                  </button>
                  <span className="text-slate-300">·</span>
                  <button className="text-xs font-semibold text-rose-600 hover:underline">
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix Card (Documentation Section 3) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-display text-sm font-bold text-slate-900">
            Permission Matrix by Role
          </h3>
          <p className="text-[11px] text-slate-500">
            Role-gated scope enforced at NestJS JWT strategy and Row-Level Security layer.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-100 rounded-xl">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3 border-b border-slate-100">Capability Area</th>
                <th className="p-3 border-b border-slate-100 text-center">Support Agent</th>
                <th className="p-3 border-b border-slate-100 text-center">Content/Ops Admin</th>
                <th className="p-3 border-b border-slate-100 text-center">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Refunds Approval</td>
                <td className="p-3 text-center text-slate-600">≤ GHS 500 auto</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Full Access</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Package & Content Publishing</td>
                <td className="p-3 text-center text-slate-300">—</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Draft / Publish</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Full Access</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Support Ticket Queue & Chat</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Claim / Reply</td>
                <td className="p-3 text-center text-slate-600">View Only</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Full Access</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Financial Ledger & Payouts</td>
                <td className="p-3 text-center text-slate-300">—</td>
                <td className="p-3 text-center text-slate-600">View Only</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Full Access</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Team & Role Management</td>
                <td className="p-3 text-center text-slate-300">—</td>
                <td className="p-3 text-center text-slate-300">—</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Invite / Revoke</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Invite New Admin Team Member
            </h3>
            <p className="text-xs text-slate-500">
              An invitation email with a secure setup token will be sent. 2FA enrollment is mandatory before first login.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={invitedEmail}
                  onChange={(e) => setInvitedEmail(e.target.value)}
                  placeholder="colleague@dellicstravels.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Assign Role
                </label>
                <select
                  value={invitedRole}
                  onChange={(e) => setInvitedRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                >
                  <option value="SUPPORT_AGENT">Support Agent</option>
                  <option value="CONTENT_OPS">Content/Ops Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setInviteModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Invitation sent to ${invitedEmail}`);
                  setInviteModal(false);
                }}
                className="px-4 py-2 rounded-full bg-[#0A0060] text-white text-xs font-bold hover:bg-[#140882]"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
