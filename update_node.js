const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.engines.node = '22.x';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('Updated package.json engines to 22.x');
