export default function LegalLoading() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-40 bg-slate-100 rounded-md animate-pulse" />
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
          <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-4 w-4/5 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="space-y-3 pt-6">
          <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
          <div className="h-4 w-full bg-slate-100 rounded-md animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-100 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
