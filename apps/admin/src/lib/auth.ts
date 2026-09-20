// @ts-nocheck
"use client";

import { AdminRole, getActiveRole, getAllRoles, setActiveRole } from "./roles";

export interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleTitle: string;
  token: string;
  totpEnrolled: boolean;
  loginAt: string;
}

const STORAGE_KEY_AUTH_SESSION = "dellics_admin_session_v1";
const STORAGE_KEY_AUTH_TOKEN = "dellics_admin_token";

export function getAdminSession(): AdminUserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const session = getAdminSession();
  return Boolean(session && session.token && session.roleId);
}

export function setAdminSession(session: AdminUserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_AUTH_SESSION, JSON.stringify(session));
  localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, session.token);
  
  setActiveRole(session.roleId);
  
  document.cookie = `dellics_admin_auth=true; path=/; max-age=86400; SameSite=Lax`;
  window.dispatchEvent(new Event("dellics_auth_changed"));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_AUTH_SESSION);
  localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
  document.cookie = "dellics_admin_auth=; path=/; max-age=0";
  window.dispatchEvent(new Event("dellics_auth_changed"));
}

export async function loginAdminAccount(
  email: string,
  password?: string,
  totp?: string
): Promise<{ success: boolean; session?: AdminUserSession; error?: string }> {
  try {
    const { adminApi } = require("./api");
    const loginRes = await adminApi.post("/auth/admin/login", {
      email: email.trim().toLowerCase(),
      password,
      totp,
    });
    
    if (!loginRes || !loginRes.token || loginRes.status === 'error') {
      return { success: false, error: loginRes?.message || 'Invalid credentials' };
    }

    const session: AdminUserSession = {
      id: loginRes.user.id,
      name: loginRes.user.name,
      email: loginRes.user.email,
      roleId: loginRes.user.roleId,
      roleTitle: loginRes.user.roleTitle,
      token: loginRes.token,
      totpEnrolled: loginRes.user.totpEnrolled,
      loginAt: new Date().toISOString(),
    };

    setAdminSession(session);
    return { success: true, session };
  } catch (err: any) {
    console.error("Backend auth error:", err);
    return { 
      success: false, 
      error: err.response?.data?.message || err.message || "An unexpected error occurred." 
    };
  }
}
