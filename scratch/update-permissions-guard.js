const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/auth/guards/permissions.guard.ts');
let content = fs.readFileSync(file, 'utf8');

// Change map to Promise.all
content = content.replace(
  'const hasAll = requiredPermissions.every((perm) =>',
  'const results = await Promise.all(requiredPermissions.map((perm) =>'
);
content = content.replace(
  'this.rolesService.hasPermission(user.roleId, perm),\n    );',
  'this.rolesService.hasPermission(user.roleId, perm)\n    ));\n    const hasAll = results.every(Boolean);'
);

content = content.replace('canActivate(context: ExecutionContext): boolean {', 'async canActivate(context: ExecutionContext): Promise<boolean> {');

fs.writeFileSync(file, content);
console.log("Updated permissions.guard.ts");
