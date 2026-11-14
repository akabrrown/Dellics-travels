"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Calendar,
  Award,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface StudyTestItem {
  id: string;
  study_application_id: string;
  test_type: string;
  status: "NOT_REQUIRED" | "PREP_ARRANGED" | "TEST_SCHEDULED" | "COMPLETED";
  score?: string | null;
  notes?: string | null;
  test_date?: string | null;
  created_at: string;
}

const COMMON_EXAMS = [
  "SAT",
  "PSAT",
  "AP",
  "IELTS Academic",
  "TOEFL iBT",
  "Duolingo English Test",
  "GRE General",
  "GMAT",
  "WASSCE",
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function MyTestsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [tests, setTests] = useState<StudyTestItem[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<StudyTestItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    test_type: "SAT",
    custom_test_type: "",
    status: "PREP_ARRANGED",
    test_date: "",
    score: "",
    notes: "",
  });

  const fetchTests = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/study/portal/me?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const json = await res.json();
        const apps = json.user?.study_applications || [];
        if (apps.length > 0) {
          setApplicationId(apps[0].id);
          setTests(apps[0].tests || []);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.isLoggedIn) {
        router.push("/login");
        return;
      }
      fetchTests();
    }
  }, [user, isLoading, router]);

  const openAddModal = () => {
    setEditingTest(null);
    setFormData({
      test_type: "SAT",
      custom_test_type: "",
      status: "PREP_ARRANGED",
      test_date: "",
      score: "",
      notes: "",
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: StudyTestItem) => {
    setEditingTest(t);
    const isStandard = COMMON_EXAMS.includes(t.test_type);
    setFormData({
      test_type: isStandard ? t.test_type : "Other",
      custom_test_type: isStandard ? "" : t.test_type,
      status: t.status,
      test_date: t.test_date ? (t.test_date.split("T")[0] || "") : "",
      score: t.score || "",
      notes: t.notes || "",
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId || !user?.email) return;

    const chosenTest =
      formData.test_type === "Other"
        ? formData.custom_test_type.trim()
        : formData.test_type;

    if (!chosenTest) {
      setErrorMsg("Please specify the exam or test name.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      if (editingTest) {
        // Update
        const res = await fetch(`${API_BASE}/study/applications/${applicationId}/tests/${editingTest.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test_type: chosenTest,
            status: formData.status,
            test_date: formData.test_date || null,
            score: formData.score || null,
            notes: formData.notes || null,
            email: user.email,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to update test.");
        }
      } else {
        // Create
        const res = await fetch(`${API_BASE}/study/applications/${applicationId}/tests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test_type: chosenTest,
            status: formData.status,
            test_date: formData.test_date || null,
            score: formData.score || null,
            notes: formData.notes || null,
            email: user.email,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to add test.");
        }
      }

      setIsModalOpen(false);
      await fetchTests();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testId: string) => {
    if (!applicationId || !user?.email) return;
    if (!confirm("Are you sure you want to remove this test from your record?")) return;

    try {
      const res = await fetch(
        `${API_BASE}/study/applications/${applicationId}/tests/${testId}?email=${encodeURIComponent(user.email)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchTests();
      }
    } catch {}
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "TEST_SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Calendar className="w-3.5 h-3.5" /> Date Scheduled
          </span>
        );
      case "PREP_ARRANGED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> In Preparation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            Waived / Not Required
          </span>
        );
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-600">Loading your tests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Student Portal
            </Link>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-brand-orange" /> My Tests & Standardized Exams
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track your scheduled exam dates, target scores, and self-reported test results.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/past-questions"
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-brand-orange" /> Past Questions Library
            </Link>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Plan / Report a Test
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Affiliation Disclaimer:</span> Dellics is an independent education consultancy
            and is not affiliated with College Board, ETS, IELTS, or other exam governing bodies. All test names and
            trademarks are the property of their respective owners.
          </div>
        </div>

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">No Tests Added Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Add the standardized tests you plan to take or have already completed (such as SAT, IELTS, TOEFL, GRE, or
                WASSCE) so your consultant can track your application readiness.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-md shadow-brand-orange/20"
            >
              <Plus className="w-4 h-4" /> Add Your First Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Standardized Test
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{t.test_type}</h3>
                    </div>
                    {getStatusBadge(t.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Test Date</span>
                      <span className="font-bold text-slate-800">
                        {t.test_date ? new Date(t.test_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "Not scheduled"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Reported Score</span>
                      <span className="font-bold text-brand-orange">
                        {t.score ? t.score : "Pending / Not taken"}
                      </span>
                    </div>
                  </div>

                  {t.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Consultant / Student Notes:</span>
                      {t.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-2 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add or Edit Test */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <h2 className="text-xl font-bold text-slate-900">
                {editingTest ? "Update Test Record" : "Plan or Report a Test"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your test details so your consultant can align your university application strategy.
              </p>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam / Test Body *</label>
                  <select
                    value={formData.test_type}
                    onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    {COMMON_EXAMS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                    <option value="Other">Other (Custom Exam)</option>
                  </select>
                </div>

                {formData.test_type === "Other" && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Custom Exam Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cambridge A-Levels, ACT, LSAT"
                      value={formData.custom_test_type}
                      onChange={(e) => setFormData({ ...formData, custom_test_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preparation Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="PREP_ARRANGED">In Preparation</option>
                      <option value="TEST_SCHEDULED">Date Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="NOT_REQUIRED">Not Required / Waived</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Exam Date (Planned/Taken)</label>
                    <input
                      type="date"
                      value={formData.test_date}
                      onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Self-Reported Score (if completed)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1450, 7.5, 110, 8 A1s"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notes / Target Goal</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Aiming for 1500+ for Cornell; taking official mock test in October."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white font-bold transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingTest ? "Update Test" : "Save Test"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
