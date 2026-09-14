import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface AdminTokenPayload {
  id: string;
  email: string;
  roleId: string;
  exp: number;
}

@Injectable()
export class AuthTokenService {
  private readonly secret: string;

  constructor() {
    this.secret =
      process.env.ADMIN_JWT_SECRET ||
      process.env.JWT_SECRET ||
      'dellics_admin_sec_prod_key_77921_v2';
  }

  generateAdminToken(
    user: { id: string; email: string; roleId: string },
    ttlSeconds: number = 28800,
  ): string {
    const payload: AdminTokenPayload = {
      id: user.id,
      email: user.email.toLowerCase(),
      roleId: user.roleId,
      exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(encodedPayload)
      .digest('base64url');

    return `dt_sec_${encodedPayload}.${signature}`;
  }

  verifyAdminToken(token: string): AdminTokenPayload | null {
    if (!token || !token.startsWith('dt_sec_')) return null;

    const raw = token.replace('dt_sec_', '');
    const parts = raw.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(encodedPayload)
      .digest('base64url');

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return null;
    }

    try {
      const payload: AdminTokenPayload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }
}
