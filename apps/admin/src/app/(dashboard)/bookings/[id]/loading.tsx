export default function AdminBookingDetailLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-7 w-64 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-orange-100 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="h-5 w-36 bg-slate-200 rounded-md animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="h-5 w-32 bg-slate-200 rounded-md animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-slate-100 animate-shimmer" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-36 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="h-5 w-36 bg-slate-200 rounded-md animate-pulse" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
                <div className="h-3.5 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                <div className="h-3.5 w-12 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-slate-300 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
