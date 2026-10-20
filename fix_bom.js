const fs = require('fs');
const filePath = 'C:\\Users\\Dell\\Desktop\\PROjects\\Dellics Travels\\apps\\consult\\src\\app\\globals.css';
let content = fs.readFileSync(filePath, 'utf8');
// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}
fs.writeFileSync(filePath, content, 'utf8');
console.log('BOM removed from globals.css');
