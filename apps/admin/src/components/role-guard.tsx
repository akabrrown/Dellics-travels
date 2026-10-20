"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { useRole } from "@/lib/roles";

interface RoleGuardProps {
  permission: string;
  moduleName?: string;
  children: React.ReactNode;
}

export function RoleGuard({ permission, moduleName, children }: RoleGuardProps) {
  const { activeRole, checkPermission } = useRole();
  const allowed = checkPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-rose-200/80 rounded-3xl shadow-sm text-center space-y-6">
      <div className="size-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
        <ShieldAlert className="size-8" />
      </div>

      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-slate-50 border-slate-200 text-slate-700">
          <Lock className="size-3 text-rose-500" />
          <span>Active Role: {activeRole.title}</span>
        </div>
        <h2 className="font-display text-xl font-bold text-[#0A0060]">
          Administrative Access Restricted
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Your current authenticated role (<strong>{activeRole.title}</strong>) does not have the{" "}
          <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono text-[11px]">
            {permission}
          </code>{" "}
          privilege required to view or manage {moduleName || "this operations module"}.
        </p>
      </div>

      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-500 max-w-md mx-auto text-left flex items-start gap-2.5">
        <ShieldAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          If you require access to this section for daily operations, request a role upgrade from your Master Admin in <strong>Administration &rarr; Roles &amp; Team</strong>.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-[#0A0060] hover:bg-[#12008f] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
