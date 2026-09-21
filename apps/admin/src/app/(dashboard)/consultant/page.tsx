"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/role-guard";
import { 
  Users, 
  Target, 
  FolderOpen, 
  Plane,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileText,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send
} from "lucide-react";

type TabType = "crm" | "tests" | "docs" | "visa";

// Mock Data Types
type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  dest: string;
  intake: string;
  stage: string;
  tests: string;
  docs: string;
  status: "In Progress" | "Action Required" | "Completed";
  documents: Array<{ id: string, name: string, file: string, date: string, status: "pending" | "approved" | "rejected" }>;
  testDetails: Array<{ id: string, type: string, status: string, score?: string, notes: string }>;
  visaStatus: string;
  internalNotes: Array<{ author: string, text: string, date: string }>;
};

const MOCK_STUDENTS: Student[] = [
  { 
    id: "s1", name: "John Doe", email: "john@example.com", phone: "+233 24 123 4567", city: "Accra", dest: "UK - MSc Data Science", intake: "Sept 2026", stage: "Document Collation", tests: "Pending IELTS", docs: "2/5 Uploaded", status: "In Progress",
    documents: [
      { id: "d1", name: "Passport Scan", file: "john_passport.pdf", date: "2 days ago", status: "approved" },
      { id: "d2", name: "Undergraduate Transcript", file: "transcript_final.pdf", date: "1 day ago", status: "pending" }
    ],
    testDetails: [
      { id: "t1", type: "IELTS Academic", status: "Preparation arranged with tutor", notes: "Target score: 7.0 band" }
    ],
    visaStatus: "Not Started",
    internalNotes: [
      { author: "Kwame Asante", text: "Student prefers universities in London or Manchester.", date: "Oct 12, 2023" }
    ]
  },
  { 
    id: "s2", name: "Ama Serwaa", email: "ama.s@example.com", phone: "+233 20 987 6543", city: "Kumasi", dest: "Canada - BSc Nursing", intake: "Jan 2027", stage: "Offer Received", tests: "IELTS Passed", docs: "Complete", status: "Action Required",
    documents: [
      { id: "d3", name: "WASSCE Certificate", file: "wassce_ama.pdf", date: "1 week ago", status: "approved" },
      { id: "d4", name: "Financial Statement", file: "bank_statement.pdf", date: "2 days ago", status: "rejected" }
    ],
    testDetails: [
      { id: "t2", type: "IELTS General", status: "Test completed", score: "7.5", notes: "Met minimum requirements." }
    ],
    visaStatus: "Document Collation",
    internalNotes: [
      { author: "Kwame Asante", text: "Needs to resubmit bank statements with correct date range.", date: "Oct 15, 2023" }
    ]
  },
  { 
    id: "s3", name: "Kwasi Mensah", email: "kwasi.m@example.com", phone: "+233 55 555 5555", city: "Tema", dest: "USA - MBA", intake: "Sept 2026", stage: "Visa Application", tests: "GMAT Passed", docs: "Complete", status: "In Progress",
    documents: [
      { id: "d5", name: "Passport", file: "passport_kwasi.pdf", date: "1 month ago", status: "approved" }
    ],
    testDetails: [
      { id: "t3", type: "GMAT", status: "Test completed", score: "680", notes: "Submitted to Stanford." }
    ],
    visaStatus: "Interview Scheduled (Nov 15)",
    internalNotes: []
  },
  { 
    id: "s4", name: "Fatima Ali", email: "fatima@example.com", phone: "+233 27 777 7777", city: "Tamale", dest: "UK - LLB Law", intake: "Sept 2026", stage: "Initial Consultation", tests: "Not Required", docs: "0/3 Uploaded", status: "In Progress",
    documents: [],
    testDetails: [],
    visaStatus: "Not Started",
    internalNotes: [
      { author: "Sarah Osei", text: "Awaiting high school final results.", date: "Oct 20, 2023" }
    ]
  },
];

const METRICS = [
  { label: "Total Students", value: "248", color: "text-slate-900" },
  { label: "Active Applications", value: "137", color: "text-brand-orange" },
  { label: "Tests Pending", value: "42", color: "text-slate-900" },
  { label: "Uni Submissions", value: "89", color: "text-slate-900" },
  { label: "Visa Processing", value: "31", color: "text-blue-600" },
  { label: "Appointments Today", value: "7", color: "text-emerald-600" },
];

