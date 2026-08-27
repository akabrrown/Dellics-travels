export default function AdminContentEditLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-7 w-56 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-orange-100 rounded-xl animate-pulse" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="h-48 w-full bg-slate-50 border border-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
