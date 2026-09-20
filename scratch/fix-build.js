const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/booking/booking.service.ts');
let content = fs.readFileSync(file, 'utf8');

// Fix 1: The broken comment block before getAdminRefunds
// Line 441 has an orphan "/**" that swallows getAdminRefunds
content = content.replace(
  "  }\n\n  /**\n  async getAdminRefunds()",
  "  }\n\n  /**\n   * Admin pending & processed refunds\n   */\n  async getAdminRefunds()"
);

// Fix 2: ESIMOrderStatus doesn't have COMPLETED — it has PENDING, PROVISIONED, ACTIVE, EXPIRED
// Replace the bad comparison with a cast
content = content.replaceAll(
  "e.status === 'COMPLETED' ? 'CONFIRMED' : e.status, // Normalize status",
  "(e.status as string) === 'COMPLETED' ? 'CONFIRMED' : (e.status as string),"
);
content = content.replaceAll(
  "e.status === 'COMPLETED' ? 'CONFIRMED' : e.status,",
  "(e.status as string) === 'COMPLETED' ? 'CONFIRMED' : (e.status as string),"
);

fs.writeFileSync(file, content);
console.log("Fixed all 3 build errors");
