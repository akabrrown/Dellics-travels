import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, InviteTeamMemberDto } from './roles.types';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(AdminAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  @RequirePermissions('dashboard.view')
  getPermissions() {
    return {
      status: 'success',
      data: this.rolesService.getPermissions(),
    };
  }

  @Get()
  @RequirePermissions('team.view')
  getRoles() {
    return {
      status: 'success',
      data: this.rolesService.getRoles(),
    };
  }

  @Get('team/members')
  @RequirePermissions('team.view')
  getTeamMembers() {
    return {
      status: 'success',
      data: this.rolesService.getTeamMembers(),
    };
  }

  @Post('team/invite')
  @RequirePermissions('team.manage_roles')
  inviteTeamMember(@Body() dto: InviteTeamMemberDto) {
    return {
      status: 'success',
      data: this.rolesService.inviteTeamMember(dto),
    };
  }

  @Patch('team/:id/role')
  @RequirePermissions('team.manage_roles')
  updateMemberRole(@Param('id') id: string, @Body('roleId') roleId: string) {
    return {
      status: 'success',
      data: this.rolesService.updateMemberRole(id, roleId),
    };
  }

  @Get(':id')
  @RequirePermissions('team.view')
  getRoleById(@Param('id') id: string) {
    return {
      status: 'success',
      data: this.rolesService.getRoleById(id),
    };
  }

  @Post('custom')
  @RequirePermissions('team.custom_roles')
  createCustomRole(@Body() dto: CreateRoleDto) {
    return {
      status: 'success',
      data: this.rolesService.createCustomRole(dto),
    };
  }

  @Put(':id')
  @RequirePermissions('team.custom_roles')
  updateRole(@Param('id') id: string, @Body() dto: Partial<CreateRoleDto>) {
    return {
      status: 'success',
      data: this.rolesService.updateRole(id, dto),
    };
  }

  @Delete(':id')
  @RequirePermissions('team.custom_roles')
  deleteRole(@Param('id') id: string) {
    this.rolesService.deleteRole(id);
    return {
      status: 'success',
      message: `Role '${id}' deleted successfully.`,
    };
  }
}
