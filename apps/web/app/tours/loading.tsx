export default function ToursLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner Skeleton */}
      <div className="bg-navy py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy animate-shimmer opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="h-5 w-36 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-72 bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Category Pills Filter Skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 w-28 bg-white border border-slate-200 rounded-full shadow-xs shrink-0 animate-pulse"
            />
          ))}
        </div>

        {/* Tours Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm space-y-4 p-4"
            >
              <div className="h-60 w-full bg-slate-100 rounded-2xl animate-shimmer relative">
                <div className="absolute top-3 left-3 h-6 w-20 bg-white/80 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-slate-100 rounded-md animate-pulse" />
                  <div className="h-4 w-20 bg-orange-50 rounded-md animate-pulse" />
                </div>
                <div className="h-6 w-5/6 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-3 w-12 bg-slate-100 rounded-md animate-pulse" />
                  <div className="h-6 w-24 bg-slate-300 rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-brand-orange/20 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
