"use client";

export default function CustomerCRMLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-40 bg-slate-200 rounded-lg" />
          <div className="h-3 w-64 bg-slate-100 rounded mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-100 rounded-lg" />
          <div className="h-8 w-20 bg-slate-100 rounded-lg" />
          <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-3">
            <div className="size-7 bg-slate-100 rounded-lg mb-2" />
            <div className="h-5 w-12 bg-slate-200 rounded" />
            <div className="h-2.5 w-16 bg-slate-100 rounded mt-1.5" />
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-white border border-slate-200 rounded-xl" />
        <div className="h-10 w-28 bg-white border border-slate-200 rounded-xl" />
        <div className="h-10 w-28 bg-white border border-slate-200 rounded-xl" />
      </div>

      {/* Segment Tabs */}
      <div className="flex gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`h-9 rounded-lg ${i === 0 ? "w-28 bg-slate-800" : "w-20 bg-white border border-slate-200"}`} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 flex gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 w-16 bg-slate-100 rounded" />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 py-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-slate-100" />
              <div>
                <div className="h-3.5 w-28 bg-slate-200 rounded" />
                <div className="h-2.5 w-36 bg-slate-100 rounded mt-1.5" />
              </div>
            </div>
            <div className="h-5 w-16 bg-slate-100 rounded-full" />
            <div className="h-3 w-14 bg-slate-100 rounded" />
            <div className="flex gap-1">{Array.from({ length: 3 }).map((_, j) => <div key={j} className="size-5 bg-slate-100 rounded" />)}</div>
            <div className="h-3.5 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-8 bg-slate-100 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
