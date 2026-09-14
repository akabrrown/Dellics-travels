import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokenService } from '../auth-token.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly tokenService: AuthTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token required.');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const payload = this.tokenService.verifyAdminToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired operations token.');
    }

    request.user = payload;
    return true;
  }
}
