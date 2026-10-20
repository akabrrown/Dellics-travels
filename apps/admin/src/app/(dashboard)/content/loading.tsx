export default function AdminContentLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-orange-100 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 space-y-4">
            <div className="h-44 w-full bg-slate-100 rounded-xl animate-shimmer" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="h-3.5 w-1/2 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
              <div className="h-6 w-16 bg-emerald-50 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
