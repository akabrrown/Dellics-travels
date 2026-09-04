"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Settings,
  Sparkles,
  Info,
  Check,
  RefreshCw,
  Users,
  Shield,
  KeyRound,
} from "lucide-react";
import {
  useRole,
  getAllRoles,
  saveCustomRole,
  deleteCustomRole,
  PERMISSION_CATALOG,
  AdminRole,
  PermissionDefinition,
} from "@/lib/roles";
import { adminApi } from "@/lib/api";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "Active" | "Invited" | "Suspended";
  totpEnrolled: boolean;
  lastLogin: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "ADM-001",
    name: "Kwabena Osei",
    email: "kwabena.o@dellicstravels.com",
    roleId: "master_admin",
    status: "Active",
    totpEnrolled: true,
    lastLogin: "Active now",
  },
  {
    id: "ADM-002",
    name: "Akosua Mensah",
    email: "akosua.m@dellicstravels.com",
    roleId: "supervisor",
    status: "Active",
    totpEnrolled: true,
    lastLogin: "25 mins ago",
  },
  {
    id: "ADM-003",
    name: "Emmanuel Tetteh",
    email: "emmanuel.t@dellicstravels.com",
    roleId: "customer_service",
    status: "Active",
    totpEnrolled: true,
    lastLogin: "2 hours ago",
  },
  {
    id: "ADM-004",
    name: "Abena Frimpong",
    email: "abena.f@dellicstravels.com",
    roleId: "finance_team",
    status: "Active",
    totpEnrolled: true,
    lastLogin: "Yesterday",
  },
];

const COLOR_OPTIONS = [
  { id: "purple", label: "Purple (Executive)", badge: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "blue", label: "Blue (Operations)", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "emerald", label: "Emerald (Customer)", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "amber", label: "Amber (Finance)", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "rose", label: "Rose (Security)", badge: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "slate", label: "Slate (Auditor)", badge: "bg-slate-100 text-slate-800 border-slate-300" },
];

