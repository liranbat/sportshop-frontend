import {
  UserResponseSchema,
  type LoginRequest,
  type RegisterRequest,
  type UserResponse,
} from "@/features/auth/schema";
import { getParsed, postParsed, postVoid } from "@/lib/api-client";

export function login(payload: LoginRequest): Promise<UserResponse> {
  return postParsed("/auth/login", payload, UserResponseSchema);
}

export function register(payload: RegisterRequest): Promise<UserResponse> {
  return postParsed("/auth/register", payload, UserResponseSchema);
}

export function logout(): Promise<void> {
  return postVoid("/auth/logout");
}

export function refresh(): Promise<UserResponse> {
  return postParsed("/auth/refresh", undefined, UserResponseSchema);
}

export function getMe(): Promise<UserResponse> {
  return getParsed("/auth/me", UserResponseSchema, { timeout: 5_000 });
}
