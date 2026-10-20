const fs = require('fs');
const path = 'apps/web/src/components/home/quick-book.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Container
content = content.replace(
  'bg-white/90 backdrop-blur-xl p-2.5 sm:p-4.5 shadow-2xl border border-white/60 ring-1 ring-black/5',
  'bg-white/20 backdrop-blur-2xl p-2.5 sm:p-4.5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 ring-1 ring-white/20'
);

// 2. TabsList
content = content.replace(
  'bg-white/70 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex gap-1 sm:gap-1.5 h-auto min-w-max border border-white/50 shadow-2xs',
  'bg-white/20 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex gap-1 sm:gap-1.5 h-auto min-w-max border border-white/30 shadow-sm'
);

// 3. Hotels form container
content = content.replace(
  'className=\"space-y-4 bg-[#f2f2f2] rounded-xl p-4 md:p-6 shadow-inner border border-slate-200\"',
  'className=\"space-y-4 bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-inner border border-white/30\"'
);

// 4. Other forms
content = content.replaceAll(
  'className=\"space-y-3\"',
  'className=\"space-y-3 bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-inner border border-white/30\"'
);

// 5. Inputs and Selects (bg-white border-slate-X) -> bg-white/50 backdrop-blur-sm border-white/40
content = content.replaceAll(
  'bg-white border-slate-200',
  'bg-white/50 backdrop-blur-sm focus:bg-white border-white/40 transition-colors'
);
content = content.replaceAll(
  'bg-white border border-slate-300',
  'bg-white/50 backdrop-blur-sm border border-white/40 transition-colors focus:bg-white'
);
content = content.replaceAll(
  'border border-slate-300 rounded-lg bg-white',
  'border border-white/40 rounded-lg bg-white/50 backdrop-blur-sm transition-colors focus-within:bg-white'
);

// Checkbox in hotels
content = content.replace(
  'border-slate-300 bg-white group-hover:border-[#EBB41E]',
  'border-white/50 bg-white/50 backdrop-blur-sm group-hover:border-[#EBB41E] group-hover:bg-white'
);

fs.writeFileSync(path, content);
console.log('Updated quick-book.tsx');
