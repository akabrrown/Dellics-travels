const fs = require('fs');

// Fix flights page wrapper
const flightPagePath = 'apps/web/app/flights/page.tsx';
if (fs.existsSync(flightPagePath)) {
  let content = fs.readFileSync(flightPagePath, 'utf8');
  content = content.replace(
    'bg-white/85 backdrop-blur-xl p-4 sm:p-5 shadow-2xl border border-white/60 ring-1 ring-black/5',
    'bg-white/20 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 ring-1 ring-white/20'
  );
  fs.writeFileSync(flightPagePath, content);
  console.log('Updated flight page wrapper');
}

// Fix hotel-search.tsx inner form
const hotelPath = 'apps/web/src/components/hotels/hotel-search.tsx';
if (fs.existsSync(hotelPath)) {
  let content = fs.readFileSync(hotelPath, 'utf8');
  content = content.replace(
    'className="space-y-4 bg-[#f2f2f2] rounded-xl p-4 md:p-6 shadow-inner border border-slate-200 text-left"',
    'className="space-y-4 bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-inner border border-white/30 text-left"'
  );
  fs.writeFileSync(hotelPath, content);
  console.log('Updated hotel search inner form');
}
