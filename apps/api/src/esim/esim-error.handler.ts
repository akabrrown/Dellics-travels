import { Logger } from '@nestjs/common';

export interface AiraloErrorPayload {
  data?: any;
  meta?: {
    message?: string;
    code?: number;
    errors?: Array<{
      code?: number;
      message?: string;
    }>;
  };
}

export class AiraloApiError extends Error {
  public readonly code?: number;
  public readonly httpStatus: number;
  public readonly isRetryable: boolean;
  public readonly userMessage: string;

  constructor(httpStatus: number, errorData: AiraloErrorPayload | any) {
    const rawCode =
      errorData?.meta?.code ||
      errorData?.meta?.errors?.[0]?.code ||
      errorData?.code;
    const rawMessage =
      errorData?.meta?.message ||
      errorData?.meta?.errors?.[0]?.message ||
      errorData?.message ||
      'Unknown Airalo Error';

    const { userMessage, isRetryable } = AiraloApiError.mapErrorDetails(
      httpStatus,
      rawCode,
      rawMessage,
    );

    super(`Airalo API Error [HTTP ${httpStatus}, Code ${rawCode || 'N/A'}]: ${rawMessage}`);
    this.name = 'AiraloApiError';
    this.httpStatus = httpStatus;
    this.code = rawCode;
    this.isRetryable = isRetryable;
    this.userMessage = userMessage;
  }

  private static mapErrorDetails(
    httpStatus: number,
    code?: number,
    rawMessage?: string,
  ): { userMessage: string; isRetryable: boolean } {
    if (httpStatus === 401) {
      return {
        userMessage: 'eSIM service authentication is refreshing. Please try again.',
        isRetryable: true,
      };
    }

    if (httpStatus === 429) {
      return {
        userMessage: 'eSIM request rate limit reached. Please wait a moment.',
        isRetryable: true,
      };
    }

    if (httpStatus >= 500) {
      return {
        userMessage: 'eSIM provider network temporarily unavailable. Our team is finalizing your order.',
        isRetryable: true,
      };
    }

    // 422 Business Error Codes
    switch (code) {
      case 11:
        return {
          userMessage: 'Airalo account balance low. Order queued for concierge provisioning.',
          isRetryable: false,
        };
      case 13:
        return {
          userMessage: 'The selected mobile telecom operator is undergoing routine maintenance. Please try again shortly.',
          isRetryable: true,
        };
      case 14:
        return {
          userMessage: 'Invalid package checksum. Please select package again.',
          isRetryable: false,
        };
      case 23:
        return {
          userMessage: 'Top-up has been disabled by the telecom operator.',
          isRetryable: false,
        };
      case 33:
      case 34:
        return {
          userMessage: 'This eSIM package is currently out of stock for this destination. Please select an alternative plan.',
          isRetryable: false,
        };
      case 43:
        return {
          userMessage: 'Invalid order parameters. Please check your details.',
          isRetryable: false,
        };
      case 53:
        return {
          userMessage: 'An unexpected upstream telecom error occurred. Please try again later.',
          isRetryable: true,
        };
      case 73:
        return {
          userMessage: 'This eSIM has been recycled and can no longer be used.',
          isRetryable: false,
        };
      case 89:
        return {
          userMessage: 'Server IP not on Airalo allowlist. Please notify technical administrator.',
          isRetryable: false,
        };
      default:
        return {
          userMessage: rawMessage || 'eSIM provisioning could not be completed.',
          isRetryable: false,
        };
    }
  }
}
