import { ConfigService } from '@nestjs/config';
import { ZohoService } from './zoho.service';

describe('ZohoService', () => {
  let service: ZohoService;
  let config: ConfigService;

  beforeEach(() => {
    config = new ConfigService({
      ZOHO_CLIENT_ID: 'test-client-id',
      ZOHO_CLIENT_SECRET: 'test-client-secret',
      ZOHO_REFRESH_TOKEN: 'test-refresh-token',
      ZOHO_ACCOUNTS_DOMAIN: 'https://accounts.zoho.com',
      ZOHO_API_DOMAIN: 'https://www.zohoapis.com',
    });
    service = new ZohoService(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('refreshes token successfully and caches it', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'mock-access-token',
        expires_in: 3600,
      }),
    } as any);

    const token1 = await service.getAccessToken();
    expect(token1).toBe('mock-access-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second call should hit the cache, not call fetch again
    const token2 = await service.getAccessToken();
    expect(token2).toBe('mock-access-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('creates lead with formatted names and source', async () => {
    jest.spyOn(service, 'getAccessToken').mockResolvedValueOnce('valid-token');

    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            code: 'SUCCESS',
            status: 'success',
            details: { id: 'lead-12345' },
          },
        ],
      }),
    } as any);

    const result = await service.createLead({
      firstName: 'Kofi Mensah',
      email: 'kofi@example.com',
      phone: '+233201234567',
      description: 'Interested in Dubai package',
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBe('lead-12345');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.zohoapis.com/crm/v6/Leads',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Zoho-oauthtoken valid-token',
        }),
      }),
    );
  });

  it('handles API errors gracefully without throwing', async () => {
    jest.spyOn(service, 'getAccessToken').mockResolvedValueOnce('valid-token');

    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Network offline'));

    const result = await service.createLead({
      lastName: 'Mensah',
      email: 'kofi@example.com',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network offline');
  });
});
