const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../packages/database/prisma/schema.prisma');
let content = fs.readFileSync(file, 'utf8');

// Re-add relation constraint
content = content.replace(
  '  admin_role_id        String?',
  '  admin_role_id        String?\n  admin_role           AdminRole? @relation("UserAdminRole", fields: [admin_role_id], references: [id])'
);
content = content.replace(
  '  updated_at  DateTime @updatedAt',
  '  updated_at  DateTime @updatedAt\n\n  users       User[]   @relation("UserAdminRole")'
);

fs.writeFileSync(file, content);
console.log("Restored relation");
