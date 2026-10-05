const fs = require('fs');
const path = 'apps/web/src/components/transfers/transfer-search-widget.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'bg-white/85 backdrop-blur-xl p-4 sm:p-5 shadow-2xl border border-white/60 ring-1 ring-black/5',
  'bg-white/20 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 ring-1 ring-white/20'
);

content = content.replaceAll(
  'bg-white/90 border-slate-200 text-xs font-medium focus:bg-white shadow-2xs',
  'bg-white/50 backdrop-blur-sm border-white/40 text-xs font-medium focus:bg-white shadow-sm transition-colors'
);

fs.writeFileSync(path, content);
console.log('Updated transfer-search-widget.tsx');
