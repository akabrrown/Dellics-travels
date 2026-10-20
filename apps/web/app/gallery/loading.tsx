export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <div className="bg-navy py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy animate-shimmer opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="h-5 w-32 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-72 bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Category Pills Filter */}
        <div className="flex justify-center gap-3 overflow-x-auto pb-2">
          {["All Photos", "Destinations", "Tours", "Aviation", "Events"].map((tab) => (
            <div
              key={tab}
              className="h-10 w-28 bg-white border border-slate-200 rounded-full shadow-xs shrink-0 animate-pulse"
            />
          ))}
        </div>

        {/* Gallery Image Grid Skeleton */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[
            "h-64",
            "h-80",
            "h-72",
            "h-96",
            "h-64",
            "h-80",
            "h-72",
            "h-64",
          ].map((hClass, i) => (
            <div
              key={i}
              className={`w-full ${hClass} bg-white rounded-3xl p-3 border border-slate-200/70 shadow-xs break-inside-avoid`}
            >
              <div className="w-full h-full bg-slate-100 rounded-2xl animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
