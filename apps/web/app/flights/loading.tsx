export default function FlightsLoading() {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Flight Search Panel Skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
          <div className="flex gap-4">
            <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
            <div className="h-8 w-28 bg-slate-100 rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-14 bg-slate-50 border border-slate-200/70 rounded-2xl animate-pulse" />
            <div className="h-14 bg-slate-50 border border-slate-200/70 rounded-2xl animate-pulse" />
            <div className="h-14 bg-slate-50 border border-slate-200/70 rounded-2xl animate-pulse" />
            <div className="h-14 bg-brand-orange/20 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Flight Search Results Skeleton List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse" />
          </div>

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6"
            >
              {/* Airline Info */}
              <div className="flex items-center gap-4 w-full lg:w-48">
                <div className="size-12 rounded-xl bg-slate-100 animate-shimmer shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-slate-200 rounded-md animate-pulse" />
                  <div className="h-3 w-16 bg-slate-100 rounded-md animate-pulse" />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-6 flex-1 w-full justify-center">
                <div className="text-center space-y-1.5">
                  <div className="h-5 w-16 bg-slate-200 rounded-md mx-auto animate-pulse" />
                  <div className="h-3 w-12 bg-slate-100 rounded-md mx-auto animate-pulse" />
                </div>
                <div className="flex-1 max-w-[200px] flex flex-col items-center gap-1">
                  <div className="h-2.5 w-14 bg-slate-100 rounded-full animate-pulse" />
                  <div className="w-full h-0.5 bg-slate-200 relative" />
                  <div className="h-2 w-10 bg-slate-100 rounded-full animate-pulse" />
                </div>
                <div className="text-center space-y-1.5">
                  <div className="h-5 w-16 bg-slate-200 rounded-md mx-auto animate-pulse" />
                  <div className="h-3 w-12 bg-slate-100 rounded-md mx-auto animate-pulse" />
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-40 gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="space-y-1 text-right">
                  <div className="h-3 w-14 bg-slate-100 rounded-md ml-auto animate-pulse" />
                  <div className="h-6 w-24 bg-slate-300 rounded-lg ml-auto animate-pulse" />
                </div>
                <div className="h-10 w-28 bg-brand-orange/25 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
