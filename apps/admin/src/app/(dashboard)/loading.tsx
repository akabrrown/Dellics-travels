export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-36 bg-orange-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-100 rounded-md animate-pulse" />
              <div className="size-9 bg-orange-50 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-32 bg-slate-300 rounded-lg animate-pulse" />
              <div className="h-3 w-28 bg-emerald-50 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-44 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-8 w-28 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-72 w-full bg-slate-50 rounded-xl animate-shimmer" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="h-5 w-36 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-72 w-full bg-slate-50 rounded-xl animate-shimmer" />
        </div>
      </div>

      {/* Recent Bookings Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-100 animate-shimmer" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
                  <div className="h-3 w-20 bg-slate-100 rounded-md animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-28 bg-slate-100 rounded-md animate-pulse hidden sm:block" />
              <div className="h-6 w-20 bg-emerald-50 rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
