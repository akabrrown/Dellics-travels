"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, TrendingUp, ArrowRight, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EsimPlanItem {
  id: string;
  country: string;
  flag: string;
  region: string;
  data: string;
  validity: string;
  price: string;
  operator: string;
  popular?: boolean;
}

interface EsimPlansGridProps {
  plans: EsimPlanItem[];
}

export function EsimPlansGrid({ plans }: EsimPlansGridProps) {
  const router = useRouter();

  const handleSelectPlan = (plan: EsimPlanItem) => {
    const params = new URLSearchParams({
      id: plan.id,
      country: plan.country,
      data: plan.data,
      validity: plan.validity,
      price: plan.price,
      network: plan.operator,
    });
    router.push(`/esim/order?${params.toString()}`);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-3xl bg-white p-6 sm:p-7 border shadow-xs hover:shadow-xl transition-all duration-300 ${
            plan.popular
              ? "border-brand-orange ring-2 ring-brand-orange/10"
              : "border-slate-200/80"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-3 right-6 rounded-full bg-brand-orange px-3 py-0.5 text-[11px] font-bold text-white shadow-xs flex items-center gap-1">
              <TrendingUp className="size-3" />
              Popular
            </span>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl select-none">{plan.flag}</span>
            <div>
              <h3 className="font-display text-lg font-bold text-navy">
                {plan.country}
              </h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Wifi className="size-3 text-brand-orange" />
                {plan.operator}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Data
              </span>
              <p className="font-display text-xl font-bold text-navy">{plan.data}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Validity
              </span>
              <p className="text-sm font-bold text-slate-700">{plan.validity}</p>
            </div>
          </div>

          <ul className="space-y-1.5 my-4 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>Tethering / Mobile Hotspot supported</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>Immediate email & QR activation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>No identity verification / passport scan needed</span>
            </li>
          </ul>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Price</span>
              <span className="font-display text-2xl font-extrabold text-brand-orange">{plan.price}</span>
            </div>

            <Button
              type="button"
              onClick={() => handleSelectPlan(plan)}
              size="sm"
              className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 text-xs shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Get eSIM</span>
              <ArrowRight className="size-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
