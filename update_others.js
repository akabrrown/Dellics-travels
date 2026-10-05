const fs = require('fs');

// 1. viator-tour-search.tsx
const viatorPath = 'apps/web/src/components/tours/viator-tour-search.tsx';
if (fs.existsSync(viatorPath)) {
  let content = fs.readFileSync(viatorPath, 'utf8');
  content = content.replace(
    'bg-white/85 backdrop-blur-xl p-4 sm:p-6 shadow-2xl border border-white/60 ring-1 ring-black/5',
    'bg-white/20 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 ring-1 ring-white/20'
  );
  content = content.replaceAll(
    'bg-white/90 border-slate-200 text-xs sm:text-sm font-medium focus:bg-white shadow-2xs',
    'bg-white/50 backdrop-blur-sm border-white/40 text-xs sm:text-sm font-medium focus:bg-white shadow-sm transition-colors'
  );
  fs.writeFileSync(viatorPath, content);
  console.log('Updated viator-tour-search.tsx');
}

// 2. hotel-search.tsx (empty state card)
const hotelPath = 'apps/web/src/components/hotels/hotel-search.tsx';
if (fs.existsSync(hotelPath)) {
  let content = fs.readFileSync(hotelPath, 'utf8');
  content = content.replace(
    'bg-white/85 p-6 text-center text-slate-500 text-xs font-semibold',
    'bg-white/20 backdrop-blur-md border border-white/30 p-6 text-center text-slate-500 text-xs font-semibold shadow-inner'
  );
  fs.writeFileSync(hotelPath, content);
  console.log('Updated hotel-search.tsx');
}
