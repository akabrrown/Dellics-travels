"use client";

import { useEffect, useState } from "react";

export interface PermissionDefinition {
  key: string;
  label: string;
  category: "Core" | "Content & Commerce" | "Operations & Support" | "Finance & System" | "Administration";
  description: string;
}

export interface AdminRole {
  id: string;
  title: string;
  description: string;
  badgeColor: string;
  isCustom: boolean;
  permissions: Record<string, boolean>;
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  // Core
  { key: "dashboard.view", label: "Executive Dashboard", category: "Core", description: "Access top-level KPI metrics, revenue charts, and operational summary." },
  { key: "bookings.view", label: "View Bookings Hub", category: "Core", description: "Inspect flight, hotel, tour, and package reservations." },
  { key: "bookings.manage", label: "Manage & Override Bookings", category: "Core", description: "Manually confirm, modify, or cancel reservations." },
  { key: "travelers.view", label: "View Traveler Profiles", category: "Core", description: "Read traveler history, passport numbers, and preferences." },
  { key: "travelers.manage", label: "Manage Traveler Profiles", category: "Core", description: "Edit customer profile data and loyalty status." },

  // Content & Commerce
  { key: "content.view", label: "View Packages & Destinations", category: "Content & Commerce", description: "Browse curated holiday packages and tour catalog." },
  { key: "content.create", label: "Create & Design Packages", category: "Content & Commerce", description: "Design custom tours, day itineraries, and components." },
  { key: "content.publish", label: "Publish Packages Live", category: "Content & Commerce", description: "Push holiday packages to the public website." },
  { key: "content.delete", label: "Delete Packages", category: "Content & Commerce", description: "Remove tour packages from catalog." },
  { key: "promotions.manage", label: "Manage Promo Codes", category: "Content & Commerce", description: "Create and activate seasonal discount codes." },
  { key: "esims.view", label: "View eSIM Orders", category: "Content & Commerce", description: "Check Airalo eSIM order statuses and ICCIDs." },
  { key: "esims.manage", label: "Reprovision eSIM Orders", category: "Content & Commerce", description: "Manually trigger eSIM profile resends." },

  // Operations & Support
  { key: "support.view", label: "View Support Inquiries", category: "Operations & Support", description: "Read client inquiries and message threads." },
  { key: "support.reply", label: "Respond to Inquiries", category: "Operations & Support", description: "Send official customer responses and quotes." },
  { key: "reviews.manage", label: "Moderate Reviews", category: "Operations & Support", description: "Approve, feature, or reject client testimonials." },

  // Finance & System
  { key: "finance.view", label: "View Finance & Reconciliation", category: "Finance & System", description: "Inspect Paystack transactions, settlement ledger, and gross revenue." },
  { key: "finance.export", label: "Export Financial Reports", category: "Finance & System", description: "Download CSV audit reports and tax statements." },
  { key: "refunds.view", label: "View Refund Queue", category: "Finance & System", description: "Read pending refund requests." },
  { key: "refunds.approve", label: "Approve Refunds", category: "Finance & System", description: "Trigger Paystack merchant refund settlements." },
  { key: "health.view", label: "View Supplier Health", category: "Finance & System", description: "Monitor live latency of GDS, RateHawk, Airalo, and Paystack." },
  { key: "analytics.view", label: "View Analytics & BI", category: "Finance & System", description: "Inspect conversion funnels and cohort metrics." },

  // Administration
  { key: "membership.manage", label: "Manage Voyager Club", category: "Administration", description: "Grant points, adjust membership tiers." },
  { key: "team.view", label: "View Team & Roles", category: "Administration", description: "See admin team member list." },
  { key: "team.manage_roles", label: "Assign & Invite Users", category: "Administration", description: "Send admin invitations and change user roles." },
  { key: "team.custom_roles", label: "Manage Custom Roles", category: "Administration", description: "Create, edit, and delete custom role definitions." },
  { key: "audit.view", label: "View Audit Log", category: "Administration", description: "Read immutable timeline of sensitive admin actions." },
  { key: "settings.manage", label: "Manage Security Settings", category: "Administration", description: "Configure 2FA policy, API keys, and company profile." },
];

