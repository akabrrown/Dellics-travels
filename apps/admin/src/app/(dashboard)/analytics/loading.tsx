export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="space-y-1.5">
        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
            <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
            <div className="h-7 w-32 bg-slate-300 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="h-5 w-44 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-50 rounded-xl animate-shimmer" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="h-5 w-44 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-50 rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
