const fs = require('fs');
const path = 'apps/web/src/components/flights/flight-search-widget.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. TabsList (Trip Type)
content = content.replace(
  'bg-white/60 backdrop-blur-md p-1 rounded-full h-9 border border-white/50 shadow-2xs',
  'bg-white/20 backdrop-blur-md p-1 rounded-full h-9 border border-white/30 shadow-sm'
);

// 2. Cabin Class SelectTrigger
content = content.replace(
  'border-slate-200/80 bg-white/90 text-slate-700 w-32 shadow-2xs focus:bg-white',
  'border-white/40 bg-white/50 backdrop-blur-sm text-slate-700 w-32 shadow-sm focus:bg-white transition-colors'
);

// 3. Inputs (departDate, returnDate)
content = content.replaceAll(
  'bg-white border-slate-200 text-xs font-semibold text-slate-900 shadow-2xs',
  'bg-white/50 backdrop-blur-sm border-white/40 text-xs font-semibold text-slate-900 shadow-sm focus:bg-white transition-colors'
);
content = content.replaceAll(
  'bg-white border-slate-200 text-xs font-semibold text-slate-900',
  'bg-white/50 backdrop-blur-sm border-white/40 text-xs font-semibold text-slate-900 focus:bg-white transition-colors'
);

// 4. Multi-city rows
content = content.replaceAll(
  'border border-slate-200/80 bg-slate-50/60',
  'border border-white/30 bg-white/20 backdrop-blur-md shadow-inner'
);

fs.writeFileSync(path, content);
console.log('Updated flight-search-widget.tsx');
