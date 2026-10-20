const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/roles/roles.controller.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace('this.rolesService.getRoles()', 'await this.rolesService.getRoles()');
content = content.replace('this.rolesService.inviteTeamMember(dto)', 'await this.rolesService.inviteTeamMember(dto)');
content = content.replace('this.rolesService.getRoleById(id)', 'await this.rolesService.getRoleById(id)');
content = content.replace('this.rolesService.createCustomRole(dto)', 'await this.rolesService.createCustomRole(dto)');
content = content.replace('this.rolesService.updateRole(id, dto)', 'await this.rolesService.updateRole(id, dto)');
content = content.replace('this.rolesService.deleteRole(id)', 'await this.rolesService.deleteRole(id)');

// Make sure controller methods are async where needed
content = content.replace(/getRoles\(\)/, 'async getRoles()');
content = content.replace(/getRoleById\(@Param\('id'\) id: string\)/, 'async getRoleById(@Param(\'id\') id: string)');
content = content.replace(/createCustomRole\(@Body\(\) dto: CreateRoleDto\)/, 'async createCustomRole(@Body() dto: CreateRoleDto)');
content = content.replace(/updateRole\(@Param\('id'\) id: string, @Body\(\) dto: Partial<CreateRoleDto>\)/, 'async updateRole(@Param(\'id\') id: string, @Body() dto: Partial<CreateRoleDto>)');
content = content.replace(/inviteTeamMember\(@Body\(\) dto: InviteTeamMemberDto\)/, 'async inviteTeamMember(@Body() dto: InviteTeamMemberDto)');
content = content.replace(/deleteRole\(@Param\('id'\) id: string\)/, 'async deleteRole(@Param(\'id\') id: string)');

fs.writeFileSync(file, content);
console.log("Updated roles.controller.ts");
