export default function GlobalWebLoading() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-300">
      {/* Hero Banner Shimmer */}
      <div className="relative w-full h-[480px] bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-shimmer" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4 w-full">
          <div className="h-6 w-48 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-12 w-3/4 max-w-2xl bg-white/25 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-1/2 max-w-md bg-white/15 rounded-lg mx-auto animate-pulse" />
          
          {/* Floating Search Bar Skeleton */}
          <div className="mt-8 bg-white rounded-3xl p-4 shadow-2xl max-w-3xl mx-auto border border-slate-100 flex gap-3">
            <div className="h-12 flex-1 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-12 flex-1 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-12 w-36 bg-orange-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid of Cards Shimmer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-orange-100 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-4 overflow-hidden"
            >
              <div className="h-48 w-full bg-slate-100 rounded-2xl animate-shimmer" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded-md animate-pulse" />
              </div>
              <div className="pt-2 flex justify-between items-center border-t border-slate-50">
                <div className="h-6 w-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-8 w-24 bg-orange-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
