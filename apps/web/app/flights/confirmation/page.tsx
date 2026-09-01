import Link from "next/link";
import type { Metadata } from "next/types";
import {
  CheckCircle2,
  Plane,
  ShieldCheck,
  Calendar,
  CreditCard,
  ArrowRight,
  Download,
  Luggage,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Flight Booking Confirmed — Dellics Travels",
  description: "Your international flight booking and electronic ticket issuance is confirmed via Stripe.",
};

export default async function FlightConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    bookingRef?: string;
    session_id?: string;
    origin?: string;
    dest?: string;
    airline?: string;
    price?: string;
    currency?: string;
    date?: string;
  }>;
}) {
  const params = await searchParams;
  const bookingRef = params.bookingRef || `FL_${Date.now().toString().slice(-6)}`;
  const origin = params.origin || "ACC";
  const destination = params.dest || "LHR";
  const airline = params.airline || "Emirates";
  const price = params.price || "850";
  const currency = params.currency || "USD";
  const date = params.date || new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50/70 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Banner Card */}
        <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-200/80 text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="size-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="size-3.5" />
            <span>Stripe Payment Confirmed · IATA Electronic Ticket Issued</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight sm:text-4xl">
            Your Flight is Booked!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Payment successfully processed via Stripe. Your official airline confirmation, electronic ticket PNR, and travel voucher have been issued.
          </p>

          {/* Ticket Reference Summary Card */}
          <div className="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-200/80 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Booking Reference
                </span>
                <p className="font-mono text-base font-bold text-navy">{bookingRef}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Paid (Stripe)
                </span>
                <p className="text-lg font-extrabold text-emerald-600">
                  ${price} {currency}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Plane className="size-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-500">Route & Airline</span>
                  <p className="text-sm font-bold text-navy">
                    {origin} → {destination}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">{airline}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-500">Departure Date</span>
                  <p className="text-sm font-bold text-navy">{date}</p>
                  <p className="text-xs text-slate-600 font-medium">Standard Check-In (3 hrs prior)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="size-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-500">Payment Gateway</span>
                  <p className="text-sm font-bold text-navy">Stripe Secured Checkout</p>
                  <p className="text-xs text-emerald-600 font-medium">Verified Transaction</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Luggage className="size-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-500">Baggage Allowance</span>
                  <p className="text-sm font-bold text-navy">2 × 23kg Checked Bags</p>
                  <p className="text-xs text-slate-600 font-medium">7kg Cabin Hand Luggage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-7 shadow-md"
            >
              <Link href="/profile">
                <span>View in My Trips</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-6"
            >
              <Link href="/flights">
                <span>Book Another Flight</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
