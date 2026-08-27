export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 space-y-16">
      <div className="bg-navy py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy animate-shimmer opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="h-5 w-32 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-80 bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="h-4 w-28 bg-orange-100 rounded-md animate-pulse" />
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-md animate-pulse" />
            <div className="h-4 w-4/5 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="h-80 w-full bg-slate-100 rounded-3xl animate-shimmer" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center space-y-2"
            >
              <div className="h-8 w-20 bg-slate-300 rounded-lg mx-auto animate-pulse" />
              <div className="h-3.5 w-28 bg-slate-100 rounded-md mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
