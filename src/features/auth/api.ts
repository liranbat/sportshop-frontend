import { api } from "@/lib/api";
import {
  UserResponseSchema,
  type LoginRequest,
  type RegisterRequest,
  type UserResponse,
} from "@/features/auth/schema";

export async function login(payload: LoginRequest): Promise<UserResponse> {
  const { data } = await api.post<unknown>("/api/auth/login", payload);
  return UserResponseSchema.parse(data);
}

export async function register(payload: RegisterRequest): Promise<UserResponse> {
  const { data } = await api.post<unknown>("/api/auth/register", payload);
  return UserResponseSchema.parse(data);
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}

export async function refresh(): Promise<UserResponse> {
  const { data } = await api.post<unknown>("/api/auth/refresh");
  return UserResponseSchema.parse(data);
}

export async function getMe(): Promise<UserResponse> {
  const { data } = await api.get<unknown>("/api/auth/me", { timeout: 5_000 });
  return UserResponseSchema.parse(data);
}
