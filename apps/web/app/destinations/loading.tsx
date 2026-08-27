export default function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner Skeleton */}
      <div className="bg-navy py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy animate-shimmer opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="h-5 w-36 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-80 bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Region Filter Tabs */}
        <div className="flex justify-center gap-3 overflow-x-auto pb-2">
          {["All Regions", "Africa", "Middle East", "Europe", "Asia", "Americas"].map(
            (r) => (
              <div
                key={r}
                className="h-10 w-28 bg-white border border-slate-200 rounded-full shadow-xs shrink-0 animate-pulse"
              />
            ),
          )}
        </div>

        {/* Destination Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm p-4 space-y-4"
            >
              <div className="h-64 w-full bg-slate-100 rounded-2xl animate-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-orange-100 rounded-md animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-3.5 w-full bg-slate-100 rounded-md animate-pulse" />
              </div>
              <div className="pt-2 flex justify-between items-center border-t border-slate-50">
                <div className="h-4 w-24 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-8 w-24 bg-orange-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
