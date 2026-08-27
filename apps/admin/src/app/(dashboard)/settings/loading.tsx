export default function AdminSettingsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-4xl">
      <div className="space-y-1.5">
        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
      </div>

      <div className="flex gap-3 border-b border-slate-100 pb-3">
        {["General", "Payment Gateways", "API Integrations", "Notifications", "Security"].map((tab) => (
          <div key={tab} className="h-9 w-28 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="h-11 w-40 bg-orange-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
