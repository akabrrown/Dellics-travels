import React from 'react';
import Link from 'next/link';

export default function PackageEditor({ params }: { params: { id: string } }) {
  const isNew = params?.id === 'new';
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div>
        <Link href="/content" className="text-sm text-gray-500 hover:text-[#0A0060] mb-2 inline-flex items-center">
          &larr; Back to Content
        </Link>
        <div className="flex justify-between items-start mt-2">
          <div>
            <h2 className="text-2xl font-bold text-[#0A0060]">
              {isNew ? 'Create New Package' : `Edit Package ${params.id}`}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Configure pricing, dates, and included components.</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 text-sm transition-colors">
              Save as Draft
            </button>
            <button className="px-4 py-2 bg-[#F4740D] text-white font-medium rounded-md hover:bg-[#d6660b] text-sm transition-colors">
              Publish Live
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* General Details */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">General Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0A0060]" placeholder="e.g. Cape Coast Weekend Escape" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0A0060]" placeholder="Describe the package benefits..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Destination</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0A0060]" placeholder="e.g. Cape Coast, Ghana" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity Window</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0A0060]" placeholder="Oct 1 - Oct 31, 2026" />
              </div>
            </div>
          </div>

          {/* Package Components */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-semibold text-gray-800">Included Components</h3>
              <button className="text-[#0A0060] text-sm font-medium hover:underline">+ Add Component</button>
            </div>
            
            {/* Component Item 1 */}
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#0A0060] text-white mb-2">HOTEL</span>
                <p className="font-bold text-gray-900">Ridge Royal Hotel</p>
                <p className="text-sm text-gray-500">2 Nights • Standard Double Room</p>
              </div>
              <button className="text-gray-400 hover:text-red-500">Remove</button>
            </div>
            
            {/* Component Item 2 */}
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#F4740D] text-white mb-2">ACTIVITY</span>
                <p className="font-bold text-gray-900">Kakum National Park Canopy Walk</p>
                <p className="text-sm text-gray-500">2 Adult Tickets</p>
              </div>
              <button className="text-gray-400 hover:text-red-500">Remove</button>
            </div>
          </div>
        </div>

        {/* Sidebar Pricing & Preview */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Pricing & Discount</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Total Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">GHS</span>
                  <input type="number" className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0A0060]" placeholder="1,200.00" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Price (Traveler pays)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">GHS</span>
                  <input type="number" className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-[#0A0060] rounded-md text-sm focus:outline-none focus:border-[#F4740D]" placeholder="890.00" />
                </div>
              </div>
              
              <div className="p-3 bg-[#E7F5EA] rounded-md border border-green-200">
                <p className="text-xs text-[#1E7A34] font-medium text-center">Travelers save GHS 310.00 (25%)</p>
              </div>
            </div>
          </div>
          
          <button className="w-full py-3 bg-[#0A0060] text-white font-medium rounded-xl hover:bg-[#030067] transition-colors shadow-sm">
            Preview on Mobile
          </button>
        </div>
      </div>
    </div>
  );
}
