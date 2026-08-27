import React from 'react';
import Link from 'next/link';

export default function TravelerDetail({ params }: { params: { id: string } }) {
  const travelerId = params?.id || 'TRV-102';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Breadcrumb */}
      <div>
        <Link href="/travelers" className="text-sm text-gray-500 hover:text-[#0A0060] mb-2 inline-flex items-center">
          &larr; Back to Travelers
        </Link>
        <div className="flex justify-between items-start mt-2">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#0A0060] text-white flex items-center justify-center font-bold text-2xl mr-4 shadow-sm">
              KM
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kwame Mensah</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {travelerId} • Joined Mar 2024</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 text-sm transition-colors">
              Reset Password
            </button>
            <button className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-md hover:bg-red-100 text-sm transition-colors">
              Suspend Account
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Booking History</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium">Booking ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><Link href="/bookings/BK-8392" className="font-medium text-[#0A0060] hover:underline">#BK-8392</Link></td>
                    <td className="px-4 py-3 text-gray-600">Oct 12, 2026</td>
                    <td className="px-4 py-3 text-gray-600">Flight</td>
                    <td className="px-4 py-3 font-medium">GHS 2,150.00</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#E7F5EA] text-[#1E7A34]">Confirmed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><Link href="/bookings/BK-7211" className="font-medium text-[#0A0060] hover:underline">#BK-7211</Link></td>
                    <td className="px-4 py-3 text-gray-600">Aug 04, 2026</td>
                    <td className="px-4 py-3 text-gray-600">Hotel</td>
                    <td className="px-4 py-3 font-medium">GHS 3,400.00</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-3 border-t border-gray-100 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-[#0A0060]">View all 14 bookings</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Support Notes</h3>
              <button className="text-[#0A0060] text-sm font-medium hover:underline">+ Add Note</button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center text-xs font-bold text-gray-600">JD</div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Jane Doe (Support Agent)</p>
                    <p className="text-sm text-gray-700">Traveler prefers aisle seats. Added preference to their underlying profile.</p>
                    <p className="text-xs text-gray-400 mt-2">Oct 12, 2026 at 10:14 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Contact Info</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">kwame.m@example.com</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900">+233 55 123 4567</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900">14 Nov 1988</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#F4740D]/30 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Membership</h3>
              <button className="text-[#F4740D] text-xs font-medium hover:underline">Override</button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3 border border-amber-200">
                  <span className="text-amber-700 font-bold text-lg">E</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Elite Tier</p>
                  <p className="text-xs text-gray-500">Gold Status</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Points Balance</span>
                  <span className="font-bold text-gray-900">14,250 pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lifetime Spend</span>
                  <span className="font-medium text-gray-900">GHS 24,190.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
