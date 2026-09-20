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
  async getRoles() {
    return {
      status: 'success',
      data: await this.rolesService.getRoles(),
    };
  }

  @Get('team/members')
  @RequirePermissions('team.view')
  async getTeamMembers() {
    const data = await this.rolesService.getTeamMembers();
    return {
      status: 'success',
      data,
    };
  }

  @Post('team/invite')
  @RequirePermissions('team.manage_roles')
  async inviteTeamMember(@Body() dto: InviteTeamMemberDto) {
    return {
      status: 'success',
      data: await this.rolesService.inviteTeamMember(dto),
    };
  }

  @Patch('team/:id/role')
  @RequirePermissions('team.manage_roles')
  async updateMemberRole(@Param('id') id: string, @Body('roleId') roleId: string) {
    const data = await this.rolesService.updateMemberRole(id, roleId);
    return {
      status: 'success',
      data,
    };
  }

  @Get(':id')
  @RequirePermissions('team.view')
  async getRoleById(@Param('id') id: string) {
    return {
      status: 'success',
      data: await this.rolesService.getRoleById(id),
    };
  }

  @Post('custom')
  @RequirePermissions('team.custom_roles')
  async createCustomRole(@Body() dto: CreateRoleDto) {
    return {
      status: 'success',
      data: await this.rolesService.createCustomRole(dto),
    };
  }

  @Put(':id')
  @RequirePermissions('team.custom_roles')
  async updateRole(@Param('id') id: string, @Body() dto: Partial<CreateRoleDto>) {
    return {
      status: 'success',
      data: await this.rolesService.updateRole(id, dto),
    };
  }

  @Delete(':id')
  @RequirePermissions('team.custom_roles')
  async deleteRole(@Param('id') id: string) {
    await this.rolesService.deleteRole(id);
    return {
      status: 'success',
      message: `Role '${id}' deleted successfully.`,
    };
  }
}
