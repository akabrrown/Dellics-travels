const fs = require('fs');
const files = [
  'apps/consult/src/app/globals.css',
  'apps/consult/src/app/layout.tsx',
  'apps/consult/src/components/layout/site-header.tsx',
  'apps/consult/src/components/layout/site-footer.tsx',
  'apps/consult/src/app/login/page.tsx',
  'apps/consult/src/app/signup/page.tsx'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`BOM removed from ${file}`);
  }
}
