"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { SITE } from "@/lib/site";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Plane,
  Building2,
  Compass,
  CreditCard,
  Crown,
  Heart,
  Bell,
  Globe,
  Lock,
  LogOut,
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
  PhoneCall,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedTraveler {
  id: string;
  name: string;
  relationship: string;
  passportNumber: string;
  expiryDate: string;
  nationality: string;
}

interface UserBooking {
  id: string;
  ref: string;
  title: string;
  type: "flight" | "hotel" | "tour" | "transfer";
  destination: string;
  date: string;
  amount: string;
  status: "CONFIRMED" | "IN_REVIEW" | "COMPLETED";
  passengers: number;
}

const DEMO_BOOKINGS: UserBooking[] = [
  {
    id: "bk_001",
    ref: "DEL-84920",
    title: "Accra (ACC) → Dubai (DXB) Roundtrip",
    type: "flight",
    destination: "Dubai, United Arab Emirates",
    date: "14 Oct 2026 - 22 Oct 2026",
    amount: "GHS 9,450",
    status: "CONFIRMED",
    passengers: 2,
  },
  {
    id: "bk_002",
    ref: "DEL-73819",
    title: "Luxury Dubai Marina Penthouse & Suites",
    type: "hotel",
    destination: "Dubai Marina, UAE",
    date: "14 Oct 2026 - 20 Oct 2026",
    amount: "GHS 12,800",
    status: "CONFIRMED",
    passengers: 2,
  },
  {
    id: "bk_003",
    ref: "DEL-62910",
    title: "7-Day Serengeti & Ngorongoro Big 5 Safari",
    type: "tour",
    destination: "Tanzania",
    date: "05 Dec 2026 - 12 Dec 2026",
    amount: "GHS 24,500",
    status: "IN_REVIEW",
    passengers: 1,
  },
];

