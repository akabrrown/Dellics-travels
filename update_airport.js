const fs = require('fs');
const path = 'apps/web/src/components/ui/airport-combobox.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'gap-2 bg-white ${',
  'gap-2 bg-white/50 backdrop-blur-sm ${'
);
content = content.replace(
  'border-slate-200 hover:border-slate-300 shadow-2xs',
  'border-white/40 hover:border-white/60 shadow-sm'
);

content = content.replace(
  'mt-1.5 bg-white rounded-2xl border border-slate-100 shadow-xl',
  'mt-1.5 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl'
);
content = content.replace(
  'flex items-center gap-2 bg-slate-50/50',
  'flex items-center gap-2 bg-white/40 backdrop-blur-md'
);

fs.writeFileSync(path, content);
console.log('Updated airport-combobox.tsx');
