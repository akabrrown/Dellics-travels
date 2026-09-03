import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return initial standard roles including master_admin, supervisor, customer_service, finance_team', () => {
    const roles = service.getRoles();
    const ids = roles.map((r) => r.id);
    expect(ids).toContain('master_admin');
    expect(ids).toContain('supervisor');
    expect(ids).toContain('customer_service');
    expect(ids).toContain('finance_team');
  });

  it('should create and delete custom roles', () => {
    const customRole = service.createCustomRole({
      title: 'Airport Protocol Concierge',
      description: 'Handles Kotoka VIP lounge protocol and transfers.',
      permissions: {
        'dashboard.view': true,
        'bookings.view': true,
        'travelers.view': true,
      },
    });

    expect(customRole.id).toBe('airport_protocol_concierge');
    expect(customRole.isCustom).toBe(true);
    expect(service.getRoles().some((r) => r.id === 'airport_protocol_concierge')).toBe(true);

    const deleteRes = service.deleteCustomRole('airport_protocol_concierge');
    expect(deleteRes.success).toBe(true);
    expect(service.getRoles().some((r) => r.id === 'airport_protocol_concierge')).toBe(false);
  });

  it('should prevent deleting built-in roles', () => {
    expect(() => service.deleteCustomRole('master_admin')).toThrow();
  });
});
