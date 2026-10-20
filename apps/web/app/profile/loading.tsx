export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-20 sm:size-24 rounded-full bg-slate-100 animate-shimmer shrink-0" />
              <div className="space-y-2">
                <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-64 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-6 w-32 bg-emerald-50 rounded-full animate-pulse mt-1" />
              </div>
            </div>
            <div className="h-12 w-40 bg-orange-100 rounded-2xl animate-pulse" />
          </div>

          {/* Quick Metrics Bar Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="h-3.5 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-24 bg-slate-300 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-2 border-b border-slate-200">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-11 w-36 bg-slate-200 rounded-2xl animate-pulse shrink-0" />
          ))}
        </div>

        {/* Tab Content Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="h-6 w-36 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100 animate-shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
