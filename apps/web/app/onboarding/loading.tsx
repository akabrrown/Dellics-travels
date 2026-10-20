export default function OnboardingLoading() {
  return (
    <div className="min-h-screen w-full bg-[#050038] text-white flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-4 w-20 bg-white/10 rounded-full animate-pulse" />
      </div>

      <div className="max-w-2xl mx-auto w-full my-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="h-4 w-28 bg-orange-100 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />

          <div className="space-y-3 pt-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          <div className="h-10 w-32 bg-orange-100 rounded-lg animate-pulse ml-auto" />
        </div>
      </div>

      <div className="h-3 w-40 bg-white/10 rounded mx-auto animate-pulse" />
    </div>
  );
}
