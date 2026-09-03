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
  Building2,
  BedDouble,
  Check,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HotelConfirmationProps {
  searchParams: Promise<{
    reference?: string;
    hotelId?: string;
    hotelName?: string;
    location?: string;
    checkIn?: string;
    checkOut?: string;
    nights?: string;
    guests?: string;
    rooms?: string;
    roomType?: string;
    bedType?: string;
    name?: string;
    email?: string;
    phone?: string;
    total?: string;
    currency?: string;
    paymentStatus?: string;
  }>;
}

export default async function HotelConfirmationPage({
  searchParams,
}: HotelConfirmationProps) {
  const params = await searchParams;

  const reference =
    params.reference || `DELLICS-HTL-${Date.now().toString().slice(-6)}`;
  const hotelName = params.hotelName || "Astoria Luxury Suites";
  const location = params.location || "Downtown Central District, Dubai";
  const checkIn =
    params.checkIn ||
    new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
  const checkOut =
    params.checkOut ||
    new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10);
  const nights = params.nights || "5";
  const guests = params.guests || "2";
  const rooms = params.rooms || "1";
  const roomType = params.roomType || "Deluxe King Suite";
  const bedType = params.bedType || "1 Extra-Large King Bed";
  const name = params.name || "Valued Guest";
  const email = params.email || "guest@example.com";
  const phone = params.phone || "+233 24 123 4567";
  const total = params.total || "380";
  const currency = params.currency || "USD";
  const paymentStatus = params.paymentStatus || "PAID ONLINE";

  const qrData = `LPA:DELLICS-HOTEL-VOUCHER$REF:${reference}$HOTEL:${hotelName}$CHECKIN:${checkIn}$CHECKOUT:${checkOut}$GUESTS:${guests}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Status Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="size-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            RateHawk Direct Confirmation · B2B Guaranteed
          </span>
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Room Reservation Confirmed!
          </h1>
          <p className="text-sm text-slate-600">
            Thank you, <strong className="text-navy">{name}</strong>. Your hotel stay is confirmed and your official check-in voucher is ready below.
          </p>
        </div>

        {/* The Official Hotel Voucher Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Voucher Header Banner */}
          <div className="bg-[#0A0060] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 className="size-5 text-brand-orange" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                  Official Stay Voucher
                </span>
                <span className="font-mono text-sm font-bold text-brand-orange">
                  REF: {reference}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
              {paymentStatus}
            </span>
          </div>

          {/* Voucher Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirmed Accommodation
              </span>
              <h2 className="font-display text-2xl font-black text-navy mt-0.5">
                {hotelName}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="size-3.5 text-brand-orange shrink-0" />
                {location}
              </p>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Check-In</span>
                <strong className="text-navy text-sm font-bold block mt-0.5">
                  {checkIn}
                </strong>
                <span className="text-[10px] text-slate-500">From 14:00</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Check-Out</span>
                <strong className="text-navy text-sm font-bold block mt-0.5">
                  {checkOut}
                </strong>
                <span className="text-[10px] text-slate-500">Until 12:00</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Duration</span>
                <strong className="text-navy text-sm font-bold block mt-0.5">
                  {nights} Nights
                </strong>
                <span className="text-[10px] text-slate-500">
                  {rooms} {rooms === "1" ? "Room" : "Rooms"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Guests</span>
                <strong className="text-navy text-sm font-bold block mt-0.5">
                  {guests} Guests
                </strong>
                <span className="text-[10px] text-slate-500">Lead: {name}</span>
              </div>
            </div>

            {/* Room Category & Amenities */}
            <div className="rounded-2xl border border-slate-100 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Room Category:</span>
                <span className="font-bold text-navy">{roomType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Bed Configuration:</span>
                <span className="font-semibold text-navy">{bedType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Included In Booking:</span>
                <span className="text-emerald-600 font-semibold">
                  Free WiFi · Air Conditioning · Ensuite Shower · 24/7 Front Desk
                </span>
              </div>
            </div>

            {/* Lead Guest & Contact Details */}
            <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-200/70 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Lead Guest & Contact Info
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Primary Guest:</span>{" "}
                  <strong className="text-navy">{name}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>{" "}
                  <span className="font-medium text-navy">{email}</span>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>{" "}
                  <span className="font-medium text-navy">{phone}</span>
                </div>
                <div>
                  <span className="text-slate-400">Total Price:</span>{" "}
                  <strong className="text-brand-orange font-black text-sm">
                    ${Number(total).toLocaleString()} {currency}
                  </strong>
                </div>
              </div>
            </div>

            {/* QR Code Check-In Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div className="size-28 shrink-0 bg-white p-2 rounded-xl shadow-xs border border-amber-200 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="Hotel Check-In QR Code"
                  className="size-full object-contain"
                />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-900 block flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="size-3.5 text-amber-700" />
                  Instant Hotel Front Desk Check-In
                </span>
                <p className="text-xs text-amber-800/80 leading-relaxed">
                  Present this QR code or booking reference <strong>{reference}</strong> along with your passport or national ID upon arrival at hotel reception.
                </p>
              </div>
            </div>

            {/* Check-In Guidelines */}
            <div className="border-t border-slate-100 pt-4 space-y-1.5 text-xs text-slate-500">
              <p className="font-bold text-navy">Important Stay Information:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                <li>Check-in begins at 14:00 local time. Early check-in is subject to availability upon arrival.</li>
                <li>Check-out is strictly at 12:00 noon. Late check-out requests must be confirmed with the front desk.</li>
                <li>All guests must present a valid passport or government-issued photo ID at check-in.</li>
                <li>Free cancellation is available up to 48 hours before check-in date.</li>
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/hotels"
              className="text-xs font-bold text-slate-500 hover:text-navy transition-colors order-2 sm:order-1"
            >
              ← Search More Hotels
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto rounded-full text-xs font-bold border-slate-300 hover:bg-white text-navy"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
              >
                <Download className="size-3.5 mr-1.5" />
                Print / Save Voucher
              </Button>
              <Link
                href="/profile"
                className="w-full sm:w-auto rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-4 py-2 text-center transition-colors shadow-xs"
              >
                View in My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
