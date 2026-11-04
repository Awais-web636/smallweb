const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers }
    });
  } catch {
    throw new Error("Cannot reach the Small Web API. Check that the backend is running.");
  }

  let data: { error?: { code?: string; message?: string } } | null;
  try {
    data = await response.json() as { error?: { code?: string; message?: string } };
  } catch {
    throw new Error("The API returned an invalid response.");
  }
  if (!response.ok) {
    throw new ApiError(
      data?.error?.message || `Request failed (${response.status}).`,
      data?.error?.code || "REQUEST_FAILED",
      response.status
    );
  }
  return data as T;
}

export function postJson(body: unknown): RequestInit {
  return { method: "POST", body: JSON.stringify(body) };
}
