/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

export default function BookingDetail({ params }: { params: { id: string } }) {
  // Use a static ID for scaffold testing if none provided
  const bookingId = params?.id || 'BK-8392';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Breadcrumb */}
      <div>
        <Link href="/bookings" className="text-sm text-gray-500 hover:text-[#0A0060] mb-2 inline-flex items-center">
          &larr; Back to Bookings
        </Link>
        <div className="flex justify-between items-start mt-2">
          <div>
            <h2 className="text-2xl font-bold text-[#0A0060]">Booking #{bookingId}</h2>
            <p className="text-gray-500 text-sm mt-1">Flight (ACC - DXB) • Created Oct 12, 2026</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 text-sm transition-colors">
              Resend Confirmation
            </button>
            <button className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-md hover:bg-red-100 text-sm transition-colors">
              Issue Refund
            </button>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Pipeline Status</h3>
        <div className="flex items-center w-full max-w-3xl">
          <div className="flex flex-col items-center flex-1 relative">
            <div className="w-8 h-8 rounded-full bg-[#1E7A34] text-white flex items-center justify-center font-bold z-10 text-sm">✓</div>
            <p className="text-xs font-medium text-gray-900 mt-2">Held</p>
            <div className="absolute top-4 left-1/2 w-full h-0.5 bg-[#1E7A34] -z-0"></div>
          </div>
          <div className="flex flex-col items-center flex-1 relative">
            <div className="w-8 h-8 rounded-full bg-[#1E7A34] text-white flex items-center justify-center font-bold z-10 text-sm">✓</div>
            <p className="text-xs font-medium text-gray-900 mt-2">Confirmed</p>
            <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-0"></div>
          </div>
          <div className="flex flex-col items-center flex-1 relative">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold z-10 text-sm">3</div>
            <p className="text-xs font-medium text-gray-500 mt-2">Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Itinerary Details */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Itinerary Details</h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-gray-900">Dellics Air (DA 402)</h4>
                  <p className="text-sm text-gray-500">Economy Class • PNR: X7B9L2</p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#E7F5EA] text-[#1E7A34]">Confirmed</span>
              </div>
              
              <div className="flex items-center justify-between border-l-2 border-gray-200 pl-4 ml-2 space-y-6 relative">
                <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                <div className="absolute bottom-0 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                
                <div className="w-full">
                  <div className="flex justify-between w-full">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">08:20</p>
                      <p className="text-sm text-gray-500">Accra (ACC)</p>
                      <p className="text-xs text-gray-400 mt-1">Oct 18, 2026</p>
                    </div>
                  </div>
                  
                  <div className="py-4 text-xs font-medium text-gray-400">5h 45m • Nonstop</div>
                  
                  <div className="flex justify-between w-full">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">14:05</p>
                      <p className="text-sm text-gray-500">Dubai (DXB)</p>
                      <p className="text-xs text-gray-400 mt-1">Oct 18, 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Internal Notes</h3>
              <button className="text-[#0A0060] text-sm font-medium hover:underline">+ Add Note</button>
            </div>
            <div className="p-4 bg-yellow-50/50 text-sm text-gray-700 italic">
              "Customer called to verify baggage allowance on Oct 14. Confirmed 2x 23kg." - Jane Doe
            </div>
          </div>
        </div>

        {/* Traveler & Finance sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Traveler</h3>
            </div>
            <div className="p-4">
              <Link href="/travelers/TRV-102" className="flex items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center text-gray-600 font-bold group-hover:bg-[#0A0060] group-hover:text-white transition-colors">
                  KM
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 group-hover:text-[#0A0060] transition-colors">Kwame Mensah</p>
                  <p className="text-xs text-gray-500">kwame.m@example.com</p>
                  <p className="text-xs text-gray-500">+233 55 123 4567</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Payment</h3>
              <Link href="/finance" className="text-[#F4740D] text-xs font-medium hover:underline">View in Stripe</Link>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Total Charged</span>
                <span className="font-bold text-gray-900">GHS 2,150.00</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-500">Method</span>
                <span className="text-gray-900">Visa •••• 4242</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-[#1E7A34] font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A34] mr-1.5"></span>
                  Succeeded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
