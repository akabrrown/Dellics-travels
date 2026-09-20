const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../packages/database/prisma/schema.prisma');
let content = fs.readFileSync(file, 'utf8');

// Temporarily remove relation constraint
content = content.replace(
  '  admin_role_id        String?\n  admin_role           AdminRole? @relation("UserAdminRole", fields: [admin_role_id], references: [id])',
  '  admin_role_id        String?'
);
content = content.replace(
  '  users       User[]   @relation("UserAdminRole")',
  ''
);

fs.writeFileSync(file, content);
console.log("Removed relation temporarily");
