import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('SUPABASE_JWT_SECRET') ||
        'your-super-secret-jwt-token-with-at-least-32-characters-long',
    });
  }

  async validate(payload: any) {
    // Maps Supabase JWT payload to our user context
    return { id: payload.sub, email: payload.email, role: payload.user_role };
  }
}
