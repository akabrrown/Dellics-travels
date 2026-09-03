"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import { useRole } from "@/lib/roles";

interface RoleGuardProps {
  permission: string;
  moduleName?: string;
  children: React.ReactNode;
}

export function RoleGuard({ permission, moduleName, children }: RoleGuardProps) {
  const { activeRole, checkPermission, switchRole } = useRole();
  const allowed = checkPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-3xl shadow-sm text-center space-y-6">
      <div className="size-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
        <ShieldAlert className="size-8" />
      </div>

      <div className="space-y-2">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${activeRole.badgeColor}`}>
          Active Role: {activeRole.title}
        </span>
        <h2 className="font-display text-xl font-bold text-[#0A0060]">
          Administrative Access Restricted
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Your current role does not have the <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-[11px]">{permission}</code> privilege required to manage {moduleName || "this module"}.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Executive Overview</span>
        </Link>

        {activeRole.id !== "master_admin" && (
          <button
            onClick={() => switchRole("master_admin")}
            className="px-5 py-2.5 rounded-full bg-[#0A0060] hover:bg-[#12008f] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Switch to Master Admin</span>
          </button>
        )}
      </div>
    </div>
  );
}
