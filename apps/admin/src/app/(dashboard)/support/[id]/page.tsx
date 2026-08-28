"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Shield,
  FileText,
} from "lucide-react";

interface MessageItem {
  id: string;
  sender: "TRAVELER" | "AGENT" | "SYSTEM";
  name: string;
  content: string;
  timestamp: string;
  isInternalNote?: boolean;
}

export default function SupportTicketDetail() {
  const params = useParams();
  const ticketId = typeof params?.id === "string" ? params.id : "T-992";

  const [activeReplyMode, setActiveReplyMode] = useState<"REPLY" | "INTERNAL">("REPLY");
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState<"OPEN" | "RESOLVED">("OPEN");

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "1",
      sender: "TRAVELER",
      name: "Ama Osei",
      content: "Hello Dellics Support, I have an urgent date change request for my Emirates flight to Dubai. My business conference was shifted by two days. Can you please assist with rebooking?",
      timestamp: "Yesterday at 09:30 AM",
    },
    {
      id: "2",
      sender: "SYSTEM",
      name: "SLA Router",
      content: "Ticket automatically prioritized for Elite Member Ama Osei (< 2hr target SLA).",
      timestamp: "Yesterday at 09:31 AM",
    },
    {
      id: "3",
      sender: "AGENT",
      name: "Jane Doe (Support Ops)",
      content: "Checked Duffel GDS inventory for EK 788 on Oct 20. Seats available in Economy Flex with no fare difference penalty.",
      timestamp: "Yesterday at 11:45 AM",
      isInternalNote: true,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: MessageItem = {
      id: Date.now().toString(),
      sender: "AGENT",
      name: "Support Desk",
      content: replyText.trim(),
      timestamp: "Just now",
      isInternalNote: activeReplyMode === "INTERNAL",
    };

    setMessages([...messages, newMsg]);
    setReplyText("");
  };

  const handleResolve = () => {
    setStatus("RESOLVED");
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "SYSTEM",
        name: "Dellics Desk",
        content: "Ticket marked as RESOLVED by Support Agent.",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <Link
          href="/support"
          className="text-xs font-semibold text-slate-500 hover:text-[#0A0060] mb-2 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Inquiries Queue</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 text-rose-800">
                HIGH PRIORITY
              </span>
              <h1 className="font-display text-2xl font-bold text-[#0A0060]">
                Ticket #{ticketId}: Date Change & Rebooking
              </h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Opened by Ama Osei (Elite Member) · Flight #BK-8392
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status === "OPEN" ? (
              <button
                onClick={handleResolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs transition-colors shadow-xs"
              >
                Mark as Resolved
              </button>
            ) : (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                ✓ Resolved
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Messages Thread (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Threaded Conversation
            </h3>
            <span className="text-xs text-slate-500">{messages.length} messages</span>
          </div>

          <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "SYSTEM"
                    ? "items-center"
                    : msg.sender === "AGENT"
                      ? "items-end"
                      : "items-start"
                }`}
              >
                {msg.sender === "SYSTEM" ? (
                  <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] text-center border border-slate-200">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-md space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.name}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.isInternalNote
                          ? "bg-amber-50 border border-amber-200 text-amber-900 italic font-mono text-[11px]"
                          : msg.sender === "AGENT"
                            ? "bg-[#0A0060] text-white rounded-tr-none"
                            : "bg-slate-100 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      {msg.isInternalNote && (
                        <span className="block font-bold text-[10px] uppercase text-amber-700 not-italic mb-1">
                          🔒 Internal Ops Note (Admin Only)
                        </span>
                      )}
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveReplyMode("REPLY")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeReplyMode === "REPLY"
                    ? "bg-[#0A0060] text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Reply to Traveler
              </button>
              <button
                type="button"
                onClick={() => setActiveReplyMode("INTERNAL")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeReplyMode === "INTERNAL"
                    ? "bg-amber-600 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Post Internal Ops Note
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-2">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  activeReplyMode === "REPLY"
                    ? "Type your response to the traveler..."
                    : "Add an internal note visible only to admins and support staff..."
                }
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => alert("Upload dialog opened for e-ticket / voucher attachment.")}
                  className="p-2 text-slate-500 hover:text-[#0A0060] text-xs font-bold inline-flex items-center gap-1"
                >
                  <Paperclip className="size-3.5" />
                  <span>Attach Document</span>
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-full text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs ${
                    activeReplyMode === "REPLY" ? "bg-[#F4740D] hover:bg-[#d6660b]" : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  <Send className="size-3.5" />
                  <span>{activeReplyMode === "REPLY" ? "Send Reply" : "Save Note"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Traveler & Linked Entity Info (1 col) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Traveler Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                AO
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Ama Osei</p>
                <p className="text-[11px] text-slate-500">ama.osei@example.com</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Elite Member
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Associated Booking
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID:</span>
                <Link href="/bookings/BK-8392" className="font-mono font-bold text-[#0A0060] hover:underline">
                  #BK-8392
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Route:</span>
                <span className="font-semibold text-slate-900">ACC → DXB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PNR:</span>
                <span className="font-mono font-bold text-slate-900">7F9K2A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Airline:</span>
                <span className="font-semibold text-slate-900">Emirates (EK 788)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
