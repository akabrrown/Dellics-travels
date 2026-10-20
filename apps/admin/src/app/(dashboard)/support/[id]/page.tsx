"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Paperclip,
  Send,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface InquiryRecord {
  id: string;
  kind: "INQUIRY" | "CONTACT";
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  payload?: {
    destination?: string;
    travelDate?: string;
    travelers?: string;
  } | null;
  created_at: string;
}

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
  const ticketId = typeof params?.id === "string" ? params.id : "";

  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeReplyMode, setActiveReplyMode] = useState<"REPLY" | "INTERNAL">("REPLY");
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState<"OPEN" | "RESOLVED">("OPEN");
  const [messages, setMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    if (!ticketId) return;
    (async () => {
      try {
        setLoading(true);
        const [res, interactionsRes] = await Promise.all([
          adminApi.get<{ data: InquiryRecord }>(`/inquiries/${ticketId}`),
          adminApi.get<{ data: any[] }>(`/crm/interactions/inquiry/${ticketId}`).catch(() => ({ data: [] }))
        ]);
        
        if (res?.data) {
          setInquiry(res.data);
          
          if (interactionsRes?.data && interactionsRes.data.length > 0) {
            setMessages(interactionsRes.data.map((interaction: any) => {
              const isInternal = interaction.channel === 'NOTE';
              const isSystem = interaction.channel === 'SYSTEM';
              let sender = isInternal ? 'AGENT' : (isSystem ? 'SYSTEM' : 'AGENT');
              if (interaction.channel === 'WEB_INQUIRY') sender = 'TRAVELER';
              
              let name = isInternal ? 'Support Desk' : (isSystem ? 'Dellics Desk' : 'Support Desk');
              if (interaction.channel === 'WEB_INQUIRY') name = res.data.name;
              
              return {
                id: interaction.id,
                sender: sender as "TRAVELER" | "AGENT" | "SYSTEM",
                name: name,
                content: interaction.content,
                timestamp: new Date(interaction.created_at).toLocaleString(),
                isInternalNote: isInternal,
              };
            }));
          } else {
            setMessages([
              {
                id: "initial",
                sender: "TRAVELER",
                name: res.data.name,
                content: res.data.message,
                timestamp: new Date(res.data.created_at).toLocaleString(),
              },
            ]);
          }
        }
      } catch (err: any) {
        setError(err?.message ?? "Failed to load inquiry.");
      } finally {
        setLoading(false);
      }
    })();
  }, [ticketId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      await adminApi.post("/crm/interactions", {
        inquiry_id: ticketId,
        channel: activeReplyMode === "INTERNAL" ? "NOTE" : "EMAIL",
        subject: activeReplyMode === "INTERNAL" ? "Internal Note" : "Reply",
        content: replyText.trim(),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "AGENT",
          name: "Support Desk",
          content: replyText.trim(),
          timestamp: new Date().toLocaleString(),
          isInternalNote: activeReplyMode === "INTERNAL",
        },
      ]);
      setReplyText("");
    } catch (err) {
      console.error("Failed to post message", err);
    }
  };

  const handleResolve = async () => {
    try {
      await adminApi.post("/crm/interactions", {
        inquiry_id: ticketId,
        channel: "SYSTEM",
        subject: "Ticket Resolved",
        content: "Ticket marked as RESOLVED by Support Agent.",
      });
      setStatus("RESOLVED");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "SYSTEM",
          name: "Dellics Desk",
          content: "Ticket marked as RESOLVED by Support Agent.",
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to post resolve", err);
    }
  };

  const initials = inquiry
    ? inquiry.name.split(" ").map((p: string) => p[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-500 text-sm gap-2">
        <RefreshCw className="size-4 animate-spin" />
        <span>Loading inquiry...</span>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="max-w-5xl mx-auto">
        <Link href="/support" className="text-xs font-semibold text-slate-500 hover:text-[#0A0060] mb-6 inline-flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="size-3.5" />
          <span>Back to Inquiries Queue</span>
        </Link>
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm mt-4">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error ?? "Inquiry not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div>
        <Link href="/support" className="text-xs font-semibold text-slate-500 hover:text-[#0A0060] mb-2 inline-flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="size-3.5" />
          <span>Back to Inquiries Queue</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${inquiry.kind === "INQUIRY" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                {inquiry.kind}
              </span>
              <h1 className="font-display text-2xl font-bold text-[#0A0060]">
                Inquiry from {inquiry.name}
              </h1>
            </div>
            <p className="text-slate-500 text-xs mt-1 font-mono">
              #{inquiry.id.slice(0, 8)}... · Received {new Date(inquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status === "OPEN" ? (
              <button onClick={handleResolve} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs transition-colors shadow-xs">
                Mark as Resolved
              </button>
            ) : (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Resolved</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-display font-bold text-sm text-slate-900">Conversation Thread</h3>
            <span className="text-xs text-slate-500">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "SYSTEM" ? "items-center" : msg.sender === "AGENT" ? "items-end" : "items-start"}`}>
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
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.isInternalNote ? "bg-amber-50 border border-amber-200 text-amber-900 italic font-mono text-[11px]" : msg.sender === "AGENT" ? "bg-[#0A0060] text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"}`}>
                      {msg.isInternalNote && <span className="block font-bold text-[10px] uppercase text-amber-700 not-italic mb-1">Internal Ops Note (Admin Only)</span>}
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setActiveReplyMode("REPLY")} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeReplyMode === "REPLY" ? "bg-[#0A0060] text-white" : "text-slate-600 hover:bg-slate-200"}`}>
                Reply to Customer
              </button>
              <button type="button" onClick={() => setActiveReplyMode("INTERNAL")} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeReplyMode === "INTERNAL" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}>
                Post Internal Note
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-2">
              <textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={activeReplyMode === "REPLY" ? `Type your response to ${inquiry.name}...` : "Add an internal note visible only to admins and support staff..."} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]" />
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => alert("Upload dialog for attachment")} className="p-2 text-slate-500 hover:text-[#0A0060] text-xs font-bold inline-flex items-center gap-1">
                  <Paperclip className="size-3.5" />
                  <span>Attach Document</span>
                </button>
                <button type="submit" className={`px-5 py-2 rounded-full text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs ${activeReplyMode === "REPLY" ? "bg-[#F4740D] hover:bg-[#d6660b]" : "bg-amber-600 hover:bg-amber-700"}`}>
                  <Send className="size-3.5" />
                  <span>{activeReplyMode === "REPLY" ? "Send Reply" : "Save Note"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Customer Information</h3>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">{initials}</div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{inquiry.name}</p>
                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5"><Mail className="size-3 shrink-0" />{inquiry.email}</p>
                {inquiry.phone && <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="size-3 shrink-0" />{inquiry.phone}</p>}
              </div>
            </div>
          </div>

          {inquiry.kind === "INQUIRY" && inquiry.payload && (Object.values(inquiry.payload).some(Boolean)) && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Trip Request Details</h3>
              <div className="space-y-2.5 text-xs">
                {inquiry.payload.destination && (
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Destination</p><p className="font-semibold text-slate-800">{inquiry.payload.destination}</p></div>
                  </div>
                )}
                {inquiry.payload.travelDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Travel Date</p><p className="font-semibold text-slate-800">{inquiry.payload.travelDate}</p></div>
                  </div>
                )}
                {inquiry.payload.travelers && (
                  <div className="flex items-start gap-2">
                    <Users className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Travelers</p><p className="font-semibold text-slate-800">{inquiry.payload.travelers}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Submission Metadata</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Ticket ID:</span>
                <span className="font-mono font-bold text-slate-700 text-[10px] truncate">{inquiry.id.slice(0, 12)}…</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${status === "OPEN" ? "bg-orange-100 text-orange-800" : "bg-emerald-100 text-emerald-800"}`}>{status}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Received:</span>
                <span className="font-semibold text-slate-700">{new Date(inquiry.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Channel:</span>
                <span className="font-semibold text-slate-700">Web Form</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}