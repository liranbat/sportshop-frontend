import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly cause: unknown;

  constructor(message: string, options: { status?: number; code?: string; cause?: unknown } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.cause = options.cause;
  }
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const serverMessage =
      typeof error.response?.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data &&
      typeof (error.response.data as { message: unknown }).message === "string"
        ? (error.response.data as { message: string }).message
        : undefined;

    return new ApiError(serverMessage ?? error.message, {
      status,
      code: error.code,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message, { cause: error });
  }

  return new ApiError("Unknown API error", { cause: error });
}

export const api: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);
