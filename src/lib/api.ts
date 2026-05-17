import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly traceId: string | undefined;
  readonly cause: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; traceId?: string; cause?: unknown } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.traceId = options.traceId;
    this.cause = options.cause;
  }
}

function extractTraceId(error: AxiosError): string | undefined {
  const headerValue = error.response?.headers?.["x-trace-id"];
  if (typeof headerValue === "string" && headerValue.length > 0) {
    return headerValue;
  }
  const data = error.response?.data;
  if (
    typeof data === "object" &&
    data !== null &&
    "trace_id" in data &&
    typeof (data as { trace_id: unknown }).trace_id === "string"
  ) {
    return (data as { trace_id: string }).trace_id;
  }
  return undefined;
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
      traceId: extractTraceId(error),
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
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);
