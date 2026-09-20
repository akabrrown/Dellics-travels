const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/auth/auth.controller.ts');
let content = fs.readFileSync(file, 'utf8');

// Add DTO import after the bcrypt import
content = content.replace(
  "import * as bcrypt from 'bcryptjs';",
  "import * as bcrypt from 'bcryptjs';\nimport { AdminLoginInitDto, AdminLoginDto } from './dto/admin-login.dto';"
);

// Replace inline types with DTOs
content = content.replace(
  '@Body() body: { email: string; password?: string },',
  '@Body() body: AdminLoginInitDto,'
);
content = content.replace(
  '@Body() body: { email: string; password?: string; otp?: string },',
  '@Body() body: AdminLoginDto,'
);

fs.writeFileSync(file, content);
console.log("Updated controller to use DTOs");