export default function ConsultantPage() {
  const [activeTab, setActiveTab] = useState<TabType>("crm");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RoleGuard permission="consultant.view" moduleName="Consultant CRM">
      <div className="space-y-8 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0A0060]">
              Consultant Operations Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage student pipelines, university admissions, test coordination, and visa guidance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-[#0A0060] bg-white border border-[#0A0060]/20 rounded-lg shadow-sm hover:bg-slate-50">
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {METRICS.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-center">
              <span className={`font-display text-2xl font-extrabold ${m.color}`}>{m.value}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[600px]">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 px-6 pt-6 border-b border-slate-100 overflow-x-auto">
            <button 
              onClick={() => setActiveTab("crm")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === "crm" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <Users className="size-4" />
              Student CRM
            </button>
            <button 
              onClick={() => setActiveTab("tests")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === "tests" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <Target className="size-4" />
              Tests Coordination
            </button>
            <button 
              onClick={() => setActiveTab("docs")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === "docs" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <FolderOpen className="size-4" />
              Document Verification
            </button>
            <button 
              onClick={() => setActiveTab("visa")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === "visa" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <Plane className="size-4" />
              Visa Pipeline
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1">
            
            {/* TAB: CRM */}
            {activeTab === "crm" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Student Applicant Directory & Case Management</h2>
                    <p className="text-xs text-slate-500 mt-1">Click Manage to review dossier, verify documents, and update stages.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A0060] w-64"
                      />
                    </div>
                    <select className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-700">
                      <option value="all">All Destinations</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="us">United States</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Destination & Course</th>
                        <th className="px-4 py-3">Intake</th>
                        <th className="px-4 py-3">Application Stage</th>
                        <th className="px-4 py-3">Tests</th>
                        <th className="px-4 py-3">Documents</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-[#0A0060] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {s.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                                <div className="text-[11px] text-slate-500">{s.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-slate-900 font-bold">{s.dest.split(' - ')[0]}</div>
                            <div className="text-[11px] text-slate-500">{s.dest.split(' - ')[1]}</div>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-700 font-medium">{s.intake}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
                              {s.stage}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {s.tests === "Not Required" ? (
                               <span className="text-[11px] text-slate-400">None</span>
                            ) : (
                               <span className="inline-flex items-center px-2 py-1 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-700 shadow-sm">
                                 {s.tests.replace('Pending ', '').replace(' Passed', '')}
                               </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-xs font-bold text-slate-700">{s.docs}</td>
                          <td className="px-4 py-4 text-right">
                            <button 
                              onClick={() => setSelectedStudent(s)}
                              className="px-3 py-1.5 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 transition-colors inline-flex items-center gap-1"
                            >
                              Manage <ArrowRight className="size-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                            No students found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: TESTS */}
            {activeTab === "tests" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Standardized Test Coordination Queue</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage IELTS, SAT, TOEFL, GRE preparation arrangements.</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Required Test</th>
                        <th className="px-4 py-3">Coordination Stage</th>
                        <th className="px-4 py-3">Score Achieved</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_STUDENTS.filter(s => s.testDetails.length > 0).map(s => (
                        s.testDetails.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                              <div className="text-[11px] text-slate-500">{s.dest.split(' - ')[0]}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-700 shadow-sm">
                                {t.type}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs text-slate-700 font-medium">{t.status}</td>
                            <td className="px-4 py-4 text-xs font-bold text-slate-900">{t.score || "—"}</td>
                            <td className="px-4 py-4 text-right">
                              <button 
                                onClick={() => setSelectedStudent(s)}
                                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Update Stage
                              </button>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: DOCS */}
            {activeTab === "docs" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Pending Document Compliance Verification</h2>
                    <p className="text-xs text-slate-500 mt-1">Review high-resolution scans for compliance.</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Document Type</th>
                        <th className="px-4 py-3">File Name</th>
                        <th className="px-4 py-3">Uploaded</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_STUDENTS.flatMap(s => s.documents.map(d => ({ student: s, doc: d }))).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 font-semibold text-slate-900 text-sm">{item.student.name}</td>
                          <td className="px-4 py-4 text-xs text-slate-700 font-medium">{item.doc.name}</td>
                          <td className="px-4 py-4 text-[11px] text-slate-500 font-mono">{item.doc.file}</td>
                          <td className="px-4 py-4 text-xs text-slate-500">{item.doc.date}</td>
                          <td className="px-4 py-4">
                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                               item.doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                               item.doc.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                               'bg-amber-50 text-amber-700'
                             }`}>
                               {item.doc.status.toUpperCase()}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-2">
                            {item.doc.status === 'pending' && (
                              <>
                                <button className="px-3 py-1.5 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 transition-colors">
                                  Approve ✓
                                </button>
                                <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                  Request Edit
                                </button>
                              </>
                            )}
                            {item.doc.status !== 'pending' && (
                               <button 
                                onClick={() => setSelectedStudent(item.student)}
                                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                               >
                                 View Context
                               </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: VISA */}
            {activeTab === "visa" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Visa Guidance & CAS Pipeline</h2>
                    <p className="text-xs text-slate-500 mt-1">Track holding funds compliance, CAS issuance, and interviews.</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Visa Route</th>
                        <th className="px-4 py-3">Current Stage</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_STUDENTS.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 font-semibold text-slate-900 text-sm">{s.name}</td>
                          <td className="px-4 py-4 text-xs text-slate-700 font-medium">{s.dest.split(' - ')[0]} Student Visa</td>
                          <td className="px-4 py-4 text-xs font-bold text-slate-700">{s.visaStatus}</td>
                          <td className="px-4 py-4 text-right">
                             <button 
                              onClick={() => setSelectedStudent(s)}
                              className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                             >
                               Review Compliance
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Student Drawer Overlay */}
        {selectedStudent && (
          <>
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" 
              onClick={() => setSelectedStudent(null)}
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-slate-50 shadow-2xl z-[110] flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-[#0A0060] text-white flex items-center justify-center font-bold text-lg">
                    {selectedStudent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-slate-900 leading-tight">
                      {selectedStudent.name}
                    </h2>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{selectedStudent.email}</span>
                      <span>•</span>
                      <span>{selectedStudent.phone}</span>
                      <span>•</span>
                      <span>{selectedStudent.city}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="size-6" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Stage Progression */}
                <section>
                  <h3 className="font-display font-bold text-slate-900 text-sm mb-3">Application Stage Progression</h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-700 shrink-0">Current Stage:</label>
                      <select className="flex-1 bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A0060]/20">
                        <option>1. Initial Consultation (Completed)</option>
                        <option>2. Document Collation (Active)</option>
                        <option>3. University Submissions (Pending)</option>
                        <option>4. Offer Received (Pending)</option>
                        <option>5. Visa Application (Pending)</option>
                      </select>
                      <button className="px-4 py-2 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 whitespace-nowrap">
                        Advance Stage
                      </button>
                    </div>
                  </div>
                </section>

                {/* Document Compliance */}
                <section>
                  <h3 className="font-display font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
                    <span>Documents Compliance Verification</span>
                    <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{selectedStudent.documents.length} Files</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent.documents.length === 0 && (
                      <div className="p-4 bg-white border border-slate-200 border-dashed rounded-xl text-center text-sm text-slate-500">
                        No documents uploaded yet.
                      </div>
                    )}
                    {selectedStudent.documents.map(d => (
                      <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm truncate">{d.name}</p>
                          <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{d.file} • {d.date}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {d.status === 'pending' ? (
                            <>
                              <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-lg transition-colors">
                                Approve ✓
                              </button>
                              <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">
                                Revise
                              </button>
                            </>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              d.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {d.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Test Coordination */}
                <section>
                  <h3 className="font-display font-bold text-slate-900 text-sm mb-3">Tests Coordination Status</h3>
                  {selectedStudent.testDetails.length === 0 && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-500">
                      No standardized tests required for this application.
                    </div>
                  )}
                  {selectedStudent.testDetails.map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">{t.type}</span>
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{t.notes}</p>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">
                          Mark Prep Arranged
                        </button>
                        <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">
                          Set Test Date
                        </button>
                        <button className="px-3 py-1.5 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 transition-colors">
                          Record Score
                        </button>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Dispatch Alert */}
                <section>
                   <h3 className="font-display font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                     <Send className="size-4 text-brand-orange" />
                     Dispatch In-App Alert
                   </h3>
                   <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                     <input 
                        type="text" 
                        placeholder="Alert Title (e.g. Offer Letter Received)" 
                        className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A0060] mb-3"
                     />
                     <textarea 
                        rows={2} 
                        placeholder="Alert message details..." 
                        className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A0060] mb-3 resize-none"
                     />
                     <button className="px-4 py-2 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 transition-colors w-full sm:w-auto">
                       Send Notification to Student Portal
                     </button>
                   </div>
                </section>

                {/* Internal Notes */}
                <section>
                  <h3 className="font-display font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
                    <span>Internal Case Notes</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Staff Only</span>
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Add confidential consultant note..." 
                      className="flex-1 bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A0060]"
                    />
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors shrink-0">
                      Add Note
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedStudent.internalNotes.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">No internal notes yet.</p>
                    )}
                    {selectedStudent.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-700">{note.author}</span>
                          <span className="text-[10px] text-slate-500">{note.date}</span>
                        </div>
                        <p className="text-xs text-slate-800">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}