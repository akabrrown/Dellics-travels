export default function AdminTravelerDetailLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-7 w-56 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-orange-100 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="h-5 w-32 bg-slate-200 rounded-md animate-pulse" />
          <div className="size-16 rounded-full bg-slate-100 animate-shimmer mx-auto" />
          <div className="h-4 w-32 bg-slate-200 rounded mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}
