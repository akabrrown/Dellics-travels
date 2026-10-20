export default function TransfersLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <div className="bg-navy py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy animate-shimmer opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="h-5 w-36 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-72 bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="h-48 w-full bg-slate-100 rounded-2xl animate-shimmer" />
              <div className="h-6 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <div className="h-6 w-20 bg-slate-200 rounded-md animate-pulse" />
                <div className="h-10 w-28 bg-brand-orange/20 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
