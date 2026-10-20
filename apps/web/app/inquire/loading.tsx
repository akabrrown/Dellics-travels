export default function InquireLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <div className="bg-navy py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy animate-shimmer opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="h-5 w-36 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-80 bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="h-6 w-56 bg-slate-200 rounded-lg animate-pulse" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
          </div>

          <div className="h-32 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />

          <div className="h-12 w-full bg-brand-orange/25 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
