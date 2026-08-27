export default function AdminBookingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-orange-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="h-10 flex-1 w-full bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
        <div className="h-10 w-full sm:w-36 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
        <div className="h-10 w-full sm:w-36 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
      </div>

      {/* Bookings Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-100 grid grid-cols-6 gap-4">
          {["Booking Ref", "Traveler", "Type & Route", "Amount", "Status", "Actions"].map(
            (h, i) => (
              <div key={i} className="h-4 w-20 bg-slate-200/80 rounded animate-pulse" />
            ),
          )}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="px-6 py-4 grid grid-cols-6 gap-4 items-center">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-slate-100 animate-shimmer shrink-0" />
                <div className="space-y-1">
                  <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-2.5 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-slate-300 rounded font-semibold animate-pulse" />
              <div className="h-6 w-20 bg-emerald-50 rounded-full animate-pulse" />
              <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
