const fs = require('fs');
const https = require('https');

https.get('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const d = JSON.parse(data);
    const formatted = d
      .filter(c => c.idd && c.idd.root)
      .map(c => ({
        name: c.name.common,
        code: c.idd.root + (c.idd.suffixes && c.idd.suffixes.length > 0 ? c.idd.suffixes[0] : ''),
        flag: c.flag
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Deduplicate
    const unique = formatted.filter((obj, index, self) =>
      index === self.findIndex((t) => t.code === obj.code && t.name === obj.name)
    );

    const dir = './src/constants';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(`${dir}/countries.ts`, `export const COUNTRIES = ${JSON.stringify(unique, null, 2)};`);
    console.log('Saved countries.ts');
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
