/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

export default function SupportTicketDetail({ params }: { params: { id: string } }) {
  const ticketId = params?.id || 'T-992';

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-4">
      {/* Header & Breadcrumb */}
      <div className="shrink-0">
        <Link href="/support" className="text-sm text-gray-500 hover:text-[#0A0060] mb-2 inline-flex items-center">
          &larr; Back to Queue
        </Link>
        <div className="flex justify-between items-start mt-2">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDEEE2] text-[#B5540B]">HIGH PRIORITY</span>
              <span className="text-gray-500 text-sm">#{ticketId}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0A0060]">Medical emergency cancellation</h2>
            <p className="text-gray-500 text-sm mt-1">Opened by Ama Osei • 26 hours ago</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 text-sm transition-colors">
              Reassign
            </button>
            <button className="px-4 py-2 bg-[#1E7A34] text-white font-medium rounded-md hover:bg-green-700 text-sm transition-colors">
              Mark as Resolved
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Chat / Thread */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Conversation</h3>
          </div>
          
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Traveler Message */}
            <div className="flex space-x-3 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex shrink-0 items-center justify-center text-xs font-bold text-gray-600">AO</div>
              <div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800">
                  Hi, I have a medical emergency and need to cancel my hotel booking for next week. I know it's a non-refundable rate but I have a doctor's note. Is there anything you can do?
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">Yesterday at 09:30 AM</p>
              </div>
            </div>

            {/* System Note */}
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100">
                Ticket automatically escalated to High Priority due to keywords ("medical emergency")
              </span>
            </div>

            {/* Agent Internal Note */}
            <div className="flex space-x-3 max-w-lg self-end ml-auto justify-end">
              <div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-2xl rounded-tr-none text-sm text-gray-800 italic">
                  Internal note: Reached out to RateHawk (supplier). They agreed to waive the cancellation fee if we provide the doctor's note. Waiting on traveler to upload it.
                </div>
                <p className="text-xs text-gray-400 mt-1 mr-1 text-right">Yesterday at 11:45 AM • Jane Doe</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0A0060] flex shrink-0 items-center justify-center text-xs font-bold text-white">JD</div>
            </div>
            
            {/* Traveler Upload */}
            <div className="flex space-x-3 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex shrink-0 items-center justify-center text-xs font-bold text-gray-600">AO</div>
              <div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800">
                  Here is the doctor's note as requested.
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200 flex items-center space-x-2 cursor-pointer hover:border-[#0A0060]">
                    <span className="text-gray-400">📄</span>
                    <span className="text-xs font-medium text-[#0A0060]">medical_note_2026.pdf</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">Today at 10:15 AM</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2 border-b border-gray-200 mb-3">
              <button className="pb-2 border-b-2 border-[#0A0060] text-[#0A0060] text-sm font-medium">Reply to Traveler</button>
              <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 text-sm font-medium">Internal Note</button>
            </div>
            <textarea 
              rows={3} 
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0A0060] resize-none"
              placeholder="Type your reply to Ama..."
            />
            <div className="flex justify-between items-center mt-2">
              <button className="text-gray-400 hover:text-gray-600">📎 Attach</button>
              <button className="px-4 py-2 bg-[#F4740D] text-white font-medium rounded-md hover:bg-[#d6660b] text-sm transition-colors">
                Send Reply
              </button>
            </div>
          </div>
        </div>

        {/* Context Sidebar */}
        <div className="col-span-1 space-y-6 overflow-y-auto pr-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Related Booking</h3>
              <Link href="/bookings/BK-8391" className="text-[#F4740D] text-xs font-medium hover:underline">View Detail</Link>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">#BK-8391</p>
                  <p className="text-sm text-gray-500">Hotel (Kempinski)</p>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FDEEE2] text-[#B5540B]">Needs Attention</span>
              </div>
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Total:</span> GHS 4,200.00</p>
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Dates:</span> Oct 20 - Oct 25</p>
              <button className="w-full mt-3 py-1.5 border border-red-200 text-red-700 bg-red-50 text-xs font-medium rounded hover:bg-red-100 transition-colors">
                Escalate to Refund Queue
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Traveler Info</h3>
              <Link href="/travelers/TRV-103" className="text-[#F4740D] text-xs font-medium hover:underline">Profile</Link>
            </div>
            <div className="p-4">
              <p className="font-bold text-gray-900 mb-1">Ama Osei</p>
              <p className="text-sm text-gray-500 mb-1">ama.osei@example.com</p>
              <p className="text-sm text-gray-500 mb-3">+233 24 987 6543</p>
              
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">MEMBERSHIP</p>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-700">Explorer (Base)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
