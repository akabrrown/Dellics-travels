import { Controller, Get, Post, Put, Delete, Patch, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, InviteTeamMemberDto } from './roles.types';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  getPermissions() {
    return {
      status: 'success',
      data: this.rolesService.getPermissions(),
    };
  }

  @Get()
  getRoles() {
    return {
      status: 'success',
      data: this.rolesService.getRoles(),
    };
  }

  @Get('team/members')
  getTeamMembers() {
    return {
      status: 'success',
      data: this.rolesService.getTeamMembers(),
    };
  }

  @Post('team/invite')
  inviteTeamMember(@Body() dto: InviteTeamMemberDto) {
    return {
      status: 'success',
      data: this.rolesService.inviteTeamMember(dto),
    };
  }

  @Patch('team/:id/role')
  updateMemberRole(@Param('id') id: string, @Body('roleId') roleId: string) {
    return {
      status: 'success',
      data: this.rolesService.updateMemberRole(id, roleId),
    };
  }

  @Get(':id')
  getRoleById(@Param('id') id: string) {
    return {
      status: 'success',
      data: this.rolesService.getRoleById(id),
    };
  }

  @Post()
  createCustomRole(@Body() dto: CreateRoleDto) {
    return {
      status: 'success',
      data: this.rolesService.createCustomRole(dto),
    };
  }

  @Put(':id')
  updateRole(@Param('id') id: string, @Body() dto: Partial<CreateRoleDto>) {
    return {
      status: 'success',
      data: this.rolesService.updateRole(id, dto),
    };
  }

  @Delete(':id')
  deleteCustomRole(@Param('id') id: string) {
    return this.rolesService.deleteCustomRole(id);
  }
}
