import { IsEmail, IsString } from 'class-validator';
import { IsNotDisposableEmail } from '../common/validators/is-not-disposable-email.validator';
export interface PermissionDefinition {
  key: string;
  label: string;
  category: string;
  description: string;
}

export interface AdminRole {
  id: string;
  title: string;
  description: string;
  badgeColor: string;
  isCustom: boolean;
  permissions: Record<string, boolean>;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleTitle: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  twoFactorEnforced: boolean;
  lastActive: string;
}

export class CreateRoleDto {
  id?: string;
  title: string;
  description: string;
  badgeColor?: string;
  permissions: Record<string, boolean>;
}

export class InviteTeamMemberDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsNotDisposableEmail()
  email: string;

  @IsString()
  roleId: string;
}
