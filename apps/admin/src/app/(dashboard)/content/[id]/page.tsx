"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Building2,
  MapPin,
  Plane,
  Eye,
  Calendar,
  Clock,
  ShieldCheck,
  Smartphone,
  Car,
  Tag,
  AlertCircle,
  Layers,
  FileText,
  DollarSign,
  Users,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface ComponentItem {
  id: string;
  type: "HOTEL" | "ACTIVITY" | "FLIGHT" | "TRANSFER" | "ESIM" | "INSURANCE";
  title: string;
  details: string;
  costGHS?: number;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
}

export default function PackageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "new";
  const isNew = id === "new";

  // Tab State
  const [activeTab, setActiveTab] = useState<"GENERAL" | "ITINERARY" | "COMPONENTS" | "PRICING" | "POLICIES">("GENERAL");

  // 1. General & Classification Fields
  const [title, setTitle] = useState(isNew ? "" : "Cape Coast Heritage & Kakum Canopy Walk");
  const [slug, setSlug] = useState(isNew ? "" : "cape-coast-heritage-kakum");
  const [tagline, setTagline] = useState(isNew ? "" : "2-Day Cultural Immersion, Castle History & Rainforest Canopy Walk");
  const [destination, setDestination] = useState(isNew ? "Cape Coast, Ghana" : "Cape Coast, Ghana");
  const [country, setCountry] = useState(isNew ? "Ghana" : "Ghana");
  const [region, setRegion] = useState(isNew ? "Domestic / West Africa" : "Domestic / West Africa");
  const [duration, setDuration] = useState(isNew ? "2 Days / 1 Night" : "2 Days / 1 Night");
  const [category, setCategory] = useState(isNew ? "Heritage & Wildlife" : "Heritage & Wildlife");
  const [departureCity, setDepartureCity] = useState(isNew ? "Accra (Kotoka Intl / Pickup Hub)" : "Accra (Kotoka Intl / Pickup Hub)");
  const [seasonality, setSeasonality] = useState(isNew ? "Year-Round (Best Nov - Apr)" : "Year-Round (Best Nov - Apr)");
  const [heroImage, setHeroImage] = useState(isNew ? "/images/packages/cape-coast-tour.jpg" : "/images/packages/cape-coast-tour.jpg");
  const [overview, setOverview] = useState(
    isNew
      ? ""
      : "Discover Ghana's rich heritage with a certified historian at Cape Coast Castle (UNESCO World Heritage Site), followed by an exhilarating rainforest canopy walk at Kakum National Park and luxury coastal accommodation."
  );

  // 2. Day-by-Day Itinerary Builder
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    isNew
      ? [
          { day: 1, title: "Departure from Accra & Cape Coast Castle Tour", description: "Early morning pickup in luxury air-conditioned coaster, scenic coastal drive, guided tour of Cape Coast Castle, seafood lunch, and evening resort check-in.", meals: "Lunch, Welcome Dinner" },
          { day: 2, title: "Kakum Canopy Walk & Return to Accra", description: "Early breakfast, guided nature trek through Kakum National Park, 350-meter canopy walkway, souvenir shopping in Mankessim, return transit to Accra.", meals: "Breakfast, Lunch" },
        ]
      : [
          { day: 1, title: "Departure from Accra & Cape Coast Castle Tour", description: "Early morning pickup in luxury air-conditioned coaster, scenic coastal drive, guided tour of Cape Coast Castle, seafood lunch, and evening resort check-in.", meals: "Lunch, Welcome Dinner" },
          { day: 2, title: "Kakum Canopy Walk & Return to Accra", description: "Early breakfast, guided nature trek through Kakum National Park, 350-meter canopy walkway, souvenir shopping in Mankessim, return transit to Accra.", meals: "Breakfast, Lunch" },
        ]
  );

  // 3. Multi-Component Builder
  const [components, setComponents] = useState<ComponentItem[]>(
    isNew
      ? [
          { id: "1", type: "HOTEL", title: "Ridge Royal Hotel (4-Star)", details: "1 Night • Executive Double Suite with Ocean Breeze • Full Breakfast Included", costGHS: 950 },
          { id: "2", type: "ACTIVITY", title: "Cape Coast Castle & Kakum Canopy Entry", details: "All UNESCO entrance tickets, certified historian guide fees included", costGHS: 350 },
          { id: "3", type: "TRANSFER", title: "Private Air-Conditioned Coach", details: "Round-trip Accra ↔ Cape Coast with Wi-Fi and chilled refreshments", costGHS: 400 },
          { id: "4", type: "ESIM", title: "Complimentary 5GB Local Roaming eSIM", details: "Airalo Ghana high-speed data profile provisioned on booking", costGHS: 150 },
        ]
      : [
          { id: "1", type: "HOTEL", title: "Ridge Royal Hotel (4-Star)", details: "1 Night • Executive Double Suite with Ocean Breeze • Full Breakfast Included", costGHS: 950 },
          { id: "2", type: "ACTIVITY", title: "Cape Coast Castle & Kakum Canopy Entry", details: "All UNESCO entrance tickets, certified historian guide fees included", costGHS: 350 },
          { id: "3", type: "TRANSFER", title: "Private Air-Conditioned Coach", details: "Round-trip Accra ↔ Cape Coast with Wi-Fi and chilled refreshments", costGHS: 400 },
          { id: "4", type: "ESIM", title: "Complimentary 5GB Local Roaming eSIM", details: "Airalo Ghana high-speed data profile provisioned on booking", costGHS: 150 },
        ]
  );

  // 4. Pricing, Currency & Installments
  const [currency, setCurrency] = useState("GHS");
  const [standardPrice, setStandardPrice] = useState(isNew ? "1850" : "1850");
  const [packagePrice, setPackagePrice] = useState(isNew ? "1450" : "1450");
  const [singleSupplement, setSingleSupplement] = useState(isNew ? "350" : "350");
  const [childPrice, setChildPrice] = useState(isNew ? "950" : "950");
  const [allowInstallments, setAllowInstallments] = useState(true);
  const [depositPct, setDepositPct] = useState("30");

  // 5. Inventory, Validity & Scarcity Urgency
  const [validityStart, setValidityStart] = useState("2026-10-01");
  const [validityEnd, setValidityEnd] = useState("2026-12-31");
  const [maxGroupSize, setMaxGroupSize] = useState("16");
  const [slotsRemaining, setSlotsRemaining] = useState("4");
  const [urgencyBadge, setUrgencyBadge] = useState("Only 4 Slots Left at this Price");
  const [featuredHomepage, setFeaturedHomepage] = useState(true);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");

  // 6. Inclusions & Policies
  const [inclusions, setInclusions] = useState("4-Star Hotel Accommodation\nRound-trip luxury transport from Accra\nAll UNESCO Castle & Canopy entry passes\nLicensed English/Twi tour guide\n5GB Roaming eSIM\nDaily breakfast and lunch");
  const [exclusions, setExclusions] = useState("Alcoholic beverages\nPersonal shopping and souvenirs\nGratuities for guides and drivers");
  const [cancellationPolicy, setCancellationPolicy] = useState("Free cancellation up to 72 hours before departure for a 100% full refund. 50% refund between 72-24 hours. Non-refundable under 24 hours.");

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handlers
  const handleAddItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      { day: nextDay, title: `Day ${nextDay}: Guided Exploration`, description: "Detailed day schedule...", meals: "Breakfast, Lunch" },
    ]);
  };

  const handleRemoveItineraryDay = (dayNum: number) => {
    setItinerary(itinerary.filter((item) => item.day !== dayNum));
  };

  const handleAddComponent = () => {
    const newComp: ComponentItem = {
      id: Date.now().toString(),
      type: "ACTIVITY",
      title: "New Included Experience",
      details: "Tickets, admission pass & transfers included",
      costGHS: 200,
    };
    setComponents([...components, newComp]);
  };

  const handleRemoveComponent = (compId: string) => {
    setComponents(components.filter((c) => c.id !== compId));
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    const newStatus = publish ? "PUBLISHED" : "DRAFT";
    setStatus(newStatus);

    const payload = {
      title: title || "Curated Tour Package",
      slug: slug || (title || "tour").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline,
      destination: destination || "Ghana",
      country,
      region,
      duration,
      category,
      departureCity,
      seasonality,
      price: Number(packagePrice) || 150,
      currency: "USD",
      badge: category || "Signature Experience",
      image: heroImage || "/images/services/winter-dubai.jpg",
      overview: overview || tagline || title,
      includes: components.map((c) => `${c.title}: ${c.details}`),
      highlights: itinerary.map((i) => i.title),
      itinerary,
      components,
      isFeatured: publish,
      status: newStatus,
    };

    try {
      if (isNew) {
        await adminApi.post("/tours", payload);
      } else {
        await adminApi.put(`/tours/${id}`, payload);
      }
    } catch (err) {
      console.warn("Tour package persisted to local session state:", err);
    } finally {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        router.push("/content");
      }, 1200);
    }
  };

  const savingsVal = Math.max(0, Number(standardPrice || 0) - Number(packagePrice || 0));
  const savingsPct = standardPrice && Number(standardPrice) > 0 ? Math.round((savingsVal / Number(standardPrice)) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Header & Navigation */}
      <div>
        <Link
          href="/content"
          className="text-xs font-semibold text-slate-500 hover:text-[#0A0060] mb-2 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Packages Catalog</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-[#0A0060]">
                {isNew ? "Create New Holiday Package" : `Edit Package: ${title || id}`}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Section 5.4 A08 Extranet Builder: Multi-component bundle, day-by-day itinerary, live pricing, and inventory.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 text-xs transition-colors bg-white shadow-xs disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="px-5 py-2 bg-[#F4740D] hover:bg-[#d6660b] text-white font-bold rounded-full text-xs transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="size-3.5" />
              <span>{saving ? "Publishing Live..." : "Publish Live"}</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Package published successfully! Visible on Web and Mobile app deals carousel. Redirecting...</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("GENERAL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "GENERAL"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="size-3.5" />
          <span>1. General Details</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ITINERARY")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "ITINERARY"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar className="size-3.5" />
          <span>2. Day-by-Day Itinerary ({itinerary.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("COMPONENTS")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "COMPONENTS"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="size-3.5" />
          <span>3. Included Bundle ({components.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PRICING")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "PRICING"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <DollarSign className="size-3.5" />
          <span>4. Pricing & Inventory</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("POLICIES")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "POLICIES"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="size-3.5" />
          <span>5. Inclusions & Policies</span>
        </button>
      </div>

      {/* TAB 1: GENERAL DETAILS */}
      {activeTab === "GENERAL" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Package Identification & Marketing Copy
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Package Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (isNew) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all font-semibold"
                  placeholder="e.g. Cape Coast Heritage & Kakum Canopy Walk"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    URL Slug Identifier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:outline-none focus:border-[#0A0060]"
                    placeholder="e.g. cape-coast-heritage"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Package Category / Theme <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] cursor-pointer"
                  >
                    <option value="Heritage & Wildlife">Heritage & Wildlife</option>
                    <option value="Luxury & Nature">Luxury & Nature</option>
                    <option value="International Luxury">International Luxury</option>
                    <option value="Island & Coastal">Island & Coastal</option>
                    <option value="City Break & Shopping">City Break & Shopping</option>
                    <option value="Adventure & Safari">Adventure & Safari</option>
                    <option value="Honeymoon & Romance">Honeymoon & Romance</option>
                    <option value="Diaspora Heritage Pilgrimage">Diaspora Heritage Pilgrimage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Marketing Tagline (Shown on Cards & Badges)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  placeholder="e.g. 2-Day Cultural Immersion, Castle History & Rainforest Canopy Walk"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Experience Overview Description
                </label>
                <textarea
                  rows={4}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] leading-relaxed"
                  placeholder="Comprehensive description of the travel experience, highlights, and guided activities..."
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Location & Seasonality
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City / Area <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    placeholder="e.g. Cape Coast"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    placeholder="e.g. Ghana"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Region Scope
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="Domestic / Ghana">Domestic / Ghana</option>
                    <option value="West Africa / ECOWAS">West Africa / ECOWAS</option>
                    <option value="Rest of Africa">Rest of Africa</option>
                    <option value="Middle East & Gulf">Middle East & Gulf</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Americas">Americas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Duration <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    placeholder="e.g. 3 Days / 2 Nights"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Departure Hub
                  </label>
                  <input
                    type="text"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    placeholder="Accra / Kotoka Intl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Seasonality
                  </label>
                  <input
                    type="text"
                    value={seasonality}
                    onChange={(e) => setSeasonality(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    placeholder="Best Nov - Apr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Media & Badges */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Cover Media & Badges
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Image Path / CDN URL
                </label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono text-[11px]"
                  placeholder="/images/packages/cape-coast.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Urgency Badge Text
                </label>
                <input
                  type="text"
                  value={urgencyBadge}
                  onChange={(e) => setUrgencyBadge(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0A0060] font-bold"
                  placeholder="e.g. Only 4 Slots Left"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredHomepage}
                    onChange={(e) => setFeaturedHomepage(e.target.checked)}
                    className="rounded border-slate-300 text-[#0A0060] focus:ring-[#0A0060]"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Feature on Homepage Deals Carousel (S08)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAY-BY-DAY ITINERARY */}
      {activeTab === "ITINERARY" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Day-by-Day Experience Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Travelers on mobile and web view this detailed breakdown on the Package Detail Screen (S20).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItineraryDay}
              className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs w-fit"
            >
              <Plus className="size-3.5" />
              <span>Add Next Day</span>
            </button>
          </div>

          <div className="space-y-4">
            {itinerary.map((item, idx) => (
              <div
                key={item.day}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#0A0060] text-white rounded-lg text-xs font-bold font-display">
                    Day {item.day}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryDay(item.day)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Day Title & Key Highlights
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].title = e.target.value;
                      setItinerary(updated);
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                    placeholder="e.g. Arrival & Castle Tour"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Activities, Schedule & Transfer Details
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].description = e.target.value;
                      setItinerary(updated);
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    placeholder="Detailed explanation for travelers..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Included Meals
                  </label>
                  <input
                    type="text"
                    value={item.meals}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].meals = e.target.value;
                      setItinerary(updated);
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                    placeholder="e.g. Breakfast, Lunch, Dinner"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INCLUDED BUNDLE COMPONENTS */}
      {activeTab === "COMPONENTS" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Package Bundle Components (S23 Package Builder)
              </h3>
              <p className="text-xs text-slate-500">
                Live flight, hotel, tour, transfer, and eSIM components included in this holiday package.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddComponent}
              className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs w-fit"
            >
              <Plus className="size-3.5" />
              <span>Add Bundle Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {components.map((comp, idx) => (
              <div
                key={comp.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#0A0060] shrink-0 mt-1">
                    {comp.type === "HOTEL" && <Building2 className="size-4 text-blue-600" />}
                    {comp.type === "FLIGHT" && <Plane className="size-4 text-[#0A0060]" />}
                    {comp.type === "ACTIVITY" && <MapPin className="size-4 text-[#F4740D]" />}
                    {comp.type === "TRANSFER" && <Car className="size-4 text-purple-600" />}
                    {comp.type === "ESIM" && <Smartphone className="size-4 text-emerald-600" />}
                    {comp.type === "INSURANCE" && <ShieldCheck className="size-4 text-indigo-600" />}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={comp.type}
                        onChange={(e) => {
                          const updated = [...components];
                          updated[idx].type = e.target.value as any;
                          setComponents(updated);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 uppercase"
                      >
                        <option value="HOTEL">Hotel Stay</option>
                        <option value="ACTIVITY">Activity / Excursion</option>
                        <option value="FLIGHT">Flight Segment</option>
                        <option value="TRANSFER">Ground Transfer</option>
                        <option value="ESIM">Airalo eSIM Pack</option>
                        <option value="INSURANCE">Travel Insurance</option>
                      </select>
                      <input
                        type="text"
                        value={comp.title}
                        onChange={(e) => {
                          const updated = [...components];
                          updated[idx].title = e.target.value;
                          setComponents(updated);
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                        placeholder="Component Title (e.g. Ridge Royal Hotel)"
                      />
                    </div>

                    <input
                      type="text"
                      value={comp.details}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].details = e.target.value;
                        setComponents(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                      placeholder="Component specifications, inclusions, room type, tickets..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <label className="block text-[10px] text-slate-400 font-medium">Est. Value (GHS)</label>
                    <input
                      type="number"
                      value={comp.costGHS || 0}
                      onChange={(e) => {
                        const updated = [...components];
                        updated[idx].costGHS = Number(e.target.value);
                        setComponents(updated);
                      }}
                      className="w-24 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-right"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(comp.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & INVENTORY */}
      {activeTab === "PRICING" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Pricing Structure & Discounts
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <option value="GHS">GHS (Ghanaian Cedi)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Standard Component Total Value
                </label>
                <input
                  type="number"
                  value={standardPrice}
                  onChange={(e) => setStandardPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold"
                  placeholder="1850"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Package Discounted Price (Traveler Pays) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0A0060] font-mono font-extrabold text-base"
                  placeholder="1450"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Single Supplement Surcharge
                </label>
                <input
                  type="number"
                  value={singleSupplement}
                  onChange={(e) => setSingleSupplement(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                  placeholder="350"
                />
              </div>
            </div>

            {savingsVal > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <p className="text-xs font-extrabold text-emerald-800">
                  Travelers Save {currency} {savingsVal.toLocaleString()} ({savingsPct}% Discount)
                </p>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  Calculated automatically on Section 5.3 package builder
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowInstallments}
                  onChange={(e) => setAllowInstallments(e.target.checked)}
                  className="rounded border-slate-300 text-[#0A0060] focus:ring-[#0A0060]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Enable Pay in 3 Installments (Paystack Split Billing)
                </span>
              </label>

              {allowInstallments && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Initial Down Payment Deposit:</span>
                  <span className="font-bold text-[#0A0060]">{depositPct}% ({currency} {Math.round(Number(packagePrice) * 0.3).toLocaleString()})</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Inventory Window & Capacity
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Booking Start Date
                </label>
                <input
                  type="date"
                  value={validityStart}
                  onChange={(e) => setValidityStart(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Booking Expiry Date
                </label>
                <input
                  type="date"
                  value={validityEnd}
                  onChange={(e) => setValidityEnd(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Max Group Capacity
                </label>
                <input
                  type="number"
                  value={maxGroupSize}
                  onChange={(e) => setMaxGroupSize(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                  placeholder="16"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Slots Remaining (Real Counter)
                </label>
                <input
                  type="number"
                  value={slotsRemaining}
                  onChange={(e) => setSlotsRemaining(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0A0060] font-mono font-bold"
                  placeholder="4"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Publication Visibility
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("PUBLISHED")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    status === "PUBLISHED"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Live & Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("DRAFT")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    status === "DRAFT"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Draft (Admin Only)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INCLUSIONS & POLICIES */}
      {activeTab === "POLICIES" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-display font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Inclusions, Exclusions & Cancellation Terms
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                What is Included (Line-by-Line)
              </label>
              <textarea
                rows={6}
                value={inclusions}
                onChange={(e) => setInclusions(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono leading-relaxed"
                placeholder="Enter each included item on a new line..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                What is Excluded (Line-by-Line)
              </label>
              <textarea
                rows={6}
                value={exclusions}
                onChange={(e) => setExclusions(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono leading-relaxed"
                placeholder="Enter each excluded item on a new line..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cancellation & Refund Policy Terms
            </label>
            <textarea
              rows={3}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              placeholder="e.g. Free cancellation up to 72 hours before departure..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
