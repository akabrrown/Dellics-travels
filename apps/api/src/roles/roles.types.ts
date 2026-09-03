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

export interface CreateRoleDto {
  id?: string;
  title: string;
  description: string;
  badgeColor?: string;
  permissions: Record<string, boolean>;
}

export interface InviteTeamMemberDto {
  name: string;
  email: string;
  roleId: string;
}