export const DEFAULT_ROLES: AdminRole[] = [
  {
    id: "master_admin",
    title: "Master Admin",
    description: "Unrestricted root access to all system modules, finances, custom roles, and security policies.",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    isCustom: false,
    permissions: PERMISSION_CATALOG.reduce((acc, p) => ({ ...acc, [p.key]: true }), {}),
  },
  {
    id: "supervisor",
    title: "Operations Supervisor",
    description: "Operational team lead: oversees bookings, publishes tours/content, manages customer escalations and reviews.",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    isCustom: false,
    permissions: {
      "dashboard.view": true,
      "bookings.view": true,
      "bookings.manage": true,
      "travelers.view": true,
      "travelers.manage": true,
      "content.view": true,
      "content.create": true,
      "content.publish": true,
      "content.delete": false,
      "promotions.manage": true,
      "esims.view": true,
      "esims.manage": true,
      "support.view": true,
      "support.reply": true,
      "reviews.manage": true,
      "finance.view": false,
      "finance.export": false,
      "refunds.view": true,
      "refunds.approve": false,
      "health.view": true,
      "analytics.view": true,
      "membership.manage": true,
      "team.view": true,
      "team.manage_roles": false,
      "team.custom_roles": false,
      "audit.view": false,
      "settings.manage": false,
    },
  },
  {
    id: "customer_service",
    title: "Customer Service",
    description: "Client front desk: manages support inquiries, traveler bookings assistance, review responses, and eSIM delivery.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    isCustom: false,
    permissions: {
      "dashboard.view": true,
      "bookings.view": true,
      "bookings.manage": false,
      "travelers.view": true,
      "travelers.manage": false,
      "content.view": false,
      "content.create": false,
      "content.publish": false,
      "content.delete": false,
      "promotions.manage": false,
      "esims.view": true,
      "esims.manage": false,
      "support.view": true,
      "support.reply": true,
      "reviews.manage": true,
      "finance.view": false,
      "finance.export": false,
      "refunds.view": true,
      "refunds.approve": false,
      "health.view": false,
      "analytics.view": false,
      "membership.manage": false,
      "team.view": false,
      "team.manage_roles": false,
      "team.custom_roles": false,
      "audit.view": false,
      "settings.manage": false,
    },
  },
  {
    id: "finance_team",
    title: "Finance Team",
    description: "Accounting specialist: manages Paystack reconciliations, payment settlements, refunds queue, and revenue reports.",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    isCustom: false,
    permissions: {
      "dashboard.view": true,
      "bookings.view": true,
      "bookings.manage": false,
      "travelers.view": false,
      "travelers.manage": false,
      "content.view": false,
      "content.create": false,
      "content.publish": false,
      "content.delete": false,
      "promotions.manage": false,
      "esims.view": false,
      "esims.manage": false,
      "support.view": false,
      "support.reply": false,
      "reviews.manage": false,
      "finance.view": true,
      "finance.export": true,
      "refunds.view": true,
      "refunds.approve": true,
      "health.view": false,
      "analytics.view": true,
      "membership.manage": false,
      "team.view": false,
      "team.manage_roles": false,
      "team.custom_roles": false,
      "audit.view": false,
      "settings.manage": false,
    },
  },
];

const STORAGE_KEY_ACTIVE_ROLE = "dellics_active_role_id";
const STORAGE_KEY_CUSTOM_ROLES = "dellics_custom_roles_v1";

export function getAllRoles(): AdminRole[] {
  if (typeof window === "undefined") return DEFAULT_ROLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_ROLES);
    const customRoles: AdminRole[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_ROLES, ...customRoles];
  } catch {
    return DEFAULT_ROLES;
  }
}

export function getActiveRole(): AdminRole {
  if (typeof window === "undefined") return DEFAULT_ROLES[0];
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ROLE);
    const roles = getAllRoles();
    const found = roles.find((r) => r.id === activeId);
    return found || DEFAULT_ROLES[0];
  } catch {
    return DEFAULT_ROLES[0];
  }
}

export function setActiveRole(roleId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ACTIVE_ROLE, roleId);
  window.dispatchEvent(new Event("dellics_role_changed"));
}

export function saveCustomRole(role: Omit<AdminRole, "isCustom">): AdminRole {
  if (typeof window === "undefined") return { ...role, isCustom: true };
  const allCustom: AdminRole[] = getCustomRoles();
  const existingIdx = allCustom.findIndex((r) => r.id === role.id);

  const fullRole: AdminRole = {
    ...role,
    isCustom: true,
  };

  if (existingIdx >= 0) {
    allCustom[existingIdx] = fullRole;
  } else {
    allCustom.push(fullRole);
  }

  localStorage.setItem(STORAGE_KEY_CUSTOM_ROLES, JSON.stringify(allCustom));
  window.dispatchEvent(new Event("dellics_role_changed"));
  return fullRole;
}

export function deleteCustomRole(roleId: string): boolean {
  if (typeof window === "undefined") return false;
  const allCustom: AdminRole[] = getCustomRoles();
  const filtered = allCustom.filter((r) => r.id !== roleId);
  localStorage.setItem(STORAGE_KEY_CUSTOM_ROLES, JSON.stringify(filtered));

  if (getActiveRole().id === roleId) {
    setActiveRole("master_admin");
  } else {
    window.dispatchEvent(new Event("dellics_role_changed"));
  }
  return true;
}

export function getCustomRoles(): AdminRole[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_ROLES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function hasPermission(role: AdminRole, permissionKey: string): boolean {
  if (role.id === "master_admin") return true;
  return Boolean(role.permissions[permissionKey]);
}

/**
 * React hook to listen for role changes across the dashboard
 */
export function useRole() {
  const [activeRole, setActiveRoleState] = useState<AdminRole>(DEFAULT_ROLES[0]);
  const [allRoles, setAllRolesState] = useState<AdminRole[]>(DEFAULT_ROLES);

  useEffect(() => {
    const sync = () => {
      setActiveRoleState(getActiveRole());
      setAllRolesState(getAllRoles());
    };

    sync();
    window.addEventListener("dellics_role_changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("dellics_role_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const switchRole = (roleId: string) => {
    setActiveRole(roleId);
  };

  const checkPermission = (key: string) => {
    return hasPermission(activeRole, key);
  };

  return {
    activeRole,
    allRoles,
    switchRole,
    checkPermission,
  };
}
