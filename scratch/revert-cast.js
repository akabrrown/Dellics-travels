const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/booking/booking.service.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replaceAll(
  "(e.status as string) === 'COMPLETED' ? 'CONFIRMED' : (e.status as string),",
  "e.status === 'COMPLETED' ? 'CONFIRMED' : e.status,"
);

fs.writeFileSync(file, content);
console.log("Reverted cast in booking.service.ts");
