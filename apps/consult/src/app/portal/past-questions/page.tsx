"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  Download,
  FileText,
  Search,
  ArrowLeft,
  Info,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface OfficialResource {
  title: string;
  provider: string;
  description: string;
  url: string;
  badge: string;
}

interface DellicsLibraryItem {
  id: string;
  exam: string;
  title: string;
  year?: number | null;
  file_url: string;
  download_url?: string;
  resource_type: string;
  created_at: string;
}

const EXAM_TABS = [
  { id: "SAT", label: "SAT" },
  { id: "PSAT", label: "PSAT" },
  { id: "AP", label: "AP" },
  { id: "IELTS", label: "IELTS" },
  { id: "TOEFL", label: "TOEFL" },
  { id: "Duolingo", label: "Duolingo English Test" },
  { id: "GRE", label: "GRE" },
  { id: "GMAT", label: "GMAT" },
  { id: "WASSCE", label: "WASSCE" },
];

const OFFICIAL_RESOURCES: Record<string, OfficialResource[]> = {
  SAT: [
    {
      title: "College Board Official SAT Practice & Bluebook App",
      provider: "College Board",
      description:
        "Download Bluebook to take 4+ full-length official digital SAT practice tests with instant scoring.",
      url: "https://satsuite.collegeboard.org/sat/practice-preparation",
      badge: "Official Test Maker",
    },
    {
      title: "Khan Academy Official Digital SAT Prep",
      provider: "Khan Academy & College Board",
      description:
        "100% free interactive questions, video lessons, and personalized practice drills built in partnership with College Board.",
      url: "https://www.khanacademy.org/digital-sat",
      badge: "Free Official Partner",
    },
  ],
  PSAT: [
    {
      title: "College Board Official PSAT/NMSQT & PSAT 10 Practice",
      provider: "College Board",
      description:
        "Official practice tests, sample questions, and answer explanations for the Digital PSAT.",
      url: "https://satsuite.collegeboard.org/psat-nmsqt/preparing-for-the-psat-nmsqt/practice-tests",
      badge: "Official Test Maker",
    },
  ],
  AP: [
    {
      title: "AP Students Official Course Hub & AP Classroom",
      provider: "College Board AP",
      description:
        "Log in to your College Board AP account to access daily AP videos, unit progress checks, and course resources.",
      url: "https://apstudents.collegeboard.org/",
      badge: "Official Portal",
    },
    {
      title: "AP Central Past Free-Response Exam Questions",
      provider: "College Board",
      description:
        "Official free-response questions (FRQs), scoring guidelines, and sample student responses from past exam administrations.",
      url: "https://apcentral.collegeboard.org/courses/past-exam-questions",
      badge: "Official Past FRQs",
    },
  ],
  IELTS: [
    {
      title: "British Council Free IELTS Practice Tests",
      provider: "British Council",
      description:
        "Free official practice tests for IELTS Academic & General Training: Listening, Reading, Writing, and Speaking.",
      url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests",
      badge: "Official Test Partner",
    },
    {
      title: "IELTS.org Official Sample Test Questions",
      provider: "IELTS Australia & Cambridge English",
      description:
        "Official sample test questions with downloadable audio files, transcripts, and answer sheets.",
      url: "https://ielts.org/take-a-test/prepare-for-ielts/sample-test-questions",
      badge: "Official Test Maker",
    },
  ],
  TOEFL: [
    {
      title: "ETS TOEFL TestReady & Free Practice Test",
      provider: "ETS",
      description:
        "Personalized test preparation platform from ETS with a free full-length TOEFL iBT practice test and feedback.",
      url: "https://testready.ets.org/",
      badge: "Official Test Maker",
    },
    {
      title: "ETS TOEFL iBT Official Preparation Hub",
      provider: "ETS",
      description:
        "Free test prep planner, practice sets with audio tracks, and official scoring guides.",
      url: "https://www.ets.org/toefl/test-takers/ibt/prepare/tests.html",
      badge: "Official Resources",
    },
  ],
  Duolingo: [
    {
      title: "Duolingo English Test Official Practice Test",
      provider: "Duolingo",
      description:
        "Take a free 45-minute practice test to get an estimated score range and experience the computer-adaptive format.",
      url: "https://englishtest.duolingo.com/readiness",
      badge: "Official Test Maker",
    },
  ],
  GRE: [
    {
      title: "ETS GRE General Test POWERPREP Official Practice",
      provider: "ETS",
      description:
        "Free POWERPREP Online practice tests simulating the actual computer-delivered GRE General Test.",
      url: "https://www.ets.org/gre/test-takers/general-test/prepare.html",
      badge: "Official Test Maker",
    },
  ],
  GMAT: [
    {
      title: "mba.com Official GMAT Starter Kit + Practice Exams 1 & 2",
      provider: "GMAC (Graduate Management Admission Council)",
      description:
        "Two free full-length official practice exams using the real GMAT scoring algorithm, plus 90 free questions.",
      url: "https://www.mba.com/exam-prep/gmat-official-starter-kit",
      badge: "Official Test Maker",
    },
  ],
  WASSCE: [
    {
      title: "WAEC Official E-Learning Portal",
      provider: "West African Examinations Council (WAEC)",
      description:
        "Official Chief Examiners' reports, sample questions, candidate performance reviews, and syllabus guidelines.",
      url: "https://waeconline.org.gh/e-learning/",
      badge: "Official WAEC Portal",
    },
    {
      title: "WAEC Ghana National Office",
      provider: "WAEC Ghana",
      description:
        "Official portal for exam timetables, candidate registration updates, and examination rules.",
      url: "https://waecgh.org/",
      badge: "Official Council",
    },
  ],
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function PastQuestionsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedExam, setSelectedExam] = useState("SAT");
  const [dellicsItems, setDellicsItems] = useState<DellicsLibraryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDellicsLibrary = async (exam: string) => {
    try {
      setLoadingItems(true);
      const res = await fetch(`${API_BASE}/study/past-questions?exam=${encodeURIComponent(exam)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDellicsItems(json.data);
          return;
        }
      }
      setDellicsItems([]);
    } catch {
      setDellicsItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.isLoggedIn) {
        router.push("/login");
        return;
      }
      fetchDellicsLibrary(selectedExam);
    }
  }, [user, isLoading, selectedExam, router]);

  const officialList = OFFICIAL_RESOURCES[selectedExam] || [];

  const filteredDellicsItems = dellicsItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.year && item.year.toString().includes(q))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Student Portal
            </Link>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-brand-orange" /> Past Questions & Official Practice
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Curated official practice tests and Dellics-verified study resources organized by exam.
            </p>
          </div>

          <Link
            href="/portal/tests"
            className="px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
          >
            <GraduationCap className="w-4 h-4" /> View My Scheduled Tests
          </Link>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Affiliation Disclaimer:</span> Dellics is an independent educational consultancy
            and is not affiliated with College Board, ETS, IELTS, or other exam bodies. All tests, trademarks, and links
            remain the property of their respective governing organizations.
          </div>
        </div>

        {/* Exam Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          {EXAM_TABS.map((tab) => {
            const isActive = selectedExam === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedExam(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive
                    ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Section A: Official Practice Resources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" /> Official Free Practice Resources
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Opens directly on official exam body portal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialList.map((res, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider">
                      {res.badge}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{res.provider}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{res.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Free Access (Student Account)</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy hover:bg-navy-light text-white text-xs font-bold transition-colors"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Dellics Library */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy" /> Dellics Library ({selectedExam})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Practice papers, diagnostic exams, and study guides uploaded by Dellics Consult advisors.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy bg-white"
              />
            </div>
          </div>

          {loadingItems ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Loading Dellics library resources...
            </div>
          ) : filteredDellicsItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-xs">No Dellics Library Files for {selectedExam}</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Our academic team updates this library regularly. You can use the official practice tests above in the
                meantime.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDellicsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.resource_type || "PDF"}
                      </span>
                      {item.year && (
                        <span className="text-[11px] font-semibold text-slate-500">{item.year}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                    <p className="text-[11px] text-slate-400">
                      Added {new Date(item.created_at).toLocaleDateString()} • Verified by Dellics
                    </p>
                  </div>

                  <a
                    href={item.download_url || item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2.5 rounded-xl bg-slate-50 hover:bg-brand-orange hover:text-white text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


