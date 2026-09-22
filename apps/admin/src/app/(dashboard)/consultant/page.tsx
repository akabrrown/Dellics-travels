"use client";

import React, { useState, useEffect } from "react";
import { RoleGuard } from "@/components/role-guard";
import { adminApi } from "@/lib/api";
import { 
  Users, 
  Target, 
  FolderOpen, 
  Plane,
  Search,
  X,
  ArrowRight,
  Send
} from "lucide-react";

type TabType = "crm" | "tests" | "docs" | "visa";

// Schema Types
type StudyDocument = { id: string; name: string; file_url: string; status: "PENDING" | "APPROVED" | "REJECTED"; updated_at: string };
type StudyTest = { id: string; test_type: string; status: string; score?: string; notes?: string };
type StudyNote = { id: string; author_name: string; text: string; created_at: string };

type Student = {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  city: string;
  destination: string;
  course: string;
  intake: string;
  stage: string;
  status: string;
  visa_status: string;
  documents: StudyDocument[];
  tests: StudyTest[];
  notes: StudyNote[];
  updated_at: string;
};

export default function ConsultantPage() {
  const [activeTab, setActiveTab] = useState<TabType>("crm");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await adminApi.get<{ status: string, data: Student[] }>('/study/applications');
      if (res && Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch (e) {
      console.error('Failed to fetch students', e);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await adminApi.get<any>('/study/metrics');
      setMetrics(res);
    } catch (e) {
      console.error('Failed to fetch metrics', e);
    }
  };

  useEffect(() => {
    Promise.all([fetchStudents(), fetchMetrics()]).then(() => setLoading(false));
  }, []);

  const refreshData = async () => {
    await fetchStudents();
    await fetchMetrics();
    if (selectedStudent) {
      const updated = students.find(s => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    }
  };

  const handleAdvanceStage = async (id: string, newStage: string) => {
    await adminApi.patch(`/study/applications/${id}`, { stage: newStage });
    await refreshData();
  };

  const handleUpdateDocument = async (appId: string, docId: string, status: string) => {
    await adminApi.patch(`/study/applications/${appId}/documents/${docId}`, { status });
    await refreshData();
  };

  const handleAddNote = async (appId: string, text: string) => {
    if (!text.trim()) return;
    await adminApi.post(`/study/applications/${appId}/notes`, { author_name: 'Consultant', text });
    await refreshData();
  };

  const filteredStudents = students.filter(s => 
    s.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.applicant_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const METRICS = [
    { label: "Total Students", value: metrics?.total || 0, color: "text-slate-900" },
    { label: "Active Applications", value: metrics?.active || 0, color: "text-brand-orange" },
    { label: "Tests Pending", value: metrics?.testsPending || 0, color: "text-slate-900" },
    { label: "Uni Submissions", value: metrics?.submissions || 0, color: "text-slate-900" },
    { label: "Visa Processing", value: metrics?.visa || 0, color: "text-blue-600" },
    { label: "Appointments Today", value: metrics?.appointments || 0, color: "text-emerald-600" },
  ];

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
            <button onClick={refreshData} className="px-4 py-2 text-xs font-bold text-[#0A0060] bg-white border border-[#0A0060]/20 rounded-lg shadow-sm hover:bg-slate-50">
              Refresh Data
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {METRICS.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-center">
              <span className={`font-display text-2xl font-extrabold ${m.color}`}>{loading ? '-' : m.value}</span>
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
                      {loading ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">Loading...</td></tr>
                      ) : filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-[#0A0060] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {s.applicant_name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">{s.applicant_name}</div>
                                <div className="text-[11px] text-slate-500">{s.applicant_email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-slate-900 font-bold">{s.destination}</div>
                            <div className="text-[11px] text-slate-500">{s.course || '-'}</div>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-700 font-medium">{s.intake}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
                              {s.stage.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {s.tests.length === 0 ? (
                               <span className="text-[11px] text-slate-400">None</span>
                            ) : (
                               <span className="inline-flex items-center px-2 py-1 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-700 shadow-sm">
                                 {s.tests[0].test_type}
                               </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-xs font-bold text-slate-700">
                            {s.documents.filter(d => d.status === 'APPROVED').length}/{s.documents.length}
                          </td>
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
                      {students.filter(s => s.tests.length > 0).map(s => (
                        s.tests.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900 text-sm">{s.applicant_name}</div>
                              <div className="text-[11px] text-slate-500">{s.destination}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-700 shadow-sm">
                                {t.test_type}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs text-slate-700 font-medium">{t.status.replace(/_/g, ' ')}</td>
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
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.flatMap(s => s.documents.map(d => ({ student: s, doc: d }))).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 font-semibold text-slate-900 text-sm">{item.student.applicant_name}</td>
                          <td className="px-4 py-4 text-xs text-slate-700 font-medium">{item.doc.name}</td>
                          <td className="px-4 py-4 text-[11px] text-slate-500 font-mono">{item.doc.file_url}</td>
                          <td className="px-4 py-4">
                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                               item.doc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                               item.doc.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                               'bg-amber-50 text-amber-700'
                             }`}>
                               {item.doc.status}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-2">
                            {item.doc.status === 'PENDING' && (
                              <>
                                <button onClick={() => handleUpdateDocument(item.student.id, item.doc.id, 'APPROVED')} className="px-3 py-1.5 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 transition-colors">
                                  Approve ✓
                                </button>
                                <button onClick={() => handleUpdateDocument(item.student.id, item.doc.id, 'REJECTED')} className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                  Reject
                                </button>
                              </>
                            )}
                            {item.doc.status !== 'PENDING' && (
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
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 font-semibold text-slate-900 text-sm">{s.applicant_name}</td>
                          <td className="px-4 py-4 text-xs text-slate-700 font-medium">{s.destination} Student Visa</td>
                          <td className="px-4 py-4 text-xs font-bold text-slate-700">{s.visa_status || 'Not Started'}</td>
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
          <StudentDrawer 
            student={selectedStudent} 
            onClose={() => {
              setSelectedStudent(null);
              refreshData();
            }}
            onAdvanceStage={(s: string) => handleAdvanceStage(selectedStudent.id, s)}
            onUpdateDoc={(dId: string, s: string) => handleUpdateDocument(selectedStudent.id, dId, s)}
            onAddNote={(t: string) => handleAddNote(selectedStudent.id, t)}
          />
        )}
      </div>
    </RoleGuard>
  );
}

function StudentDrawer({ student, onClose, onAdvanceStage, onUpdateDoc, onAddNote }: any) {
  const [noteText, setNoteText] = useState("");
  const [selectedStage, setSelectedStage] = useState(student.stage);

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] max-w-full bg-slate-50 shadow-2xl z-[110] flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-[#0A0060] text-white flex items-center justify-center font-bold text-lg">
              {student.applicant_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 leading-tight">
                {student.applicant_name}
              </h2>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="truncate max-w-[180px]">{student.applicant_email}</span>
                <span aria-hidden>•</span>
                <span>{student.applicant_phone}</span>
                <span aria-hidden>•</span>
                <span>{student.city}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
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
                <select 
                  value={selectedStage}
                  onChange={e => setSelectedStage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A0060]/20"
                >
                  <option value="INITIAL_CONSULTATION">1. Initial Consultation</option>
                  <option value="DOCUMENT_COLLATION">2. Document Collation</option>
                  <option value="UNIVERSITY_SUBMISSION">3. University Submissions</option>
                  <option value="OFFER_RECEIVED">4. Offer Received</option>
                  <option value="VISA_APPLICATION">5. Visa Application</option>
                  <option value="COMPLETED">6. Completed</option>
                </select>
                <button 
                  onClick={() => onAdvanceStage(selectedStage)}
                  className="px-4 py-2 bg-[#0A0060] text-white text-xs font-bold rounded-lg hover:bg-[#0A0060]/90 whitespace-nowrap"
                >
                  Update Stage
                </button>
              </div>
            </div>
          </section>

          {/* Document Compliance */}
          <section>
            <h3 className="font-display font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>Documents Compliance Verification</span>
              <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{student.documents.length} Files</span>
            </h3>
            <div className="space-y-3">
              {student.documents.length === 0 && (
                <div className="p-4 bg-white border border-slate-200 border-dashed rounded-xl text-center text-sm text-slate-500">
                  No documents uploaded yet.
                </div>
              )}
              {student.documents.map((d: any) => (
                <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm truncate">{d.name}</p>
                    <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{d.file_url}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.status === 'PENDING' ? (
                      <>
                        <button onClick={() => onUpdateDoc(d.id, 'APPROVED')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-lg transition-colors">
                          Approve ✓
                        </button>
                        <button onClick={() => onUpdateDoc(d.id, 'REJECTED')} className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        d.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {d.status}
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
            {student.tests.length === 0 && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-500">
                No standardized tests required for this application.
              </div>
            )}
            {student.tests.map((t: any) => (
              <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{t.test_type}</span>
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    {t.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{t.notes}</p>
              </div>
            ))}
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
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                className="flex-1 bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A0060]"
              />
              <button 
                onClick={() => { onAddNote(noteText); setNoteText(""); }}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors shrink-0"
              >
                Add Note
              </button>
            </div>
            <div className="space-y-2">
              {student.notes.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No internal notes yet.</p>
              )}
              {student.notes.map((note: any) => (
                <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-700">{note.author_name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-800">{note.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
