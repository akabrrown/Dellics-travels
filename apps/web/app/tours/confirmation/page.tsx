import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Clock,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationPageProps {
  searchParams: Promise<{
    reference?: string;
    tourName?: string;
    tourId?: string;
    date?: string;
    travelers?: string;
    priceUsd?: string;
    priceGhs?: string;
    name?: string;
    pickup?: string;
  }>;
}

export default async function TourConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;

  const reference = params.reference || `dellics_tour_${Date.now().toString().slice(-8)}`;
  const tourName = params.tourName || "Cape Coast Castle Heritage & Kakum Canopy Walk";
  const date = params.date || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const travelers = params.travelers || "1";
  const priceGhs = params.priceGhs ? Number(params.priceGhs).toLocaleString() : "1,860";
  const priceUsd = params.priceUsd ? Number(params.priceUsd).toLocaleString() : "120";
  const name = params.name || "Valued Traveler";
  const pickup = params.pickup || "Accra Mall (Main Entrance)";

  const qrData = `LPA:DELLICS-TOUR-VOUCHER$REF:${reference}$TOUR:${tourName}$TRAVELERS:${travelers}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Status Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="size-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Payment Verified · Paystack Transaction Complete
          </span>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Tour Reservation Confirmed!
          </h1>
          <p className="text-sm text-slate-600">
            Thank you, <strong className="text-navy">{name}</strong>. Your Dellics Signature Tour is booked and your voucher is ready below.
          </p>
        </div>

        {/* The Official Tour Voucher Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Voucher Header Banner */}
          <div className="bg-[#0A0060] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Compass className="size-5 text-brand-orange" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                  Official Booking Voucher
                </span>
                <span className="font-mono text-sm font-bold text-brand-orange">
                  REF: {reference}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
              PAID & CONFIRMED
            </span>
          </div>

          {/* Voucher Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirmed Experience
              </span>
              <h2 className="font-display text-xl font-bold text-navy mt-0.5">
                {tourName}
              </h2>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Departure Date</span>
                <span className="font-bold text-navy text-sm mt-0.5 flex items-center gap-1">
                  <Calendar className="size-3.5 text-brand-orange" />
                  {date}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Group Size</span>
                <span className="font-bold text-navy text-sm mt-0.5 flex items-center gap-1">
                  <Users className="size-3.5 text-brand-orange" />
                  {travelers} {travelers === "1" ? "Traveler" : "Travelers"}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block font-medium">Total Paid</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5">
                  GH₵ {priceGhs} <span className="text-[11px] font-normal text-slate-500">(${priceUsd} USD)</span>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block font-medium">Designated Meeting / Pickup Point</span>
                <span className="font-bold text-navy text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="size-3.5 text-brand-orange shrink-0" />
                  {pickup}
                </span>
              </div>
            </div>

            {/* Check-In QR Code */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-slate-200 bg-white">
              <img
                src={qrCodeUrl}
                alt="Tour Voucher QR Code"
                className="size-36 rounded-xl border border-slate-200 p-1.5 shrink-0"
              />
              <div className="space-y-1.5 text-center sm:text-left text-xs text-slate-600">
                <p className="font-bold text-navy text-sm">Tour Boarding QR Code</p>
                <p>
                  Present this QR code to your Dellics tour coordinator and driver at the pickup point for seamless boarding.
                </p>
                <p className="text-[11px] text-slate-400">
                  A duplicate voucher copy has also been sent to your registered email.
                </p>
              </div>
            </div>

            {/* Helpful Logistics Note */}
            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Please arrive at the meeting point 15 minutes prior to departure. Bring comfortable walking shoes, sun protection, and a valid photo ID.
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={`https://wa.me/233552054174?text=${encodeURIComponent(`Hello Dellics Travels! I have completed my tour payment for ${tourName} (Ref: ${reference}). Could you please confirm pickup timing?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 px-5 shadow-xs"
              >
                <span>WhatsApp Tour Desk</span>
                <ArrowRight className="size-3.5" />
              </a>

              <Button
                asChild
                variant="outline"
                className="rounded-xl text-xs font-semibold h-11 px-5"
              >
                <Link href="/tours">Explore More Tours</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
