import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService HMAC Signing & Security', () => {
  let service: AuthTokenService;

  beforeEach(() => {
    service = new AuthTokenService();
  });

  it('generates a valid signed token and verifies payload', () => {
    const user = {
      id: 'ADM-001',
      email: 'ops@dellicstravels.com',
      roleId: 'master_admin',
    };

    const token = service.generateAdminToken(user, 3600);
    expect(token.startsWith('dt_sec_')).toBe(true);

    const verified = service.verifyAdminToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe('ADM-001');
    expect(verified?.email).toBe('ops@dellicstravels.com');
    expect(verified?.roleId).toBe('master_admin');
  });

  it('rejects tampered or forged tokens', () => {
    const user = {
      id: 'ADM-002',
      email: 'hacker@example.com',
      roleId: 'supervisor',
    };

    const validToken = service.generateAdminToken(user, 3600);
    // Tamper with the payload part
    const parts = validToken.split('.');
    const tampered = `${parts[0]}X.${parts[1]}`;

    expect(service.verifyAdminToken(tampered)).toBeNull();
  });

  it('rejects expired tokens', () => {
    const user = {
      id: 'ADM-003',
      email: 'emmanuel.t@dellicstravels.com',
      roleId: 'customer_service',
    };

    // Generate token with negative TTL (already expired)
    const expiredToken = service.generateAdminToken(user, -10);
    expect(service.verifyAdminToken(expiredToken)).toBeNull();
  });
});
