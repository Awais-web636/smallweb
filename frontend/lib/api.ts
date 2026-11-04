import axios, { type AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

export class ApiError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export async function apiRequest<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>({ ...config, url: path });
    return response.data;
  } catch (failure) {
    if (!axios.isAxiosError<ApiErrorResponse>(failure)) throw failure;
    if (!failure.response) {
      throw new Error("Cannot reach the Small Web API. Check that the backend is running.");
    }

    const { data, status } = failure.response;
    throw new ApiError(
      data?.error?.message || `Request failed (${status}).`,
      data?.error?.code || "REQUEST_FAILED",
      status
    );
  }
}

export function postJson(body: unknown): AxiosRequestConfig {
  return { method: "POST", data: body };
}
