import { ADMIN_CONFIG } from "./config";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${ADMIN_CONFIG.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  
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
  } catch {
    throw new AdminApiError("Network error: Unable to reach Dellics API backend.");
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
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
