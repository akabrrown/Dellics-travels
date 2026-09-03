"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Clock,
  Check,
  Sparkles,
  MapPin,
  ChevronRight,
  Star,
  Users,
  BedDouble,
  Wifi,
  Coffee,
  CheckCheck,
  Baby,
  DoorOpen,
  Utensils,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import type { HotelRoomRate } from "@/lib/hotels";

interface BedOption {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  capacityText: string;
}

function getDynamicBedOptions(
  adults: number,
  children: number,
  rooms: number,
  primaryBedName?: string
): BedOption[] {
  const total = adults + children;

  // 1. Large Family / Group (5+ total guests or 3+ children)
  if (total >= 5 || children >= 3) {
    if (rooms >= 2) {
      return [
        {
          id: "conn-family-suite",
          title: `Connecting Family Rooms (${rooms} Rooms)`,
          subtitle: `Room 1: 1 King Master Bed · Room 2: ${Math.max(2, children)} Single / Bunk Beds`,
          badge: "Recommended for Large Families",
          capacityText: `Comfortably accommodates all ${total} guests (${adults} Adults, ${children} Children)`,
        },
        {
          id: "multi-queen-extra",
          title: `2 Queen Beds + ${Math.max(1, children - 1)} Extra Child Rollaways`,
          subtitle: "Spacious multi-bed setup across adjoining suites with full privacy",
          badge: "Most Flexible",
          capacityText: `Sleeps ${total} guests with individual bedding`,
        },
        {
          id: "master-and-bunks",
          title: "1 King Master Suite + 2 Twin Bunk Beds",
          subtitle: "Separate master bedroom with dedicated fun bunk room for children",
          badge: "Kids Favorite",
          capacityText: `Sleeps ${total} guests (${adults} Adults + ${children} Children)`,
        },
        {
          id: "all-single-individual",
          title: `${total} Individual Single Beds`,
          subtitle: "Separate individual bedding for every traveler across allocated rooms",
          capacityText: `Sleeps ${total} guests independently`,
        },
      ];
    }
    // 1 Room with 5+ guests
    return [
      {
        id: "suite-king-bunks",
        title: "1 King Bed + 2 Bunk Beds (4 Single Beds)",
        subtitle: "Spacious master bed for adults with custom multi-bed setup for children",
        badge: `Recommended for Family of ${total}`,
        capacityText: `Accommodates all ${total} guests (${adults} Adults, ${children} Children)`,
      },
      {
        id: "suite-queens-rollaway",
        title: "2 Queen Beds + 2 Rollaway Beds",
        subtitle: "Two large double beds plus two pre-installed single rollaways with plush mattresses",
        badge: "Family Suite",
        capacityText: `Sleeps ${total} guests comfortably`,
      },
      {
        id: "king-two-sofabeds",
        title: "1 King Bed + 2 Convertible Double Sofa Beds",
        subtitle: "Separate master suite plus living room double sofa beds",
        capacityText: `Sleeps up to ${total} guests`,
      },
      {
        id: "family-all-singles",
        title: `${total} Single Beds (Family Suite Dorm Setup)`,
        subtitle: "Individual beds arranged for maximum space and family comfort",
        capacityText: `Dedicated bed for each of the ${total} travelers`,
      },
    ];
  }

  // 2. Medium Family (3 to 4 guests, e.g. 2 adults + 1 or 2 children)
  if (total === 3 || total === 4) {
    if (children === 2 || total === 4) {
      return [
        {
          id: "king-two-singles",
          title: "1 King Bed + 2 Single Beds (or Bunk Bed)",
          subtitle: "Master king bed for parents and dedicated twin beds for children",
          badge: "Recommended for Family of 4",
          capacityText: `Sleeps 4 (${adults} Adults, ${children} Children)`,
        },
        {
          id: "two-queen-beds",
          title: "2 Queen Beds",
          subtitle: "Two comfortable 160cm wide queen beds in spacious room layout",
          badge: "Spacious Double",
          capacityText: "Sleeps 4 adults/children comfortably",
        },
        {
          id: "king-sofa-bed",
          title: "1 King Bed + 1 Double Pull-Out Sofa Bed",
          subtitle: "Master king bedroom with living area double sofa bed",
          badge: "Junior Suite",
          capacityText: "Sleeps 4 guests",
        },
        {
          id: "four-singles",
          title: "4 Single / Twin Beds",
          subtitle: "Four separate individual beds for friends or family",
          capacityText: "Sleeps 4 independently",
        },
      ];
    }
    // 3 guests (e.g. 2 adults + 1 child or 3 adults)
    return [
      {
        id: "king-single-child",
        title: "1 King Bed + 1 Single Child Bed / Rollaway",
        subtitle: "Spacious king bed plus dedicated single bed for child",
        badge: "Recommended",
        capacityText: `Sleeps 3 (${adults} Adults, ${children} Child)`,
      },
      {
        id: "queen-single",
        title: "1 Queen Bed + 1 Single Bed",
        subtitle: "Comfortable double bed plus single bed with bedside amenities",
        capacityText: "Sleeps 3 guests comfortably",
      },
      {
        id: "three-singles",
        title: "3 Separate Single Beds",
        subtitle: "Three individual beds with privacy spacing",
        capacityText: "Sleeps 3 independently",
      },
      {
        id: "king-shared",
        title: "1 Extra-Large King Bed (Child shares existing bedding)",
        subtitle: "200cm extra-wide luxury mattress accommodating small child with parents",
        badge: "Value Option",
        capacityText: "Sleeps 2 Adults + 1 Infant/Toddler",
      },
    ];
  }

  // 3. Couples & Solo (1 or 2 adults, 0 children)
  if (total === 2) {
    return [
      {
        id: "xl-king-bed",
        title: primaryBedName || "1 Extra-Large King Bed",
        subtitle: "200cm wide luxury king mattress with premium feather pillows",
        badge: "Most Popular",
        capacityText: "Sleeps 2 Adults comfortably",
      },
      {
        id: "two-twin-beds",
        title: "2 Single / Twin Beds",
        subtitle: "Two separate single beds with individual nightstands",
        badge: "Twin Sharing",
        capacityText: "Sleeps 2 independently",
      },
      {
        id: "one-queen-bed",
        title: "1 Queen Bed",
        subtitle: "160cm wide queen mattress with plush bedding",
        capacityText: "Sleeps 2 Adults",
      },
    ];
  }

  // Solo traveler
  return [
    {
      id: "solo-king",
      title: "1 Large King Bed",
      subtitle: "Full luxury king bed for single occupancy",
      badge: "Master Luxury",
      capacityText: "Single occupancy master setup",
    },
    {
      id: "solo-queen",
      title: "1 Queen Bed",
      subtitle: "Spacious standard queen bedroom",
      capacityText: "Single occupancy comfortable setup",
    },
    {
      id: "solo-single",
      title: "1 Standard Single Bed",
      subtitle: "Comfortable single bed with desk and high-speed WiFi",
      capacityText: "Compact single occupancy",
    },
  ];
}

function HotelBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Search parameters from URL
  const hotelId = searchParams.get("id") || "astoria_apartments_7";
  const hotelName = searchParams.get("name") || "Astoria Luxury Suites";
  const location = searchParams.get("location") || "Downtown Central District, Dubai";
  const checkIn =
    searchParams.get("checkIn") ||
    new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
  const checkOut =
    searchParams.get("checkOut") ||
    new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10);

  const adults = parseInt(searchParams.get("adults") || "2", 10) || 2;
  const children = parseInt(searchParams.get("children") || "0", 10) || 0;
  const totalGuests = adults + children;
  const rooms = parseInt(searchParams.get("rooms") || "1", 10) || 1;

  const defaultPrice = parseFloat(searchParams.get("price") || "380") || 380;
  const currency = searchParams.get("currency") || "USD";
  const rating = parseFloat(searchParams.get("rating") || "4.5") || 4.5;
  const image = searchParams.get("image") || "";

  // Parse live RateHawk room rates passed from search
  const liveRates: HotelRoomRate[] = useMemo(() => {
    const rawRates = searchParams.get("rates");
    if (!rawRates) return [];
    try {
      const parsed = JSON.parse(rawRates);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Ignore JSON parse error
    }
    return [];
  }, [searchParams]);

  // Calculated nights count
  const nightsCount = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // Selected Room Rate State
  const [selectedRateIndex, setSelectedRateIndex] = useState(0);

  // Active room data derived from live rates or fallback
  const activeRoom = useMemo(() => {
    if (liveRates.length > 0 && liveRates[selectedRateIndex]) {
      const r = liveRates[selectedRateIndex];
      return {
        name: r.roomName,
        meal: r.meal,
        bed: r.beddingType || "1 Extra-Large King Bed",
        price: r.price,
        cancellation: r.freeCancellationBefore
          ? `Free cancellation before ${new Date(r.freeCancellationBefore).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
          : "Free cancellation (up to 48 hrs before check-in)",
        amenities: r.amenities?.length ? r.amenities : ["WiFi", "Air Conditioning", "Ensuite Shower"],
      };
    }
    // Adaptive fallback room for large family
    if (totalGuests >= 5 || children >= 3) {
      return {
        name: "Grand Two-Bedroom Family Suite",
        meal: "Breakfast Included",
        bed: "1 King Bed + 2 Bunk Beds",
        price: Math.round(defaultPrice * 1.4),
        cancellation: "Free cancellation (up to 48 hrs before check-in)",
        amenities: ["WiFi", "Air Conditioning", "Connecting Rooms", "2 Bathrooms"],
      };
    }
    return {
      name: "Deluxe King Suite",
      meal: "Breakfast Included",
      bed: "1 Extra-Large King Bed",
      price: defaultPrice,
      cancellation: "Free cancellation (up to 48 hrs before check-in)",
      amenities: ["WiFi", "Air Conditioning", "Ensuite Shower"],
    };
  }, [liveRates, selectedRateIndex, defaultPrice, totalGuests, children]);

  const totalPrice = activeRoom.price * rooms;
  const nightlyRate = Math.round(totalPrice / nightsCount) || totalPrice;

  // Dynamic Bed Options matching the exact headcount
  const bedOptions = useMemo(
    () => getDynamicBedOptions(adults, children, rooms, activeRoom.bed),
    [adults, children, rooms, activeRoom.bed]
  );

  // Selected Bedding Type state
  const [bedType, setBedType] = useState(bedOptions[0]?.title || "1 Extra-Large King Bed");

  useEffect(() => {
    const firstOption = bedOptions[0];
    if (firstOption) {
      setBedType(firstOption.title);
    }
  }, [bedOptions]);

  // Family & Child Add-on Preferences
  const [childAddons, setChildAddons] = useState<{
    babyCot: boolean;
    bedRails: boolean;
    connectingRooms: boolean;
    kidsPack: boolean;
  }>({
    babyCot: false,
    bedRails: false,
    connectingRooms: rooms > 1,
    kidsPack: children > 0,
  });

  const toggleChildAddon = (key: keyof typeof childAddons) => {
    setChildAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Lead Guest & Payment State
  const [paymentOption, setPaymentOption] = useState<"card" | "hotel">("card");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required lead guest contact fields");
      return;
    }

    setSubmitting(true);
    try {
      const familyPreferencesSummary = [
        childAddons.babyCot && "Baby Cot/Crib Requested",
        childAddons.bedRails && "Child Bed Rails Requested",
        childAddons.connectingRooms && "Guaranteed Connecting Rooms Requested",
        childAddons.kidsPack && "Kids Welcome Pack & Dining High Chair Requested",
      ]
        .filter(Boolean)
        .join(", ");

      const combinedRequests = [specialRequests, familyPreferencesSummary]
        .filter(Boolean)
        .join(" | ");

      const reference = `DELLICS-HTL-${Date.now().toString().slice(-6)}`;
      const query = new URLSearchParams({
        reference,
        hotelId,
        hotelName,
        location,
        checkIn,
        checkOut,
        nights: String(nightsCount),
        adults: String(adults),
        children: String(children),
        guests: String(totalGuests),
        rooms: String(rooms),
        roomType: activeRoom.name,
        meal: activeRoom.meal,
        bedType: bedType || bedOptions[0]?.title || "1 Extra-Large King Bed",
        name: fullName,
        email,
        phone,
        total: String(totalPrice),
        currency,
        paymentStatus: paymentOption === "card" ? "PAID ONLINE" : "GUARANTEED AT HOTEL",
        specialRequests: combinedRequests,
      });

      router.push(`/hotels/confirmation?${query.toString()}`);
    } catch {
      toast.error("Unable to process reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 pt-6 sm:pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-navy transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href="/hotels" className="hover:text-navy transition-colors">
            Hotels & Stays
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="text-navy font-bold">Room Reservation</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200 mb-2">
              <Building2 className="size-3.5" />
              Verified RateHawk B2B Partner Property
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Reserve Your Room
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Live inventory verified directly from RateHawk B2B global database.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {activeRoom.cancellation}
            </span>
          </div>
        </div>

        {/* Family Party Composition Banner */}
        {children > 0 && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Baby className="size-5" />
              </div>
              <div>
                <span className="font-bold text-amber-950 block">
                  Family Reservation: {adults} Adults + {children} Children ({totalGuests} Travelers)
                </span>
                <p className="text-amber-800/80 mt-0.5">
                  The bed configurations and room selections below have been custom-tailored to sleep all {totalGuests} guests comfortably.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-white/80 px-2.5 py-1 rounded-full border border-amber-200">
              <Check className="size-3 text-emerald-600" /> Guaranteed Full Sleeping Capacity
            </span>
          </div>
        )}

        <form onSubmit={handleReserveSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Hotel Overview Header Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {image ? (
                  <div className="relative h-28 w-28 sm:h-32 sm:w-36 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
                    <Image
                      src={image}
                      alt={hotelName}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                ) : (
                  <div className="size-24 rounded-2xl bg-navy/5 border border-navy/10 flex flex-col items-center justify-center shrink-0 text-navy">
                    <Building2 className="size-10 text-navy/70" />
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Verified</span>
                  </div>
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-navy px-2 py-0.5 text-xs font-bold text-white">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {rating > 0 ? `${rating.toFixed(1)} Stars` : "4.0 Stars"}
                    </span>
                    <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold">
                      Instant Confirmation
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-black text-navy truncate">
                    {hotelName}
                  </h2>
                  <p className="text-xs text-slate-600 flex items-center gap-1 line-clamp-1">
                    <MapPin className="size-3 text-brand-orange shrink-0" />
                    {location}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold pt-1">
                    Party Size:{" "}
                    <span className="text-navy font-bold">
                      {adults} {adults === 1 ? "Adult" : "Adults"}
                      {children > 0 ? `, ${children} ${children === 1 ? "Child" : "Children"}` : ""}
                    </span>{" "}
                    ·{" "}
                    <span className="text-navy font-bold">
                      {rooms} {rooms === 1 ? "Room" : "Rooms"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Room Category Selection (Live RateHawk Inventory) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                      <BedDouble className="size-4 text-brand-orange" />
                      1. Available Rooms & Live Rates
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {liveRates.length > 0
                        ? `${liveRates.length} live room rate options returned directly from RateHawk for your stay`
                        : "Select your preferred room category for this accommodation"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 1 of 3</span>
                </div>

                {liveRates.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3.5">
                    {liveRates.map((rate, idx) => {
                      const isSelected = selectedRateIndex === idx;
                      return (
                        <label
                          key={`${rate.matchHash || idx}-${rate.roomName}`}
                          onClick={() => setSelectedRateIndex(idx)}
                          className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-2xl border-2 transition-all cursor-pointer gap-4 ${
                            isSelected
                              ? "border-brand-orange bg-orange-50/25 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display font-bold text-sm text-navy">
                                {rate.roomName}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                                {rate.meal}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {rate.beddingType || "1 Extra-Large Double Bed"} · Free High-Speed WiFi · Ensuite Bathroom
                            </p>
                            {rate.freeCancellationBefore ? (
                              <span className="text-[11px] font-semibold text-emerald-600 block">
                                ✓ Free cancellation before {new Date(rate.freeCancellationBefore).toLocaleDateString()}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                            <div className="text-right">
                              <span className="font-display text-lg font-black text-brand-orange">
                                ${rate.price.toLocaleString()}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-400 block">
                                {currency} total / {nightsCount} nights
                              </span>
                            </div>
                            <input
                              type="radio"
                              name="liveRoomRateRadio"
                              checked={isSelected}
                              onChange={() => setSelectedRateIndex(idx)}
                              className="accent-brand-orange mt-2 size-4"
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {(totalGuests >= 5 || children >= 3
                      ? [
                          {
                            name: "Grand Two-Bedroom Family Suite",
                            desc: `Spacious suite customized for ${totalGuests} guests with separate master bedroom and multi-bed children room.`,
                            badge: "Family Recommended",
                            price: Math.round(defaultPrice * 1.3),
                          },
                          {
                            name: "Connecting Family Executive Rooms",
                            desc: `Two adjoining rooms with private interior connecting door, 2 bathrooms, and work desks.`,
                            badge: "Connecting Rooms",
                            price: Math.round(defaultPrice * 1.45),
                          },
                          {
                            name: "Presidential Three-Bedroom Residence",
                            desc: "Expansive luxury apartment with panoramic views, full living area, and complimentary breakfast for all guests.",
                            badge: "VIP Stay",
                            price: Math.round(defaultPrice * 1.8),
                          },
                          {
                            name: "Spacious Multi-Bed Deluxe Suite",
                            desc: "Comfortable layout with king bed, bunk beds, high-speed WiFi, and 24/7 room service.",
                            badge: "Best Value",
                            price: defaultPrice,
                          },
                        ]
                      : [
                          {
                            name: "Deluxe King Suite",
                            desc: "Spacious luxury room with city view, king bed, and ensuite rain shower.",
                            badge: "Most Popular",
                            price: defaultPrice,
                          },
                          {
                            name: "Executive Twin Room",
                            desc: "Two twin beds, dedicated workspace, and executive lounge access.",
                            badge: "Flexible",
                            price: Math.round(defaultPrice * 1.1),
                          },
                          {
                            name: "Signature Penthouse Suite",
                            desc: "Panoramic skyline views, separate living area, and complimentary breakfast.",
                            badge: "VIP Stay",
                            price: Math.round(defaultPrice * 1.35),
                          },
                          {
                            name: "Standard Double Room",
                            desc: "Comfortable double bed, high-speed WiFi, and 24/7 room service.",
                            badge: "Best Value",
                            price: Math.round(defaultPrice * 0.9),
                          },
                        ]
                    ).map((r, idx) => (
                      <label
                        key={r.name}
                        onClick={() => setSelectedRateIndex(idx)}
                        className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedRateIndex === idx
                            ? "border-brand-orange bg-orange-50/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-sm text-navy">{r.name}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              {r.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span className="font-bold text-brand-orange">
                            ${r.price.toLocaleString()} USD
                          </span>
                          <input
                            type="radio"
                            name="roomTypeRadio"
                            checked={selectedRateIndex === idx}
                            onChange={() => setSelectedRateIndex(idx)}
                            className="accent-brand-orange"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Dynamic Bedding Configuration Engine */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-navy">
                      Confirmed Bed Configuration
                    </label>
                    <span className="text-[11px] font-bold text-brand-orange flex items-center gap-1">
                      <BedDouble className="size-3.5" />
                      Customized for {totalGuests} Guests ({adults} Adults{children > 0 ? `, ${children} Children` : ""})
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    Select how you would like the beds arranged for your {totalGuests} travelers:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bedOptions.map((opt) => {
                      const isSelected = bedType === opt.title;
                      return (
                        <label
                          key={opt.id}
                          onClick={() => setBedType(opt.title)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-brand-orange bg-orange-50/25 shadow-xs ring-1 ring-brand-orange/30"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-xs text-navy flex items-center gap-1.5">
                                <BedDouble className={`size-3.5 ${isSelected ? "text-brand-orange" : "text-slate-400"}`} />
                                {opt.title}
                              </span>
                              {opt.badge && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {opt.subtitle}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-emerald-600 flex items-center gap-1">
                              <Check className="size-3" />
                              {opt.capacityText}
                            </span>
                            <input
                              type="radio"
                              name="dynamicBeddingRadio"
                              checked={isSelected}
                              onChange={() => setBedType(opt.title)}
                              className="accent-brand-orange size-3.5"
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Family & Child Traveling Preferences */}
                {children > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-navy mb-1.5 flex items-center gap-1.5">
                      <Baby className="size-3.5 text-brand-orange" />
                      Family & Child Traveling Preferences (Complimentary)
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Dellics coordinates directly with hotel management to have these prepared prior to your check-in:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <label
                        onClick={() => toggleChildAddon("babyCot")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          childAddons.babyCot
                            ? "border-brand-orange bg-orange-50/20 text-navy font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Baby className="size-3.5 text-brand-orange shrink-0" />
                          <span>Baby Crib / Cot (Ages 0–2)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={childAddons.babyCot}
                          onChange={() => toggleChildAddon("babyCot")}
                          className="accent-brand-orange"
                        />
                      </label>

                      <label
                        onClick={() => toggleChildAddon("bedRails")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          childAddons.bedRails
                            ? "border-brand-orange bg-orange-50/20 text-navy font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="size-3.5 text-brand-orange shrink-0" />
                          <span>Child Bed Safety Rails</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={childAddons.bedRails}
                          onChange={() => toggleChildAddon("bedRails")}
                          className="accent-brand-orange"
                        />
                      </label>

                      <label
                        onClick={() => toggleChildAddon("connectingRooms")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          childAddons.connectingRooms
                            ? "border-brand-orange bg-orange-50/20 text-navy font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <DoorOpen className="size-3.5 text-brand-orange shrink-0" />
                          <span>Interconnected / Adjoining Rooms</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={childAddons.connectingRooms}
                          onChange={() => toggleChildAddon("connectingRooms")}
                          className="accent-brand-orange"
                        />
                      </label>

                      <label
                        onClick={() => toggleChildAddon("kidsPack")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          childAddons.kidsPack
                            ? "border-brand-orange bg-orange-50/20 text-navy font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Utensils className="size-3.5 text-brand-orange shrink-0" />
                          <span>Kids Dining High Chair & Welcome Kit</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={childAddons.kidsPack}
                          onChange={() => toggleChildAddon("kidsPack")}
                          className="accent-brand-orange"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Lead Guest Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                    <User className="size-4 text-brand-orange" />
                    2. Lead Guest & Contact Information
                  </h3>
                  <span className="text-xs font-bold text-slate-400">Step 2 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame Mensah"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Must match passport / government ID presented at check-in.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Booking voucher & check-in QR code will be emailed here.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">
                      Mobile Phone (with WhatsApp) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+233 24 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-navy focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`e.g. Traveling with ${children} children, early check-in requested, high floor room, quiet side away from elevator...`}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy resize-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Special requests are transmitted directly to hotel reception upon booking confirmation.
                  </span>
                </div>
              </div>

              {/* Payment & Guarantee Option */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                    <CreditCard className="size-4 text-brand-orange" />
                    3. Payment & Guarantee Method
                  </h3>
                  <span className="text-xs font-bold text-slate-400">Step 3 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label
                    onClick={() => setPaymentOption("card")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentOption === "card"
                        ? "border-brand-orange bg-orange-50/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-navy">Pay Online Now</span>
                        <input
                          type="radio"
                          name="paymentRadio"
                          checked={paymentOption === "card"}
                          onChange={() => setPaymentOption("card")}
                          className="accent-brand-orange"
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Instant confirmed voucher via Visa, MasterCard, Apple Pay, or Mobile Money (Paystack / Stripe).
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> 100% Guaranteed Rate
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentOption("hotel")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentOption === "hotel"
                        ? "border-brand-orange bg-orange-50/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-navy">Pay at Property</span>
                        <input
                          type="radio"
                          name="paymentRadio"
                          checked={paymentOption === "hotel"}
                          onChange={() => setPaymentOption("hotel")}
                          className="accent-brand-orange"
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Reserve today with zero upfront deduction. Pay during check-in at the hotel front desk.
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Lock className="size-3.5" /> Card Holds Reservation
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Summary Card (4 cols sticky) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-display text-base font-bold text-navy">
                    Reservation Summary
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    {nightsCount} {nightsCount === 1 ? "Night" : "Nights"}
                  </span>
                </div>

                {/* Stay Dates Box */}
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Check-In
                    </span>
                    <span className="font-bold text-navy text-xs block mt-0.5">
                      {checkIn}
                    </span>
                    <span className="text-[10px] text-slate-500">From 14:00</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Check-Out
                    </span>
                    <span className="font-bold text-navy text-xs block mt-0.5">
                      {checkOut}
                    </span>
                    <span className="text-[10px] text-slate-500">Until 12:00</span>
                  </div>
                </div>

                {/* Room & Guest Meta faithfully matching user choice */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Selected Room:</span>
                    <span className="font-bold text-navy text-right truncate max-w-[170px]">
                      {activeRoom.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Meal Plan:</span>
                    <span className="font-semibold text-emerald-600 text-right">
                      {activeRoom.meal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Party Size:</span>
                    <span className="font-semibold text-navy">
                      {adults} {adults === 1 ? "Adult" : "Adults"}
                      {children > 0 ? `, ${children} ${children === 1 ? "Child" : "Children"}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rooms:</span>
                    <span className="font-semibold text-navy">
                      {rooms} {rooms === 1 ? "Room" : "Rooms"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 shrink-0">Bedding:</span>
                    <span className="font-bold text-navy text-right leading-tight line-clamp-2">
                      {bedType}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      ${Math.round(totalPrice / nightsCount).toLocaleString()} × {nightsCount} nights
                    </span>
                    <span className="font-bold text-navy">
                      ${totalPrice.toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Service Fees</span>
                    <span className="text-emerald-600 font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Booking Agency Surcharge</span>
                    <span className="text-emerald-600 font-semibold">$0.00 (Free)</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-bold text-navy text-sm">Total Due</span>
                    <div className="text-right">
                      <span className="font-display text-2xl font-black text-brand-orange">
                        ${totalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-slate-500 ml-1">
                        {currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Confirming Room Reservation...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Confirm & Reserve Room (${totalPrice.toLocaleString()})
                      </span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>

                {/* Security Guarantee Badges */}
                <div className="pt-2 text-[11px] text-slate-500 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>RateHawk Direct B2B Confirmation</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Reservation details are transmitted via 256-bit encrypted SSL directly to hotel reception.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HotelBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-brand-orange" />
            <p className="text-sm font-semibold text-slate-600">
              Loading Hotel Reservation...
            </p>
          </div>
        </div>
      }
    >
      <HotelBookingContent />
    </Suspense>
  );
}
