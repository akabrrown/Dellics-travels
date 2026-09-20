const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../packages/database/prisma/schema.prisma');
let content = fs.readFileSync(file, 'utf8');

// Add AdminRole model
const adminRoleModel = `
model AdminRole {
  id          String   @id
  title       String
  description String?
  badgeColor  String?
  isCustom    Boolean  @default(true)
  permissions Json
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  users       User[]   @relation("UserAdminRole")
}
`;
content += adminRoleModel;

// Update User model to have relation
content = content.replace(
  '  admin_role_id        String?',
  '  admin_role_id        String?\n  admin_role           AdminRole? @relation("UserAdminRole", fields: [admin_role_id], references: [id])'
);

fs.writeFileSync(file, content);
console.log("Updated schema.prisma");
