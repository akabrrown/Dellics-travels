import { API_URL } from "./site";

export class ApiError extends Error {}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Connection failed. Check your internet and try again.");
  }
  let data: { message?: unknown } = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON response body — fall through to the status-based message
  }
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(" ")
          : "Something went wrong. Please try again.";
    throw new ApiError(message);
  }
  return data as T;
}


export async function getJson<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError("Connection failed. Check your internet and try again.");
  }
  let data: { message?: unknown } = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON response body
  }
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(" ")
          : "Something went wrong. Please try again.";
    throw new ApiError(message);
  }
  return data as T;
}

