import { ADMIN_CONFIG, sanitizeApiUrl } from "./config";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

export interface AdminRequestOptions extends RequestInit {
  strict?: boolean;
}

// Global listener & state for API backend connectivity
type ConnectionListener = (isOnline: boolean) => void;
const listeners = new Set<ConnectionListener>();
let isBackendOnline = true;

export function subscribeBackendStatus(listener: ConnectionListener) {
  listeners.add(listener);
  listener(isBackendOnline);
  return () => {
    listeners.delete(listener);
  };
}

export function setBackendOnlineStatus(status: boolean) {
  if (isBackendOnline !== status) {
    isBackendOnline = status;
    listeners.forEach((fn) => fn(status));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("dellics:backend-status", { detail: { online: status } })
      );
    }
  }
}

export function getBackendOnlineStatus() {
  return isBackendOnline;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const baseUrl = sanitizeApiUrl(ADMIN_CONFIG.apiUrl);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const isOnline = res.ok;
    setBackendOnlineStatus(isOnline);
    return isOnline;
  } catch {
    setBackendOnlineStatus(false);
    return false;
  }
}

async function request<T>(
  path: string,
  options: AdminRequestOptions = {}
): Promise<T> {
  const baseUrl = sanitizeApiUrl(ADMIN_CONFIG.apiUrl);
  let cleanPath = (path || "")
    .trim()
    .replace(/\\r|\\n|\\t/gi, "")
    .replace(/[\r\n\t\v\f]+/g, "");
  
  // Strip any rogue leading /n/ or n/
  if (cleanPath.startsWith("/n/")) {
    cleanPath = cleanPath.slice(2);
  } else if (cleanPath.startsWith("n/")) {
    cleanPath = cleanPath.slice(1);
  }
  
  cleanPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  const url = `${baseUrl}${cleanPath}`;
  
  // Attach admin authorization token if present in localStorage (client-side)
  const token = typeof window !== "undefined" ? localStorage.getItem("dellics_admin_token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
    setBackendOnlineStatus(true);
  } catch {
    setBackendOnlineStatus(false);
    throw new AdminApiError(
      `Unable to reach Dellics API backend at ${baseUrl}. Ensure apps/api is running.`,
      0,
      null,
      true
    );
  }

  let data: { message?: unknown } | null = null;
  try {
    data = (await res.json()) as { message?: unknown };
  } catch {
    // Non-JSON or empty response
  }

  if (!res.ok) {
    const errorMsg =
      data?.message && typeof data.message === "string"
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join("; ")
          : `Request failed with HTTP status ${res.status}`;
    throw new AdminApiError(errorMsg, res.status, data);
  }

  return data as T;
}

export const adminApi = {
  get: <T>(path: string, options?: AdminRequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: AdminRequestOptions) =>
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, options?: AdminRequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, options?: AdminRequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: AdminRequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
