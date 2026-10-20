import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ZohoLeadDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  leadSource?: string;
  description?: string;
  city?: string;
  country?: string;
}

export interface ZohoContactDto {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  leadSource?: string;
}

export interface ZohoDealDto {
  dealName: string;
  amount: number;
  stage?: string;
  closingDate?: string;
  contactId?: string;
  description?: string;
}

@Injectable()
export class ZohoService {
  private readonly logger = new Logger(ZohoService.name);

  private cachedAccessToken: string | null = null;
  private tokenExpiresAt = 0;
  private tokenRefreshPromise: Promise<string | null> | null = null;

  constructor(private readonly config: ConfigService) {}

  /**
   * Retrieves a valid cached OAuth access token, or refreshes it if expired.
   */
  async getAccessToken(): Promise<string | null> {
    const now = Date.now();
    // Use cached token if valid for at least 2 more minutes
    if (this.cachedAccessToken && this.tokenExpiresAt > now + 120_000) {
      return this.cachedAccessToken;
    }

    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.refreshToken();
    try {
      return await this.tokenRefreshPromise;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async refreshToken(): Promise<string | null> {
    const clientId = this.config.get<string>('ZOHO_CLIENT_ID');
    const clientSecret = this.config.get<string>('ZOHO_CLIENT_SECRET');
    const refreshToken = this.config.get<string>('ZOHO_REFRESH_TOKEN');
    const accountsDomain =
      this.config.get<string>('ZOHO_ACCOUNTS_DOMAIN') ||
      'https://accounts.zoho.com';

    if (!clientId || !clientSecret || !refreshToken) {
      this.logger.warn(
        'Zoho CRM credentials incomplete in environment. Skipping sync.',
      );
      return null;
    }

    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      });

      const response = await fetch(`${accountsDomain}/oauth/v2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();
      if (!response.ok || !data.access_token) {
        this.logger.error(
          `Failed to refresh Zoho CRM access token: ${JSON.stringify(data)}`,
        );
        return null;
      }

      this.cachedAccessToken = data.access_token;
      const expiresIn = (data.expires_in || 3600) * 1000;
      this.tokenExpiresAt = Date.now() + expiresIn;
      this.logger.log('Acquired fresh Zoho CRM OAuth access token');
      return this.cachedAccessToken;
    } catch (err) {
      this.logger.error(
        `Error contacting Zoho OAuth server: ${(err as Error).message}`,
      );
      return null;
    }
  }

  /**
   * Creates a new Lead in Zoho CRM Plus.
   */
  async createLead(
    dto: ZohoLeadDto,
  ): Promise<{ success: boolean; leadId?: string; error?: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) return { success: false, error: 'No Zoho access token' };

      const apiDomain =
        this.config.get<string>('ZOHO_API_DOMAIN') ||
        'https://www.zohoapis.com';

      // Zoho requires Last_Name for Leads
      let lastName = dto.lastName?.trim();
      let firstName = dto.firstName?.trim();

      if (!lastName && firstName) {
        const parts = firstName.split(' ');
        if (parts.length > 1) {
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        } else {
          lastName = firstName;
          firstName = undefined;
        }
      }

      if (!lastName) {
        lastName = dto.email || 'Travel Inquirer';
      }

      const payload = {
        data: [
          {
            Last_Name: lastName,
            ...(firstName ? { First_Name: firstName } : {}),
            ...(dto.email ? { Email: dto.email } : {}),
            ...(dto.phone ? { Phone: dto.phone } : {}),
            ...(dto.city ? { City: dto.city } : {}),
            ...(dto.country ? { Country: dto.country } : {}),
            Lead_Source: dto.leadSource || 'Dellics Travels Website',
            ...(dto.description ? { Description: dto.description } : {}),
          },
        ],
      };

      const res = await fetch(`${apiDomain}/crm/v6/Leads`, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      const firstResult = resData?.data?.[0];

      if (
        firstResult?.status === 'success' ||
        firstResult?.code === 'SUCCESS'
      ) {
        const leadId = firstResult.details?.id;
        this.logger.log(`Created Zoho CRM Lead ID: ${leadId}`);
        return { success: true, leadId };
      }

      this.logger.warn(
        `Zoho CRM Lead creation returned status: ${JSON.stringify(resData)}`,
      );
      return {
        success: false,
        error: firstResult?.message || 'Unknown Zoho error',
      };
    } catch (err) {
      this.logger.error(
        `Failed to create Zoho CRM Lead: ${(err as Error).message}`,
      );
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Creates or updates a Contact in Zoho CRM Plus.
   */
  async createContact(
    dto: ZohoContactDto,
  ): Promise<{ success: boolean; contactId?: string; error?: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) return { success: false, error: 'No Zoho access token' };

      const apiDomain =
        this.config.get<string>('ZOHO_API_DOMAIN') ||
        'https://www.zohoapis.com';

      let lastName = dto.lastName?.trim();
      let firstName = dto.firstName?.trim();

      if (!lastName && firstName) {
        const parts = firstName.split(' ');
        if (parts.length > 1) {
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        } else {
          lastName = firstName;
          firstName = undefined;
        }
      }

      if (!lastName) {
        lastName = dto.email;
      }

      const payload = {
        data: [
          {
            Last_Name: lastName,
            ...(firstName ? { First_Name: firstName } : {}),
            Email: dto.email,
            ...(dto.phone ? { Phone: dto.phone } : {}),
            Lead_Source: dto.leadSource || 'Dellics Travels Booking',
          },
        ],
      };

      const res = await fetch(`${apiDomain}/crm/v6/Contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      const firstResult = resData?.data?.[0];

      if (
        firstResult?.status === 'success' ||
        firstResult?.code === 'SUCCESS'
      ) {
        const contactId = firstResult.details?.id;
        this.logger.log(`Created Zoho CRM Contact ID: ${contactId}`);
        return { success: true, contactId };
      }

      return {
        success: false,
        error: firstResult?.message || 'Unknown Zoho error',
      };
    } catch (err) {
      this.logger.error(
        `Failed to create Zoho CRM Contact: ${(err as Error).message}`,
      );
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Creates a Deal (Booking Pipeline item) in Zoho CRM Plus.
   */
  async createDeal(
    dto: ZohoDealDto,
  ): Promise<{ success: boolean; dealId?: string; error?: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) return { success: false, error: 'No Zoho access token' };

      const apiDomain =
        this.config.get<string>('ZOHO_API_DOMAIN') ||
        'https://www.zohoapis.com';

      const payload = {
        data: [
          {
            Deal_Name: dto.dealName,
            Amount: dto.amount,
            Stage: dto.stage || 'Closed Won',
            Closing_Date:
              dto.closingDate || new Date().toISOString().split('T')[0],
            ...(dto.contactId ? { Contact_Name: { id: dto.contactId } } : {}),
            ...(dto.description ? { Description: dto.description } : {}),
          },
        ],
      };

      const res = await fetch(`${apiDomain}/crm/v6/Deals`, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      const firstResult = resData?.data?.[0];

      if (
        firstResult?.status === 'success' ||
        firstResult?.code === 'SUCCESS'
      ) {
        const dealId = firstResult.details?.id;
        this.logger.log(`Created Zoho CRM Deal ID: ${dealId}`);
        return { success: true, dealId };
      }

      return {
        success: false,
        error: firstResult?.message || 'Unknown Zoho error',
      };
    } catch (err) {
      this.logger.error(
        `Failed to create Zoho CRM Deal: ${(err as Error).message}`,
      );
      return { success: false, error: (err as Error).message };
    }
  }
}
