export default function AdminFinanceLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-7 w-56 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-orange-100 rounded-xl animate-pulse" />
      </div>

      {/* Paystack Reconciliation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
            <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
            <div className="h-7 w-32 bg-slate-300 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-emerald-50 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-slate-300 rounded font-semibold animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
