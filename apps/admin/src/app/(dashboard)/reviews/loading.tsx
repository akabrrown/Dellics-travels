export default function AdminReviewsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="space-y-1.5">
        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-100 animate-shimmer" />
              <div className="space-y-1">
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-3.5 w-20 bg-orange-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
