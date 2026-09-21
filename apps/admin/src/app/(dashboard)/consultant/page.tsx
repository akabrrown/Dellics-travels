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
  AlertCircle
} from "lucide-react";

type TabType = "crm" | "tests" | "docs" | "visa";

export default function ConsultantPage() {
  const [activeTab, setActiveTab] = useState<TabType>("crm");

  const metrics = [
    { label: "Total Students", value: "248", color: "text-slate-900" },
    { label: "Active Applications", value: "137", color: "text-brand-orange" },
    { label: "Tests Pending", value: "42", color: "text-slate-900" },
    { label: "Uni Submissions", value: "89", color: "text-slate-900" },
    { label: "Visa Processing", value: "31", color: "text-blue-600" },
    { label: "Appointments Today", value: "7", color: "text-emerald-600" },
  ];

  const students = [
    { name: "John Doe", email: "john@example.com", dest: "UK - MSc Data Science", intake: "Sept 2026", stage: "Document Collation", tests: "Pending IELTS", docs: "2/5 Uploaded", status: "In Progress" },
    { name: "Ama Serwaa", email: "ama.s@example.com", dest: "Canada - BSc Nursing", intake: "Jan 2027", stage: "Offer Received", tests: "IELTS Passed", docs: "Complete", status: "Action Required" },
    { name: "Kwasi Mensah", email: "kwasi.m@example.com", dest: "USA - MBA", intake: "Sept 2026", stage: "Visa Application", tests: "GMAT Passed", docs: "Complete", status: "In Progress" },
    { name: "Fatima Ali", email: "fatima@example.com", dest: "UK - LLB Law", intake: "Sept 2026", stage: "Initial Consultation", tests: "Not Required", docs: "0/3 Uploaded", status: "Pending" },
  ];

  return (
    <RoleGuard permission="consultant.view" moduleName="Consultant CRM">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0A0060]">
              Consultant Operations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage student pipelines, university admissions, and test coordination.
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-center">
              <span className={`font-display text-2xl font-extrabold ${m.color}`}>{m.value}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[600px]">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 px-6 pt-6 border-b border-slate-100">
            <button 
              onClick={() => setActiveTab("crm")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "crm" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <Users className="size-4" />
              Student CRM
            </button>
            <button 
              onClick={() => setActiveTab("tests")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "tests" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <Target className="size-4" />
              Tests Coordination
            </button>
            <button 
              onClick={() => setActiveTab("docs")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "docs" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <FolderOpen className="size-4" />
              Documents
            </button>
            <button 
              onClick={() => setActiveTab("visa")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "visa" ? "border-[#0A0060] text-[#0A0060]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <Plane className="size-4" />
              Visa Queue
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1">
            {activeTab === "crm" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Student Applicant Directory</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage active applications and case files.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search students..." 
                        className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A0060]"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700">
                      <Filter className="size-4" /> Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Destination & Course</th>
                        <th className="px-4 py-3">Intake</th>
                        <th className="px-4 py-3">Application Stage</th>
                        <th className="px-4 py-3">Tests</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 text-xs">{s.name}</div>
                            <div className="text-[10px] text-slate-500">{s.email}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 font-medium">{s.dest}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{s.intake}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                              {s.stage}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-600 font-medium">{s.tests}</td>
                          <td className="px-4 py-3">
                            {s.status === "Action Required" ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-brand-orange">
                                <AlertCircle className="size-3" /> {s.status}
                              </span>
                            ) : s.status === "In Progress" ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                                <Clock className="size-3" /> {s.status}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <CheckCircle2 className="size-3" /> {s.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1.5 text-slate-400 hover:text-[#0A0060] rounded-lg hover:bg-slate-100 transition-colors">
                              <MoreVertical className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab !== "crm" && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                  <FolderOpen className="size-8 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Module Pending Integration</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    The {activeTab} view is currently being integrated with the new Dellics CRM backend.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