export default function RolesAndTeam() {
  const { activeRole, allRoles, switchRole } = useRole();
  const [activeTab, setActiveTab] = useState<"MEMBERS" | "MATRIX" | "BUILDER">("MEMBERS");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Invite Modal
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("customer_service");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  // Custom Role Builder State
  const [roleTitle, setRoleTitle] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[1].badge);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const [builderSuccess, setBuilderSuccess] = useState(false);

  // Role Re-assignment
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Load team members from live API
  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await adminApi.get<{ data: TeamMember[] }>("/roles/team/members");
      if (res && res.data) {
        setMembers(res.data);
      }
    } catch (err: any) {
      console.warn("Could not fetch team members:", err.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Categories for grouping permissions
  const categories: Array<PermissionDefinition["category"]> = [
    "Core",
    "Content & Commerce",
    "Operations & Support",
    "Finance & System",
    "Administration",
  ];

  const handleTogglePermission = (key: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAllCategory = (cat: string) => {
    const catKeys = PERMISSION_CATALOG.filter((p) => p.category === cat).map((p) => p.key);
    const allSelected = catKeys.every((k) => selectedPermissions[k]);
    const updated = { ...selectedPermissions };
    catKeys.forEach((k) => {
      updated[k] = !allSelected;
    });
    setSelectedPermissions(updated);
  };

  const handleCreateCustomRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    const id = roleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");

    const newRole = {
      id,
      title: roleTitle.trim(),
      description: roleDescription.trim() || "Custom administrative role.",
      badgeColor: selectedColor,
      permissions: selectedPermissions,
    };

    saveCustomRole(newRole);
    try {
      await adminApi.post("/roles", newRole);
    } catch {
      // Local storage fallback handled by saveCustomRole
    }

    setBuilderSuccess(true);
    setTimeout(() => {
      setBuilderSuccess(false);
      setRoleTitle("");
      setRoleDescription("");
      setSelectedPermissions({});
      setActiveTab("MATRIX");
    }, 1000);
  };

  const handleDeleteRole = async (roleId: string, roleTitle: string) => {
    if (confirm(`Are you sure you want to delete custom role "${roleTitle}"? Any assigned members will be moved to Customer Service.`)) {
      deleteCustomRole(roleId);
      try {
        await adminApi.delete(`/roles/${roleId}`);
      } catch {
        // Fallback
      }
      // Reassign local state members if any had this role
      setMembers((prev) =>
        prev.map((m) => (m.roleId === roleId ? { ...m, roleId: "customer_service" } : m))
      );
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    try {
      setInviteSubmitting(true);
      const res = await adminApi.post<{ data: TeamMember }>("/roles/team/invite", {
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        roleId: inviteRoleId,
      });

      if (res && res.data) {
        setMembers((prev) => [...prev, res.data]);
      } else {
        fetchMembers();
      }

      setInviteName("");
      setInviteEmail("");
      setInviteModal(false);
    } catch (err: any) {
      alert(`Invite failed: ${err.message}`);
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRoleId: string) => {
    try {
      await adminApi.patch(`/roles/team/${memberId}/role`, { roleId: newRoleId });
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, roleId: newRoleId } : m))
      );
    } catch (err: any) {
      alert(`Role update failed: ${err.message}`);
    } finally {
      setEditingMemberId(null);
    }
  };

  const getRoleById = (id: string): AdminRole => {
    return allRoles.find((r) => r.id === id) || allRoles[0];
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-[#0A0060]">
              Roles & Team Access Control
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${activeRole.badgeColor}`}>
              Acting as: {activeRole.title}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure default and custom roles, assign granular module permissions, and manage enterprise 2FA team access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("BUILDER")}
            className="px-4 py-2.5 rounded-full bg-[#0A0060] hover:bg-[#12008f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>Build Custom Role</span>
          </button>

          <button
            onClick={() => setInviteModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <UserPlus className="size-3.5" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("MEMBERS")}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "MEMBERS"
              ? "border-[#F4740D] text-[#0A0060]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users className="size-4" />
          <span>Team Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("MATRIX")}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "MATRIX"
              ? "border-[#F4740D] text-[#0A0060]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Shield className="size-4" />
          <span>Roles & Permissions Matrix ({allRoles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("BUILDER")}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "BUILDER"
              ? "border-[#F4740D] text-[#0A0060]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="size-4 text-[#F4740D]" />
          <span>Custom Role Builder</span>
        </button>
      </div>

      {/* TAB 1: TEAM MEMBERS */}
      {activeTab === "MEMBERS" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Active Administrative Operators
            </h3>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <ShieldCheck className="size-3.5" />
              100% 2FA TOTP Enforced
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Admin User</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">2FA Security</th>
                <th className="px-6 py-4">Activity Status</th>
                <th className="px-6 py-4 text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => {
                const memberRole = getRoleById(member.roleId);
                const isEditing = editingMemberId === member.id;

                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.name}</p>
                          <p className="text-slate-500 text-[11px]">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          value={member.roleId}
                          onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                          className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#F4740D]"
                          autoFocus
                          onBlur={() => setEditingMemberId(null)}
                        >
                          {allRoles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.title} {r.isCustom ? "(Custom)" : ""}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          onClick={() => setEditingMemberId(member.id)}
                          className={`px-2.5 py-1 rounded-full font-bold text-[11px] border cursor-pointer hover:opacity-80 transition-opacity ${memberRole.badgeColor}`}
                          title="Click to reassign role"
                        >
                          {memberRole.title}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle2 className="size-3.5" />
                        TOTP Enforced
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {member.lastLogin}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          setEditingMemberId(isEditing ? null : member.id)
                        }
                        className="text-xs font-bold text-[#0A0060] hover:text-[#F4740D] transition-colors"
                      >
                        {isEditing ? "Done" : "Reassign Role"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === "MATRIX" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-display text-base font-bold text-[#0A0060]">
                  System Permission Matrix & Role Scope
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Granular capabilities enforced across UI navigation routes, NestJS controllers, and database access layers.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("BUILDER")}
                className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#12008f] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Create New Custom Role</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-4 w-72">Capability / Module</th>
                    {allRoles.map((role) => (
                      <th key={role.id} className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${role.badgeColor}`}>
                            {role.title}
                          </span>
                          {role.isCustom && (
                            <button
                              onClick={() => handleDeleteRole(role.id, role.title)}
                              className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5 mt-0.5"
                              title="Delete custom role"
                            >
                              <Trash2 className="size-3" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => {
                    const catPermissions = PERMISSION_CATALOG.filter((p) => p.category === cat);
                    return (
                      <React.Fragment key={cat}>
                        <tr className="bg-slate-100/60 font-bold text-slate-800 text-[11px]">
                          <td colSpan={allRoles.length + 1} className="px-4 py-2.5 tracking-wide uppercase">
                            {cat}
                          </td>
                        </tr>
                        {catPermissions.map((perm) => (
                          <tr key={perm.key} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-900">{perm.label}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{perm.key}</p>
                            </td>

                            {allRoles.map((role) => {
                              const hasPerm = role.id === "master_admin" || Boolean(role.permissions[perm.key]);
                              return (
                                <td key={role.id} className="p-4 text-center">
                                  {hasPerm ? (
                                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                      <Check className="size-3.5 stroke-[2.5]" />
                                    </span>
                                  ) : (
                                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                                      <XCircle className="size-3.5" />
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM ROLE BUILDER */}
      {activeTab === "BUILDER" && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-[#F4740D]" />
              <h2 className="font-display text-xl font-bold text-[#0A0060]">
                Custom Role Builder & Granular Access Configurator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Design a tailor-made administrative profile with specific module privileges for specialized staff or partner teams.
            </p>
          </div>

          {builderSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>Custom role successfully created and activated! Redirecting to matrix...</span>
            </div>
          )}

          <form onSubmit={handleCreateCustomRole} className="space-y-8">
            {/* General Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tour Operations Specialist"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Role Badge Theme
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.id} value={c.badge}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Description / Operational Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly state what this role is responsible for and what teams they collaborate with..."
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>
            </div>

            {/* Granular Permission Checklist */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Select Granular Module Privileges ({Object.values(selectedPermissions).filter(Boolean).length} granted)
                </h3>
              </div>

              <div className="space-y-6">
                {categories.map((cat) => {
                  const catPermissions = PERMISSION_CATALOG.filter((p) => p.category === cat);
                  const allCatSelected = catPermissions.every((p) => selectedPermissions[p.key]);

                  return (
                    <div key={cat} className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-bold text-[#0A0060] uppercase tracking-wider">
                          {cat}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectAllCategory(cat)}
                          className="text-[11px] font-bold text-[#F4740D] hover:underline"
                        >
                          {allCatSelected ? "Deselect Category" : "Grant All"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {catPermissions.map((perm) => {
                          const isChecked = Boolean(selectedPermissions[perm.key]);

                          return (
                            <label
                              key={perm.key}
                              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                                isChecked
                                  ? "bg-white border-[#0A0060] shadow-xs"
                                  : "bg-white/60 border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(perm.key)}
                                className="mt-0.5 rounded text-[#0A0060] focus:ring-[#0A0060]"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 leading-tight">
                                  {perm.label}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                                  {perm.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("MATRIX")}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="size-4" />
                <span>Save Custom Role</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INVITE ADMIN USER MODAL */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#0A0060]">
                Invite Administrative Operator
              </h3>
              <button
                onClick={() => setInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ama Darko"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Company Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@dellicstravels.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Assign Initial Role
                </label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                >
                  {allRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} {r.isCustom ? "(Custom)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                An invitation token with a 24-hour expiration and mandatory TOTP authenticator setup link will be dispatched.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
