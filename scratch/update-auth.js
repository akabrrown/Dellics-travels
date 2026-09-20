const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/auth/auth.controller.ts');
let content = fs.readFileSync(file, 'utf8');

const target = `  @Post('admin/login')
  async adminLogin(
    @Body() body: { email: string; password?: string; totp?: string },
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    
    // Fetch from real database
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || user.role !== 'ADMIN' || !user.admin_role_id) {
      throw new UnauthorizedException('Access Denied: Unrecognized operations account.');
    }

    // Verify Password
    if (!body.password) {
      throw new UnauthorizedException('Password is required.');
    }
    
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Verify TOTP
    if (user.totp_enabled) {
      if (!body.totp) {
        throw new UnauthorizedException('TOTP Code is required.');
      }
      
      const isTotpValid = authenticator.verify({
        token: body.totp,
        secret: user.totp_secret || '',
      });
      
      if (!isTotpValid) {
        throw new UnauthorizedException('Invalid or expired 2FA code.');
      }
    }

    // Generate Final Token
    const token = this.tokenService.generateAdminToken({
      id: user.id,
      email: user.email,
      roleId: user.admin_role_id,
    });

    return {
      status: 'success',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.admin_role_id,
        roleTitle: user.admin_role_id,
        totpEnrolled: user.totp_enabled,
      },
    };
  }`;

const replacement = `  @Post('admin/login-init')
  async adminLoginInit(
    @Body() body: { email: string; password?: string },
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || user.role !== 'ADMIN' || !user.admin_role_id) {
      throw new UnauthorizedException('Access Denied: Unrecognized operations account.');
    }

    if (!body.password) {
      throw new UnauthorizedException('Password is required.');
    }
    
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        admin_otp_hash: otpHash,
        admin_otp_expires_at: expiresAt,
      }
    });

    const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
    if (apiKey) {
      const { buildAdminOtpHtml } = require('./email');
      const html = buildAdminOtpHtml({ name: user.name, otpCode: otp });
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${apiKey}\`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Dellics Travels <support@dellicstravels.com>",
          to: [user.email],
          subject: "Your Dellics Admin Login Code",
          html,
        }),
      }).catch(err => console.error("Failed to send OTP email", err));
    } else {
      console.log(\`[DEV OTP] Code for \${user.email} is \${otp}\`);
    }

    return { status: 'success', requireOtp: true };
  }

  @Post('admin/login')
  async adminLogin(
    @Body() body: { email: string; password?: string; otp?: string },
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || user.role !== 'ADMIN' || !user.admin_role_id) {
      throw new UnauthorizedException('Access Denied: Unrecognized operations account.');
    }

    if (!body.password) {
      throw new UnauthorizedException('Password is required.');
    }
    
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!body.otp) {
      throw new UnauthorizedException('OTP Code is required.');
    }

    if (!user.admin_otp_hash || !user.admin_otp_expires_at || user.admin_otp_expires_at < new Date()) {
      throw new UnauthorizedException('OTP expired or invalid. Please request a new one.');
    }

    const isOtpValid = await bcrypt.compare(body.otp, user.admin_otp_hash);
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP code.');
    }

    // Clear OTP after successful use
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        admin_otp_hash: null,
        admin_otp_expires_at: null,
      }
    });

    // Generate Final Token
    const token = this.tokenService.generateAdminToken({
      id: user.id,
      email: user.email,
      roleId: user.admin_role_id,
    });

    return {
      status: 'success',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.admin_role_id,
        roleTitle: user.admin_role_id,
        totpEnrolled: true,
      },
    };
  }`;

if (content.includes("verify({")) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Replaced successfully!");
} else {
  console.log("Target not found!");
}
