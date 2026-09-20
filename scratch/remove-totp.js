const fs = require('fs');
const path = require('path');

// 1. auth.controller.ts - replace totpEnrolled references
const authFile = path.join(__dirname, '../apps/api/src/auth/auth.controller.ts');
let auth = fs.readFileSync(authFile, 'utf8');
// Remove the otplib import
auth = auth.replace("import { authenticator } from 'otplib';\n", '');
auth = auth.replace("import { authenticator } from 'otplib';\r\n", '');
// Replace totpEnrolled with otpEnabled
auth = auth.replace('totpEnrolled: true,', 'otpEnabled: true,');
auth = auth.replace('totpEnrolled: user.totp_enabled,', 'otpEnabled: true,');
fs.writeFileSync(authFile, auth);
console.log('Updated auth.controller.ts');

// 2. admin auth.ts - replace totpEnrolled
const adminAuthFile = path.join(__dirname, '../apps/admin/src/lib/auth.ts');
let adminAuth = fs.readFileSync(adminAuthFile, 'utf8');
adminAuth = adminAuth.replace('totpEnrolled: boolean;', 'otpEnabled: boolean;');
adminAuth = adminAuth.replace('totpEnrolled: loginRes.user.totpEnrolled,', 'otpEnabled: loginRes.user.otpEnabled || true,');
fs.writeFileSync(adminAuthFile, adminAuth);
console.log('Updated admin auth.ts');

// 3. web admin page - replace TOTP mention
const webAdminFile = path.join(__dirname, '../apps/web/app/admin/page.tsx');
let webAdmin = fs.readFileSync(webAdminFile, 'utf8');
webAdmin = webAdmin.replace(
  'multi-factor authentication (TOTP/2FA)',
  'multi-factor authentication (Email OTP)'
);
fs.writeFileSync(webAdminFile, webAdmin);
console.log('Updated web admin page');

// 4. team page - replace all TOTP references
const teamFile = path.join(__dirname, '../apps/admin/src/app/(dashboard)/team/page.tsx');
let team = fs.readFileSync(teamFile, 'utf8');
team = team.replaceAll('totpEnrolled: boolean;', 'otpEnabled: boolean;');
team = team.replaceAll('totpEnrolled: true,', 'otpEnabled: true,');
team = team.replaceAll('100% 2FA TOTP Enforced', '100% Email OTP Enforced');
team = team.replaceAll('TOTP Enforced', 'OTP Verified');
team = team.replaceAll('mandatory TOTP authenticator setup link', 'mandatory Email OTP verification');
fs.writeFileSync(teamFile, team);
console.log('Updated team page');

console.log('All TOTP references removed.');
