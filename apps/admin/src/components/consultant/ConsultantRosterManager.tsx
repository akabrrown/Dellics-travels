"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import {
  Users,
  Search,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Award,
  Calendar,
  X,
  UserCheck,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export interface ConsultantRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialty?: string | null;
  photo_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    consultation_requests: number;
  };
}

export function ConsultantRosterManager() {
  const [consultants, setConsultants] = useState<ConsultantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState<ConsultantRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialty: "",
    photoUrl: "",
    isActive: true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadConsultants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.get<{ status: string; data: ConsultantRecord[] }>("/consultants");
      if (res && Array.isArray(res.data)) {
        setConsultants(res.data);
      } else {
        setConsultants([]);
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to load consultants.");
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConsultants();
  }, [loadConsultants]);

  const openAddModal = () => {
    setEditingConsultant(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      specialty: "",
      photoUrl: "",
      isActive: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (c: ConsultantRecord) => {
    setEditingConsultant(c);
    setFormData({
      fullName: c.full_name,
      email: c.email,
      phone: c.phone,
      specialty: c.specialty || "",
      photoUrl: c.photo_url || "",
      isActive: c.is_active,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      if (editingConsultant) {
        await adminApi.patch(`/consultants/${editingConsultant.id}`, {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          specialty: formData.specialty.trim() || undefined,
          photoUrl: formData.photoUrl.trim() || undefined,
          isActive: formData.isActive,
        });
        showToast(`Consultant "${formData.fullName}" updated successfully.`);
      } else {
        await adminApi.post("/consultants", {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          specialty: formData.specialty.trim() || undefined,
          photoUrl: formData.photoUrl.trim() || undefined,
          isActive: formData.isActive,
        });
        showToast(`Consultant "${formData.fullName}" created successfully.`);
      }
      setIsModalOpen(false);
      await loadConsultants();
      window.dispatchEvent(new Event("dellics_consultants_updated"));
    } catch (err: any) {
      setFormError(err?.message || "Failed to save consultant. Check email uniqueness.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (c: ConsultantRecord) => {
    try {
      const nextStatus = !c.is_active;
      await adminApi.patch(`/consultants/${c.id}`, { isActive: nextStatus });
      setConsultants((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, is_active: nextStatus } : item))
      );
      showToast(`Consultant "${c.full_name}" is now ${nextStatus ? "Active" : "Inactive"}.`);
      window.dispatchEvent(new Event("dellics_consultants_updated"));
    } catch (err: any) {
      showToast(err?.message || "Failed to update status.");
    }
  };

  const filtered = consultants.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.specialty || "").toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q);

    if (filterActive === "active") return matchesSearch && c.is_active;
    if (filterActive === "inactive") return matchesSearch && !c.is_active;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/20 text-xs font-semibold flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white cursor-pointer ml-2">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#0A0060]/10 text-[#0A0060] flex items-center justify-center font-bold">
            <Users className="size-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-900">Certified Advisors & Consultants</h2>
            <p className="text-xs text-slate-500">Manage real advisors available for student consultation bookings.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadConsultants}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Consultants"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin text-[#0A0060]" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#0A0060] hover:bg-[#120088] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Consultant</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by advisor name, email, specialty, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0A0060] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(["all", "active", "inactive"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterActive(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filterActive === filter ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <div className="size-8 rounded-full border-2 border-[#0A0060] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading certified consultants...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Users className="size-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No consultants found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? "No advisors match your search query."
              : "No consultants have been created yet. Add your first certified advisor to begin assigning bookings."}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#0A0060] text-white text-xs font-bold shadow-md hover:bg-[#120088] cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>Add Consultant</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Advisor Name & Role</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Specialty / Regions</th>
                  <th className="py-3 px-4">Assigned Bookings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-[#0A0060] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {c.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{c.full_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {c.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Mail className="size-3 text-slate-400" />
                          <span>{c.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Phone className="size-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-700 font-medium">
                        {c.specialty || "General Study Abroad"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {c._count?.consultation_requests ?? 0} active
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          c.is_active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title="Click to toggle Active / Inactive"
                      >
                        {c.is_active ? <CheckCircle2 className="size-3 text-emerald-600" /> : <XCircle className="size-3 text-slate-400" />}
                        <span>{c.is_active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(c)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:border-[#0A0060] hover:text-[#0A0060] text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit2 className="size-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Consultant Modal (Fully Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
                  Advisory Directory
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                  {editingConsultant ? `Edit Consultant: ${editingConsultant.full_name}` : "Add Certified Consultant"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Mensah"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="s.mensah@dellics.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+233 55 205 4174"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specialty & Target Destinations
                </label>
                <input
                  type="text"
                  placeholder="e.g. Russell Group, Chevening, U15 Canada, Post-Study Visas"
                  value={formData.specialty}
                  onChange={(e) => setFormData((p) => ({ ...p, specialty: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://.../advisor.jpg"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, photoUrl: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="rounded text-[#0A0060] focus:ring-[#0A0060] size-4"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Active (Can be assigned new consultation bookings)
                  </span>
                </label>
              </div>

              {/* Action Buttons (Always Reachable) */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0A0060] hover:bg-[#120088] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="size-3.5" />
                  <span>{isSubmitting ? "Saving..." : editingConsultant ? "Update Advisor" : "Create Advisor"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

