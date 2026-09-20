import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roleId) {
      throw new ForbiddenException('Access Denied: Missing operational role.');
    }

    const results = await Promise.all(requiredPermissions.map((perm) =>
      this.rolesService.hasPermission(user.roleId, perm)
    ));
    const hasAll = results.every(Boolean);

    if (!hasAll) {
      throw new ForbiddenException(
        `Access Denied: Role '${user.roleId}' lacks required permissions: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
