const fs = require('fs');
const file = 'apps/api/src/hotel-dump/hotel-dump.service.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("import fetch from 'node-fetch';\n", '');
fs.writeFileSync(file, content);

const pkgPath = 'apps/api/package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
delete pkg.dependencies['node-fetch'];
pkg.dependencies['@nestjs/jwt'] = '^10.2.0'; // downgrade to 10.2.0 (CJS compatible) just in case
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
