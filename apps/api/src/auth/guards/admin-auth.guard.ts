import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthTokenService } from '../auth-token.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: AuthTokenService,
    private reflector: Reflector
  ) {}

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

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No roles restricted
    }
    
    // Master Admin always has access to everything
    if (payload.roleId === 'master_admin') {
      return true;
    }
    
    const hasRole = requiredRoles.includes(payload.roleId);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions to access this endpoint.');
    }

    return true;
  }
}