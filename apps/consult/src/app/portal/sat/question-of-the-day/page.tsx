"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Flame, 
  Calendar as CalendarIcon, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  Users,
  Compass
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface SATQuestion {
  subject: "reading" | "math";
  domain: string;
  difficulty: string;
  prompt: string;
  passage?: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

const QUESTIONS: Record<"reading" | "math", SATQuestion> = {
  reading: {
    subject: "reading",
    domain: "Craft and Structure",
    difficulty: "Easy",
    passage: "The African baobab tree (Adansonia digitata) possesses an exceptional capacity to store vast quantities of water within its swollen trunk, allowing it to withstand severe seasonal droughts that afflict the savanna ecosystem.",
    prompt: "As used in the text, what does the word 'capacity' most nearly mean?",
    options: [
      { id: "A", text: "Physical ability to hold or contain" },
      { id: "B", text: "Legal authority or jurisdiction" },
      { id: "C", text: "Mental aptitude for learning" },
      { id: "D", text: "Maximum industrial output" },
    ],
    correctId: "A",
    explanation: "In this biological context, 'capacity' refers to the tree's volume and ability to retain and hold water inside its trunk. Choice A is correct."
  },
  math: {
    subject: "math",
    domain: "Advanced Math",
    difficulty: "Easy",
    prompt: "If 3x + 7 = 22, what is the value of 6x + 14?",
    options: [
      { id: "A", text: "29" },
      { id: "B", text: "44" },
      { id: "C", text: "15" },
      { id: "D", text: "35" },
    ],
    correctId: "B",
    explanation: "Notice that (6x + 14) is exactly 2 times (3x + 7). Since 3x + 7 = 22, multiplying both sides by 2 gives 2(3x + 7) = 2(22) = 44. Choice B is correct."
  }
};

export default function SatQuestionOfTheDayPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Sam";

  const [activeTab, setActiveTab] = useState<"dashboard" | "badges" | "stats">("dashboard");
  const [selectedSubject, setSelectedSubject] = useState<"reading" | "math">("reading");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  const currentQ = QUESTIONS[selectedSubject];

  const handleSelectAnswer = (id: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(id);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setHasSubmitted(true);
    if (selectedAnswer === currentQ.correctId && streakDays === 0) {
      setStreakDays(1);
    }
  };

  const handleResetForSubject = (subj: "reading" | "math") => {
    setSelectedSubject(subj);
    setSelectedAnswer(null);
    setHasSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* College Board Global Top Bar */}
      <div className="bg-[#0A2540] text-white border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <Link href="/portal/sat" className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5">
            &larr; Back to My SAT
          </Link>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300 font-semibold uppercase tracking-wider">
            The College Board · SAT Suite of Assessments
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hi, {firstName}</span>
          <Link href="/contact" className="text-slate-300 hover:text-white underline">
            Help
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Title Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
                SAT Suite of Assessments
              </span>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Question of the Day
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Tackle a new question every day, build streaks, earn badges, and sharpen your skills!
              </p>
            </div>

            {/* Streak Counter Pill */}
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-slate-900 leading-none">
                  {streakDays} Days
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  CURRENT STREAK
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-200 mt-6 pt-2">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "badges", label: "My Badges" },
              { id: "stats", label: "My Stats" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-navy text-navy font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Question Area (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-900">
                      Welcome, {firstName}!
                    </h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Today's Question · October 13, 2026 (EDT)
                    </div>
                  </div>
                </div>

                {/* SELECT A SUBJECT TO CONTINUE */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    SELECT A SUBJECT TO CONTINUE (ONE PER DAY)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Reading & Writing Option */}
                    <button
                      type="button"
                      onClick={() => handleResetForSubject("reading")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedSubject === "reading"
                          ? "border-navy bg-navy/5 ring-2 ring-navy/10"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-sm font-bold text-navy">Reading and Writing</div>
                      <div className="text-xs text-slate-600 mt-1">Domain: Craft and Structure</div>
                      <div className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Difficulty: Easy
                      </div>
                    </button>

                    {/* Math Option */}
                    <button
                      type="button"
                      onClick={() => handleResetForSubject("math")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedSubject === "math"
                          ? "border-navy bg-navy/5 ring-2 ring-navy/10"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-sm font-bold text-navy">Math</div>
                      <div className="text-xs text-slate-600 mt-1">Domain: Advanced Math</div>
                      <div className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Difficulty: Easy
                      </div>
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  {currentQ.passage && (
                    <div className="text-sm text-slate-700 leading-relaxed italic bg-white p-4 rounded-xl border border-slate-200">
                      "{currentQ.passage}"
                    </div>
                  )}
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {currentQ.prompt}
                  </div>
                </div>

                {/* Multiple Choice Answers */}
                <div className="space-y-3">
                  {currentQ.options.map(opt => {
                    const isSelected = selectedAnswer === opt.id;
                    const isCorrect = opt.id === currentQ.correctId;

                    let optionStyle = "border-slate-200 hover:bg-slate-50 text-slate-800";
                    if (isSelected && !hasSubmitted) {
                      optionStyle = "border-navy bg-navy/5 font-semibold text-navy ring-1 ring-navy";
                    } else if (hasSubmitted) {
                      if (isCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-rose-400 bg-rose-50 text-rose-900 line-through";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={hasSubmitted}
                        onClick={() => handleSelectAnswer(opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {opt.id}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit & Explanation */}
                <div className="pt-2">
                  {!hasSubmitted ? (
                    <button
                      type="button"
                      disabled={!selectedAnswer}
                      onClick={handleSubmitAnswer}
                      className="w-full sm:w-auto py-3 px-8 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light disabled:opacity-40 transition-colors shadow-md"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className={`p-5 rounded-2xl border space-y-2 ${
                      selectedAnswer === currentQ.correctId
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {selectedAnswer === currentQ.correctId ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Correct! Great Job!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-amber-600" />
                            <span>Incorrect. Correct Answer: {currentQ.correctId}</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Streak Calendar & Resources */}
            <div className="space-y-6">
              {/* Your Streak Calendar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-brand-orange" />
                  <h3 className="text-sm font-bold text-slate-900">Your Streak Calendar</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Every question counts! Stay consistent, keep your streak going, and watch your calendar fill up with achievements!
                </p>

                {/* October 2026 Calendar Grid */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-navy mb-2 text-center">October 2026</div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {/* Previous month days: 27, 28, 29, 30 */}
                    {["27", "28", "29", "30"].map(d => (
                      <div key={`prev-${d}`} className="p-1.5 text-slate-300 text-[11px]">
                        {d}
                      </div>
                    ))}
                    {/* October 1 to 31 */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                      const isToday = day === 13;
                      const isDone = isToday && hasSubmitted && selectedAnswer === currentQ.correctId;

                      return (
                        <div
                          key={`oct-${day}`}
                          className={`p-1.5 rounded-lg text-[11px] font-medium ${
                            isDone
                              ? "bg-emerald-500 text-white font-bold"
                              : isToday
                              ? "bg-navy text-white font-bold"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Official Practice Resources */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Resources
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <Link
                      href="https://satsuite.collegeboard.org/sat/registration"
                      target="_blank"
                      className="font-bold text-navy hover:text-brand-orange flex items-center gap-1"
                    >
                      SAT Registration <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-slate-500 text-[11px] mt-0.5">Want to show colleges that you're ready? Sign up now to take the SAT.</p>
                  </div>

                  <div>
                    <Link
                      href="https://www.khanacademy.org/sat"
                      target="_blank"
                      className="font-bold text-navy hover:text-brand-orange flex items-center gap-1"
                    >
                      Digital SAT Practice on Khan Academy <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-slate-500 text-[11px] mt-0.5">Use customized resources to review questions and build confidence.</p>
                  </div>

                  <div>
                    <Link
                      href="https://satsuitequestionbank.collegeboard.org/"
                      target="_blank"
                      className="font-bold text-navy hover:text-brand-orange flex items-center gap-1"
                    >
                      Student Question Bank <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-slate-500 text-[11px] mt-0.5">Choose your own practice questions to target specific weaknesses.</p>
                  </div>

                  <div>
                    <Link
                      href="https://schoolhouse.world/sat"
                      target="_blank"
                      className="font-bold text-navy hover:text-brand-orange flex items-center gap-1"
                    >
                      Official SAT Tutoring at Schoolhouse.world <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-slate-500 text-[11px] mt-0.5">Join free, live, virtual small-group tutoring sessions led by trained peer tutors.</p>
                  </div>

                  <div>
                    <Link
                      href="https://bluebook.collegeboard.org/"
                      target="_blank"
                      className="font-bold text-navy hover:text-brand-orange flex items-center gap-1"
                    >
                      Bluebook Digital Testing <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-slate-500 text-[11px] mt-0.5">See what it's like to take a digital exam in the official Bluebook app.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900">My Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: "First Step", desc: "Answered 1st question", unlocked: hasSubmitted },
                { title: "3-Day Streak", desc: "3 consecutive days", unlocked: false },
                { title: "Math Master", desc: "5 math questions correct", unlocked: false },
                { title: "Reading Virtuoso", desc: "5 reading questions correct", unlocked: false },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border text-center space-y-2 ${
                    badge.unlocked
                      ? "border-amber-300 bg-amber-50/50"
                      : "border-slate-200 bg-slate-50/50 opacity-60"
                  }`}
                >
                  <Award className={`w-8 h-8 mx-auto ${badge.unlocked ? "text-amber-500" : "text-slate-400"}`} />
                  <div className="text-xs font-bold text-slate-800">{badge.title}</div>
                  <div className="text-[10px] text-slate-500">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900">My Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Questions Answered</div>
                <div className="text-3xl font-display font-bold text-navy mt-1">{hasSubmitted ? 1 : 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy Rate</div>
                <div className="text-3xl font-display font-bold text-emerald-600 mt-1">
                  {hasSubmitted ? (selectedAnswer === currentQ.correctId ? "100%" : "0%") : "—"}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Longest Streak</div>
                <div className="text-3xl font-display font-bold text-amber-500 mt-1">{streakDays} Days</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
