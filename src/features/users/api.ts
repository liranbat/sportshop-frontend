import { api } from "@/lib/api";
import { UserResponseSchema, type UserResponse } from "@/features/auth/schema";
import type { UserListParams } from "@/features/users/filters";
import {
  UserListPageSchema,
  type UserListPage,
  type ChangePasswordRequest,
  type DeleteAccountRequest,
  type UpdateProfileRequest,
} from "@/features/users/schema";

export async function updateProfile(payload: UpdateProfileRequest): Promise<UserResponse> {
  const { data } = await api.patch<unknown>("/api/users/me", payload);
  return UserResponseSchema.parse(data);
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await api.post("/api/users/me/password", payload);
}

export async function deleteAccount(payload: DeleteAccountRequest): Promise<void> {
  await api.delete("/api/users/me", {
    headers: { "X-Confirm-Password": payload.currentPassword },
  });
}

export async function listUsers(params: UserListParams): Promise<UserListPage> {
  const { data } = await api.get<unknown>("/api/admin/users", { params });
  return UserListPageSchema.parse(data);
}

export async function getAdminUser(id: number): Promise<UserResponse> {
  const { data } = await api.get<unknown>(`/api/admin/users/${id}`);
  return UserResponseSchema.parse(data);
}

export async function updateAdminUser(
  id: number,
  payload: UpdateProfileRequest,
): Promise<UserResponse> {
  const { data } = await api.patch<unknown>(`/api/admin/users/${id}`, payload);
  return UserResponseSchema.parse(data);
}

export async function promoteAdminUser(id: number): Promise<UserResponse> {
  const { data } = await api.put<unknown>(`/api/admin/users/${id}/promote`);
  return UserResponseSchema.parse(data);
}

export async function demoteAdminUser(id: number): Promise<UserResponse> {
  const { data } = await api.put<unknown>(`/api/admin/users/${id}/demote`);
  return UserResponseSchema.parse(data);
}
