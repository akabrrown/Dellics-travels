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
} from "lucide-react";

interface ComponentItem {
  id: string;
  type: "HOTEL" | "ACTIVITY" | "FLIGHT" | "TRANSFER";
  title: string;
  details: string;
}

export default function PackageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "new";
  const isNew = id === "new";

  const [title, setTitle] = useState(
    isNew ? "" : "Cape Coast Heritage & Kakum Canopy Walk"
  );
  const [destination, setDestination] = useState(
    isNew ? "" : "Cape Coast, Ghana"
  );
  const [duration, setDuration] = useState(isNew ? "2 Days / 1 Night" : "2 Days / 1 Night");
  const [category, setCategory] = useState(isNew ? "Heritage & Wildlife" : "Heritage & Wildlife");
  const [description, setDescription] = useState(
    isNew
      ? ""
      : "Experience the history of Cape Coast Castle and walk through the canopies of Kakum National Park."
  );
  const [validityWindow, setValidityWindow] = useState(isNew ? "Oct 1 - Dec 31, 2026" : "Oct 1 - Dec 31, 2026");
  const [standardPrice, setStandardPrice] = useState(isNew ? "1850" : "1850");
  const [packagePrice, setPackagePrice] = useState(isNew ? "1450" : "1450");
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");

  const [components, setComponents] = useState<ComponentItem[]>(
    isNew
      ? [
          {
            id: "1",
            type: "HOTEL",
            title: "Ridge Royal Hotel",
            details: "1 Night • Standard Double Suite with Breakfast",
          },
          {
            id: "2",
            type: "ACTIVITY",
            title: "Kakum National Park Canopy Walk",
            details: "Guided Rainforest Tour & Canopy Walkway Entry",
          },
        ]
      : [
          {
            id: "1",
            type: "HOTEL",
            title: "Ridge Royal Hotel",
            details: "1 Night • Standard Double Suite with Breakfast",
          },
          {
            id: "2",
            type: "ACTIVITY",
            title: "Kakum National Park Canopy Walk",
            details: "Guided Rainforest Tour & Canopy Walkway Entry",
          },
        ]
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddComponent = () => {
    const newComp: ComponentItem = {
      id: Date.now().toString(),
      type: "ACTIVITY",
      title: "New Tour Component",
      details: "Admission & Transport Included",
    };
    setComponents([...components, newComp]);
  };

  const handleRemoveComponent = (compId: string) => {
    setComponents(components.filter((c) => c.id !== compId));
  };

  const handleSave = (publish: boolean) => {
    setStatus(publish ? "PUBLISHED" : "DRAFT");
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push("/content");
    }, 1200);
  };

  const savingsGHS = Math.max(0, Number(standardPrice || 0) - Number(packagePrice || 0));
  const savingsPct = standardPrice && Number(standardPrice) > 0 ? Math.round((savingsGHS / Number(standardPrice)) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
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
            <h1 className="font-display text-2xl font-bold text-[#0A0060]">
              {isNew ? "Create Holiday Package" : `Edit Package: ${title || id}`}
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Configure itinerary components, validity dates, multi-tier pricing, and publishing status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 text-xs transition-colors bg-white shadow-xs"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-5 py-2 bg-[#F4740D] hover:bg-[#d6660b] text-white font-bold rounded-full text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="size-3.5" />
              <span>Publish Live</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>Package successfully saved and updated in catalog! Redirecting...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              General Itinerary Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Package Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all"
                placeholder="e.g. Cape Coast Weekend Escape"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Package Summary & Highlights
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all"
                placeholder="Describe key experience highlights, transfers, meals, and accommodations..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
                  placeholder="e.g. Cape Coast, Ghana"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
                  placeholder="e.g. 3 Days / 2 Nights"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all cursor-pointer"
                >
                  <option value="Heritage & Wildlife">Heritage & Wildlife</option>
                  <option value="Luxury & Nature">Luxury & Nature</option>
                  <option value="International Luxury">International Luxury</option>
                  <option value="Island & Coastal">Island & Coastal</option>
                  <option value="Adventure & Safari">Adventure & Safari</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Booking Validity Window
                </label>
                <input
                  type="text"
                  value={validityWindow}
                  onChange={(e) => setValidityWindow(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
                  placeholder="e.g. Oct 1 - Dec 31, 2026"
                />
              </div>
            </div>
          </div>

          {/* Package Components */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Included Experience Components
                </h3>
                <p className="text-[11px] text-slate-500">
                  Hotels, activities, flights, and transfers bundled into this package.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddComponent}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1"
              >
                <Plus className="size-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {components.map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0A0060] shrink-0">
                      {comp.type === "HOTEL" ? (
                        <Building2 className="size-4 text-blue-600" />
                      ) : comp.type === "FLIGHT" ? (
                        <Plane className="size-4 text-[#0A0060]" />
                      ) : (
                        <MapPin className="size-4 text-[#F4740D]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 uppercase">
                          {comp.type}
                        </span>
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {comp.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{comp.details}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(comp.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Pricing & Savings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Standard Value (GHS)
              </label>
              <input
                type="number"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all font-mono font-bold"
                placeholder="1850"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Package Price (Traveler Pays)
              </label>
              <input
                type="number"
                value={packagePrice}
                onChange={(e) => setPackagePrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all font-mono font-extrabold text-[#0A0060]"
                placeholder="1450"
              />
            </div>

            {savingsGHS > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <p className="text-xs font-bold text-emerald-800">
                  Travelers save GHS {savingsGHS.toLocaleString()} ({savingsPct}%)
                </p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Discount badge highlighted on web & app</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Publication Status
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    status === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      status === "PUBLISHED" ? "bg-emerald-600" : "bg-amber-600"
                    }`}
                  />
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
