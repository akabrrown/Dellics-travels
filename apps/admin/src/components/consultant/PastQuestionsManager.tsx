"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Download,
  ExternalLink,
  FileText,
  Upload,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export interface PastQuestionItem {
  id: string;
  exam: string;
  title: string;
  year?: number | null;
  file_url: string;
  download_url?: string;
  resource_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EXAM_OPTIONS = [
  "SAT",
  "PSAT",
  "AP",
  "IELTS",
  "TOEFL",
  "Duolingo",
  "GRE",
  "GMAT",
  "WASSCE",
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function PastQuestionsManager() {
  const [items, setItems] = useState<PastQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PastQuestionItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PastQuestionItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    exam: "SAT",
    title: "",
    year: "",
    resource_type: "PDF" as "PDF" | "LINK",
    file_url: "",
    is_active: true,
  });

  const loadPastQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.get<any>("/study/past-questions/admin");
      if (res && res.data && Array.isArray(res.data.data)) {
        setItems(res.data.data);
      } else if (res && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch {
      // Fallback: public endpoint
      try {
        const res = await adminApi.get<any>("/study/past-questions");
        if (res && res.data && Array.isArray(res.data.data)) {
          setItems(res.data.data);
        }
      } catch {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPastQuestions();
  }, [loadPastQuestions]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setFormError("File size exceeds 25 MB limit.");
      return;
    }

    try {
      setUploadingFile(true);
      setFormError("");
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("admin_token") : null;
      const res = await fetch(`${API_BASE}/study/past-questions/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: bodyFormData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to upload file.");
      }

      setFormData((prev) => ({
        ...prev,
        file_url: json.filePath || json.fileName,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
      showToast("File uploaded to private storage bucket.");
    } catch (err: any) {
      setFormError(err.message || "File upload failed.");
    } finally {
      setUploadingFile(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      exam: "SAT",
      title: "",
      year: new Date().getFullYear().toString(),
      resource_type: "PDF",
      file_url: "",
      is_active: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: PastQuestionItem) => {
    setEditingItem(item);
    setFormData({
      exam: item.exam,
      title: item.title,
      year: item.year ? item.year.toString() : "",
      resource_type: (item.resource_type as any) || "PDF",
      file_url: item.file_url,
      is_active: item.is_active,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: PastQuestionItem) => {
    try {
      await adminApi.patch(`/study/past-questions/${item.id}`, {
        is_active: !item.is_active,
      });
      showToast(item.is_active ? "Resource hidden from student portal." : "Resource published to student portal.");
      loadPastQuestions();
    } catch {
      showToast("Failed to update status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formData.file_url.trim()) {
      setFormError("File or link URL is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const payload = {
        exam: formData.exam,
        title: formData.title.trim(),
        year: formData.year ? parseInt(formData.year) : null,
        resource_type: formData.resource_type,
        file_url: formData.file_url.trim(),
        is_active: formData.is_active,
      };

      if (editingItem) {
        await adminApi.patch(`/study/past-questions/${editingItem.id}`, payload);
        showToast("Past question updated successfully.");
      } else {
        await adminApi.post("/study/past-questions", payload);
        showToast("Past question added to Dellics Library.");
      }

      setIsModalOpen(false);
      loadPastQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Failed to save resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await adminApi.delete(`/study/past-questions/${itemToDelete.id}`);
      showToast("Resource deleted successfully.");
      setItemToDelete(null);
      loadPastQuestions();
    } catch {
      showToast("Failed to delete resource.");
    }
  };

  const filteredItems = items.filter((item) => {
    if (examFilter !== "all" && item.exam.toLowerCase() !== examFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter === "active" && !item.is_active) return false;
    if (statusFilter === "inactive" && item.is_active) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchExam = item.exam.toLowerCase().includes(q);
      const matchYear = item.year?.toString().includes(q);
      if (!matchTitle && !matchExam && !matchYear) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A0060] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0A0060] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#EA580C]" /> Past Questions & Practice Library Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload PDFs to private storage or add links for students across SAT, PSAT, AP, IELTS, TOEFL, GRE, GMAT, and WASSCE.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadPastQuestions()}
            className="p-2 text-slate-500 hover:text-[#0A0060] hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#EA580C] hover:bg-[#F4740D] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Past Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, exam, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0A0060]"
            />
          </div>

          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold focus:outline-none"
          >
            <option value="all">All Exams</option>
            {EXAM_OPTIONS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold focus:outline-none"
          >
            <option value="all">All Visibility</option>
            <option value="active">Active (Visible)</option>
            <option value="inactive">Hidden</option>
          </select>
        </div>

        <div className="text-slate-400 font-medium">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto mb-2" />
            Loading past questions...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-700">No past questions found</div>
            <p className="text-slate-400 max-w-sm mx-auto">
              Add past papers, practice tests, or study materials to make them available in the Student Portal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Exam</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Added</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-[#0A0060]">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                        {item.exam}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-4 text-slate-600 font-mono">
                      {item.year || "—"}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {item.resource_type || "PDF"}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <a
                        href={item.download_url || item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-500 hover:text-navy rounded hover:bg-slate-100 inline-block"
                        title="Download / View"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="p-1.5 text-slate-500 hover:text-navy rounded hover:bg-slate-100 inline-block"
                        title={item.is_active ? "Hide from students" : "Publish to students"}
                      >
                        {item.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-500 hover:text-navy rounded hover:bg-slate-100 inline-block"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 inline-block"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add or Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#0A0060] text-base">
                {editingItem ? "Edit Past Question" : "Add Past Question / Practice Exam"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Type *</label>
                  <select
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A0060]"
                  >
                    {EXAM_OPTIONS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Year (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2024"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A0060]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Title / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAT Practice Test 4 (Digital Format with Explanations)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A0060]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resource_type"
                      checked={formData.resource_type === "PDF"}
                      onChange={() => setFormData({ ...formData, resource_type: "PDF" })}
                      className="text-[#0A0060]"
                    />
                    <span>PDF Upload</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resource_type"
                      checked={formData.resource_type === "LINK"}
                      onChange={() => setFormData({ ...formData, resource_type: "LINK" })}
                      className="text-[#0A0060]"
                    />
                    <span>External Link / Official URL</span>
                  </label>
                </div>
              </div>

              {formData.resource_type === "PDF" ? (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block mb-1">Upload PDF File</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-300 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pq-file-upload"
                      disabled={uploadingFile}
                    />
                    <label
                      htmlFor="pq-file-upload"
                      className="cursor-pointer inline-flex flex-col items-center gap-1.5"
                    >
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="font-semibold text-slate-700">
                        {uploadingFile ? "Uploading to storage..." : "Choose PDF from computer"}
                      </span>
                      <span className="text-[11px] text-slate-400">Max size 25 MB</span>
                    </label>
                  </div>
                  {formData.file_url && (
                    <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 font-mono truncate">
                      Path: {formData.file_url}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">External Resource URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A0060]"
                  />
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-[#0A0060] focus:ring-[#0A0060]"
                  />
                  <span className="font-bold text-slate-800">Publish to Student Portal</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingFile}
                  className="px-5 py-2 rounded-lg bg-[#EA580C] hover:bg-[#F4740D] text-white font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingItem ? "Update Resource" : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Delete Resource</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{itemToDelete.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
