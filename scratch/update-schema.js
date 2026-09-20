const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../packages/database/prisma/schema.prisma');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'enum ESIMOrderStatus {\n  PENDING\n  PROVISIONED\n  ACTIVE\n  EXPIRED\n}',
  'enum ESIMOrderStatus {\n  PENDING\n  PROVISIONED\n  ACTIVE\n  EXPIRED\n  COMPLETED\n}'
);
content = content.replace(
  'enum ESIMOrderStatus {\r\n  PENDING\r\n  PROVISIONED\r\n  ACTIVE\r\n  EXPIRED\r\n}',
  'enum ESIMOrderStatus {\r\n  PENDING\r\n  PROVISIONED\r\n  ACTIVE\r\n  EXPIRED\r\n  COMPLETED\r\n}'
);


fs.writeFileSync(file, content);
console.log("Updated schema.prisma");
