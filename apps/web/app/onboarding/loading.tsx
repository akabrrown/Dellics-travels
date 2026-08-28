export default function OnboardingLoading() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="h-10 w-20 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-6 w-32 bg-white/10 rounded-full animate-pulse" />
      </div>

      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="h-6 w-40 bg-orange-100 rounded-full animate-pulse" />
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />

          <div className="space-y-4 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
                <div className="h-11 w-full bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>

          <div className="h-12 w-48 bg-orange-100 rounded-2xl animate-pulse ml-auto" />
        </div>
      </div>

      <div className="h-4 w-48 bg-white/10 rounded mx-auto animate-pulse" />
    </div>
  );
}
