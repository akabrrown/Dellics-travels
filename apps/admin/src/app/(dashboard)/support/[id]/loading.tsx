export default function AdminTicketLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 max-w-4xl">
      <div className="space-y-2">
        <div className="h-4 w-28 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-7 w-64 bg-slate-200 rounded-lg animate-pulse" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-slate-100 animate-shimmer shrink-0" />
          <div className="h-16 w-3/4 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
        </div>
        <div className="flex gap-4 justify-end">
          <div className="h-16 w-3/4 bg-orange-50/60 border border-orange-100 rounded-2xl animate-pulse" />
          <div className="size-10 rounded-full bg-orange-100 animate-shimmer shrink-0" />
        </div>
      </div>
    </div>
  );
}