const DEMO_FAVORITES = [
  {
    id: "fav_1",
    title: "Cape Town Oceanfront Clifftop Villa",
    type: "Stay",
    location: "Camps Bay, South Africa",
    price: "$340 / night",
    image: "/images/services/south-africa-cape-town-villa.jpg",
    href: "/hotels",
  },
  {
    id: "fav_2",
    title: "Dubai Desert Safari & Dune Bashing",
    type: "Tour Package",
    location: "Dubai, UAE",
    price: "$140 / person",
    image: "/images/services/dubai-marina-apartment.jpg",
    href: "/tours",
  },
  {
    id: "fav_3",
    title: "Accra (ACC) to London Heathrow (LHR)",
    type: "Flight",
    location: "British Airways & Emirates",
    price: "$890 roundtrip",
    image: "/images/services/plane.jpg",
    href: "/flights",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "personal" | "trips" | "passports" | "membership" | "saved" | "settings"
  >("personal");

  // Edit Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("Ghana");
  const [homeAirport, setHomeAirport] = useState("ACC - Kotoka International");
  const [mealPreference, setMealPreference] = useState("Standard / No Restriction");
  const [seatPreference, setSeatPreference] = useState("Window");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Passport state
  const [passportNumber, setPassportNumber] = useState("G2849102");
  const [passportExpiry, setPassportExpiry] = useState("2031-06-15");
  const [showPassport, setShowPassport] = useState(false);
  const [travelers, setTravelers] = useState<SavedTraveler[]>([
    {
      id: "trav_1",
      name: "Akosua Brown",
      relationship: "Spouse",
      passportNumber: "G9182371",
      expiryDate: "2030-11-20",
      nationality: "Ghana",
    },
  ]);
  const [newTravelerName, setNewTravelerName] = useState("");
  const [newTravelerRelation, setNewTravelerRelation] = useState("Family");
  const [newTravelerPassport, setNewTravelerPassport] = useState("");
  const [isAddTravelerOpen, setIsAddTravelerOpen] = useState(false);

  // Settings State
  const [currency, setCurrency] = useState("GHS");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Sync query parameter if provided (e.g. /profile?tab=trips)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["personal", "trips", "passports", "membership", "saved", "settings"].includes(
        tabParam,
      )
    ) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Sync user profile fields on load
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "+233 55 205 4174");
      setEmergencyContact("Dr. Kwame Mensah");
      setEmergencyPhone("+233 24 411 2233");
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3500);
  };

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerName.trim()) return;
    const newTrav: SavedTraveler = {
      id: `trav_${Date.now()}`,
      name: newTravelerName,
      relationship: newTravelerRelation,
      passportNumber: newTravelerPassport || "Pending",
      expiryDate: "2032-01-01",
      nationality: "Ghana",
    };
    setTravelers((prev) => [...prev, newTrav]);
    setNewTravelerName("");
    setNewTravelerPassport("");
    setIsAddTravelerOpen(false);
  };

  const handleDeleteTraveler = (id: string) => {
    setTravelers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCopyReferral = () => {
    const code = `https://dellicstravels.com/signup?ref=${user?.id || "dellics"}`;
    navigator.clipboard.writeText(code);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading your travel account...</p>
        </div>
      </div>
    );
  }

  // If not logged in, prompt user to sign in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 flex items-center justify-center px-4">
        <div className="bg-white max-w-lg w-full rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
          <div className="size-16 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center mx-auto shadow-inner">
            <User className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-navy">
              Traveler Account & Profile
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sign in or create an account to view your active flight itineraries, manage saved passports, track Voyager reward points, and access member-only wholesale fares.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/signin" className="flex-1">
              <Button size="lg" className="w-full rounded-2xl bg-navy hover:bg-navy/90 text-white font-bold">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button size="lg" className="w-full rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = (user.fullName || user.email || "T").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Success Toast */}
        {isSavedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-navy text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-medium">Your profile information has been saved successfully!</p>
          </div>
        )}

        {/* Profile Master Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute -right-16 -top-16 size-64 bg-orange-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="size-20 sm:size-24 rounded-full bg-navy text-white font-display text-3xl font-bold flex items-center justify-center shadow-lg ring-4 ring-orange-50 shrink-0">
                {userInitial}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                    {user.fullName || "Valued Traveler"}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="size-3.5" />
                    Verified Traveler
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-slate-400" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-slate-400" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Voyager Club Tier Badge */}
            <div className="flex items-center gap-3 self-start md:self-auto bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 shadow-xs">
              <div className="size-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <Crown className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Voyager Club Tier
                </p>
                <p className="text-base font-bold text-navy">
                  Dellics Explorer <span className="text-xs font-normal text-slate-500">(Free)</span>
                </p>
                <button
                  onClick={() => setActiveTab("membership")}
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1 mt-0.5"
                >
                  View Perks & Upgrade <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Plane className="size-3.5 text-brand-orange" />
                <span>Total Trips</span>
              </div>
              <p className="font-display text-2xl font-bold text-navy mt-1">3 Bookings</p>
            </div>

            <div className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Reward Points</span>
              </div>
              <p className="font-display text-2xl font-bold text-navy mt-1">1,250 pts</p>
              <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">≈ GHS 125 Credit</p>
            </div>

            <div className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Heart className="size-3.5 text-rose-500" />
                <span>Saved Wishlist</span>
              </div>
              <p className="font-display text-2xl font-bold text-navy mt-1">3 Items</p>
            </div>

            <div className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Globe className="size-3.5 text-blue-500" />
                <span>eSIM Roaming</span>
              </div>
              <p className="font-display text-2xl font-bold text-navy mt-1">1 Active Plan</p>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: "personal", label: "Personal Details", icon: User },
            { id: "trips", label: "My Trips & Bookings", icon: Plane },
            { id: "passports", label: "Passports & IDs", icon: FileCheck },
            { id: "membership", label: "Voyager Rewards", icon: Crown },
            { id: "saved", label: "Saved Wishlist", icon: Heart },
            { id: "settings", label: "Settings & Security", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap outline-none ${
                  isActive
                    ? "bg-navy text-white shadow-md"
                    : "bg-white text-slate-600 hover:text-navy hover:bg-slate-100/80 border border-slate-100"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-brand-orange" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Personal Details */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-xl font-bold text-navy">Personal Traveler Information</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Keep your passenger details up to date for instant 1-tap checkout on flights and hotels.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Legal Name (as on Passport)</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address (Account ID)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Phone & WhatsApp Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 55 205 4174"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nationality / Citizenship</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Preferred Home Airport</label>
                    <select
                      value={homeAirport}
                      onChange={(e) => setHomeAirport(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    >
                      <option value="ACC - Kotoka International">ACC - Kotoka International (Accra, Ghana)</option>
                      <option value="LOS - Murtala Muhammed">LOS - Murtala Muhammed (Lagos, Nigeria)</option>
                      <option value="LHR - London Heathrow">LHR - London Heathrow (United Kingdom)</option>
                      <option value="JFK - John F. Kennedy">JFK - New York JFK (United States)</option>
                      <option value="DXB - Dubai International">DXB - Dubai International (UAE)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">In-Flight Seat Preference</label>
                    <select
                      value={seatPreference}
                      onChange={(e) => setSeatPreference(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    >
                      <option value="Window">Window Seat</option>
                      <option value="Aisle">Aisle Seat</option>
                      <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h3 className="text-sm font-bold text-navy">Emergency Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Contact Person Name</label>
                      <input
                        type="text"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="e.g. Dr. Kwame Mensah"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Emergency Phone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="+233 24 411 2233"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-md"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: Support & Concierge */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-navy to-[#0F026B] rounded-3xl p-6 text-white space-y-4 shadow-lg">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-orange">
                  <PhoneCall className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold">VIP Concierge Desk</h3>
                  <p className="text-xs text-white/75 leading-relaxed">
                    Need instant flight rescheduling, VIP airport meet & greet, or visa consultation? Your dedicated travel desk is 1 tap away.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hello Dellics Travels concierge, I am ${user.fullName} (${user.email}) and need immediate travel assistance.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold py-3 transition-colors shadow-md gap-2"
                >
                  <PhoneCall className="size-4" />
                  <span>Chat with Concierge</span>
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Security</h4>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>256-Bit SSL Encrypted Account</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>IATA & TOUGHA Verified Agency</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Trips & Bookings */}
        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">My Trips & Itineraries</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage active tickets, view verified vouchers, and check real-time airline schedule updates.
                  </p>
                </div>
                <Link href="/inquire">
                  <Button size="sm" className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold gap-1.5">
                    <Plus className="size-3.5" />
                    New Booking Inquiry
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {DEMO_BOOKINGS.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-orange shrink-0 shadow-xs">
                        {b.type === "flight" && <Plane className="size-6" />}
                        {b.type === "hotel" && <Building2 className="size-6" />}
                        {b.type === "tour" && <Compass className="size-6" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-base font-bold text-navy">{b.title}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 text-slate-400" />
                            {b.destination}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-slate-400" />
                            {b.date}
                          </span>
                          <span className="font-bold text-navy">Ref: {b.ref}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <p className="text-right font-display text-base font-bold text-navy hidden sm:block">
                        {b.amount}
                      </p>
                      <a
                        href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hello Dellics Travels, I need assistance with my booking ${b.ref} (${b.title}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5"
                      >
                        <PhoneCall className="size-3.5 text-emerald-600" />
                        Concierge
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Passports & Passenger Manifests */}
        {activeTab === "passports" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">Saved Passports & National IDs</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Store passenger credentials for fast 1-click international flight ticket issuance.
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddTravelerOpen(true)}
                  size="sm"
                  className="rounded-xl bg-navy hover:bg-navy/90 text-white font-bold gap-1"
                >
                  <Plus className="size-3.5" />
                  Add Companion
                </Button>
              </div>

              {/* Primary Traveler Passport */}
              <div className="p-5 bg-gradient-to-br from-slate-900 to-navy text-white rounded-2xl shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                      Primary Traveler Passport
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                    {nationality}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">Passport Holder</p>
                    <p className="text-sm font-bold text-white mt-0.5">{fullName || "Primary Traveler"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">Passport Number</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-mono font-bold text-white">
                        {showPassport ? passportNumber : "••••••••"}
                      </p>
                      <button
                        onClick={() => setShowPassport(!showPassport)}
                        className="text-white/70 hover:text-white"
                      >
                        {showPassport ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">Valid Until</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">{passportExpiry}</p>
                  </div>
                </div>
              </div>

              {/* Saved Companions List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Family & Companion Manifests ({travelers.length})
                </h3>
                {travelers.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-navy">{t.name}</p>
                        <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                          {t.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        Passport: {t.passportNumber} · Expires {t.expiryDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTraveler(t.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-2"
                      title="Remove Traveler"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Traveler Modal Form */}
              {isAddTravelerOpen && (
                <form
                  onSubmit={handleAddTraveler}
                  className="p-5 bg-orange-50/50 border border-brand-orange/20 rounded-2xl space-y-4 animate-in fade-in duration-200"
                >
                  <h4 className="text-sm font-bold text-navy">Add Companion Traveler</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name as on Passport"
                      value={newTravelerName}
                      onChange={(e) => setNewTravelerName(e.target.value)}
                      required
                      className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none"
                    />
                    <select
                      value={newTravelerRelation}
                      onChange={(e) => setNewTravelerRelation(e.target.value)}
                      className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Friend">Friend</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Passport Number (Optional)"
                      value={newTravelerPassport}
                      onChange={(e) => setNewTravelerPassport(e.target.value)}
                      className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddTravelerOpen(false)}
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold"
                    >
                      Save Companion
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Lock className="size-5" />
                </div>
                <h4 className="text-sm font-bold text-navy">Bank-Grade Encryption</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  All passport identifiers and dates are encrypted with AES-256 at rest and transmitted securely to IATA-compliant GDS systems only upon confirmed flight booking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Membership & Rewards */}
        {activeTab === "membership" && (
          <div className="space-y-8">
            {/* Tiers Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Explorer */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-brand-orange shadow-md relative space-y-5">
                <div className="inline-block px-3 py-1 bg-brand-orange text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
                  Active Tier
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">Dellics Explorer</h3>
                  <p className="font-display text-2xl font-bold text-navy mt-1">GHS 0 <span className="text-xs font-normal text-slate-500">/ forever free</span></p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Earn 1 pt per GHS 1 spent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Standard WhatsApp concierge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Live price drop notifications</span>
                  </li>
                </ul>
              </div>

              {/* Voyager */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase rounded-full tracking-wider">
                  Popular Upgrade
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">Dellics Voyager</h3>
                  <p className="font-display text-2xl font-bold text-navy mt-1">GHS 60 <span className="text-xs font-normal text-slate-500">/ month</span></p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand-orange shrink-0" />
                    <span><strong>1.5x Multiplier</strong> on reward points</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand-orange shrink-0" />
                    <span>Free cancellation on select stays</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand-orange shrink-0" />
                    <span>2 Free seat-selection credits/mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand-orange shrink-0" />
                    <span>Priority concierge queue</span>
                  </li>
                </ul>
                <Button className="w-full rounded-2xl bg-navy hover:bg-navy/90 text-white text-xs font-bold py-2.5">
                  Upgrade to Voyager
                </Button>
              </div>

              {/* Elite */}
              <div className="bg-gradient-to-br from-navy to-[#0A0055] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                <div className="inline-block px-3 py-1 bg-amber-400 text-navy text-[10px] font-bold uppercase rounded-full tracking-wider">
                  VIP Executive
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Dellics Elite</h3>
                  <p className="font-display text-2xl font-bold mt-1">GHS 150 <span className="text-xs font-normal text-white/70">/ month</span></p>
                </div>
                <ul className="space-y-2.5 text-xs text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                    <span><strong>2.5x Points Multiplier</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                    <span><strong>Airport Lounge Access</strong> (2 visits/yr)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                    <span>24/7 VIP Executive Hotline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                    <span>GHS 200 Annual Travel Credit</span>
                  </li>
                </ul>
                <Button className="w-full rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold py-2.5">
                  Upgrade to Elite
                </Button>
              </div>
            </div>

            {/* Referral Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Share2 className="size-4 text-brand-orange" />
                  <h3 className="font-display text-lg font-bold text-navy">Invite Friends & Earn GHS 100 Credit</h3>
                </div>
                <p className="text-xs text-slate-500 max-w-xl">
                  Share your unique referral link. When your friend completes their first international flight or tour booking, both of you earn GHS 100 in booking credits.
                </p>
              </div>
              <Button
                onClick={handleCopyReferral}
                className="rounded-2xl bg-navy hover:bg-navy/90 text-white font-bold text-xs px-6 shrink-0 gap-2"
              >
                {copiedReferral ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                {copiedReferral ? "Link Copied!" : "Copy Referral Link"}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 5: Saved Wishlist */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-xl font-bold text-navy">Saved Wishlist & Dream Trips</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Bookmarked hotels, flights, and safari tour packages for easy future booking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DEMO_FAVORITES.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all space-y-3 pb-4"
                  >
                    <div className="h-44 bg-slate-200 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={fav.image} alt={fav.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-navy/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {fav.type}
                      </span>
                    </div>
                    <div className="px-4 space-y-1">
                      <h4 className="font-display text-sm font-bold text-navy line-clamp-1">{fav.title}</h4>
                      <p className="text-xs text-slate-500">{fav.location}</p>
                      <p className="text-sm font-bold text-brand-orange pt-1">{fav.price}</p>
                    </div>
                    <div className="px-4 pt-2">
                      <Link href={fav.href}>
                        <Button size="sm" className="w-full rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Settings & Preferences */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-xl font-bold text-navy">Preferences & Account Settings</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage display currency, notification channels, and account security.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">Display & Settlement Currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { code: "GHS", label: "Ghana Cedi (₵)" },
                    { code: "USD", label: "US Dollar ($)" },
                    { code: "EUR", label: "Euro (€)" },
                    { code: "GBP", label: "British Pound (£)" },
                    { code: "NGN", label: "Nigerian Naira (₦)" },
                  ].map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        currency === c.code
                          ? "border-brand-orange bg-orange-50/50 text-brand-orange font-bold"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 text-xs font-medium"
                      }`}
                    >
                      <p className="text-sm font-bold">{c.code}</p>
                      <p className="text-[10px] text-slate-400">{c.label.split(" ")[0]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications Toggles */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-navy">Notification Channels</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-navy">WhatsApp Booking Updates & Itineraries</p>
                      <p className="text-[11px] text-slate-500">Receive flight tickets, gate changes, and vouchers directly on WhatsApp.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyWhatsApp}
                      onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                      className="size-4 accent-brand-orange cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-navy">Email E-Tickets & Tax Invoices</p>
                      <p className="text-[11px] text-slate-500">Itemized payment receipts and PDF booking confirmations.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="size-4 accent-brand-orange cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-navy">Price Drop Alerts</p>
                      <p className="text-[11px] text-slate-500">Instant alerts when fares on tracked routes drop by 15% or more.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyPriceDrops}
                      onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                      className="size-4 accent-brand-orange cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-navy">Log Out of This Device</p>
                  <p className="text-[11px] text-slate-500">Clear active traveler session token.</p>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200 gap-1.5"
                >
                  <LogOut className="size-3.5" />
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agency Identification</h4>
                <p className="text-xs text-slate-600">
                  Dellics Travels · IATA Certified Agency
                </p>
                <p className="text-xs text-slate-500">
                  Devtraco Estate, Community 25, Tema, Ghana
                </p>
                <p className="text-xs text-slate-500">
                  Hotline: +233 55 205 4174
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
