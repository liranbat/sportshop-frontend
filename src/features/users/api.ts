import { UserResponseSchema, type UserResponse } from "@/features/auth/schema";
import type { UserListParams } from "@/features/users/filters";
import {
  UserListPageSchema,
  type UserListPage,
  type ChangePasswordRequest,
  type DeleteAccountRequest,
  type UpdateProfileRequest,
} from "@/features/users/schema";
import {
  deleteVoid,
  getParsed,
  patchParsed,
  postParsed,
  postVoid,
  putParsed,
} from "@/lib/api-client";

export function updateProfile(payload: UpdateProfileRequest): Promise<UserResponse> {
  return patchParsed("/users/me", payload, UserResponseSchema);
}

export function changePassword(payload: ChangePasswordRequest): Promise<void> {
  return postVoid("/users/me/password", payload);
}

export function deleteAccount(payload: DeleteAccountRequest): Promise<void> {
  return deleteVoid("/users/me", {
    headers: { "X-Confirm-Password": payload.currentPassword },
  });
}

export function listUsers(params: UserListParams): Promise<UserListPage> {
  return getParsed("/admin/users", UserListPageSchema, { params });
}

export function getAdminUser(id: number): Promise<UserResponse> {
  return getParsed(`/admin/users/${id}`, UserResponseSchema);
}

export function updateAdminUser(id: number, payload: UpdateProfileRequest): Promise<UserResponse> {
  return patchParsed(`/admin/users/${id}`, payload, UserResponseSchema);
}

export function promoteAdminUser(id: number): Promise<UserResponse> {
  return putParsed(`/admin/users/${id}/promote`, undefined, UserResponseSchema);
}

export function demoteAdminUser(id: number): Promise<UserResponse> {
  return putParsed(`/admin/users/${id}/demote`, undefined, UserResponseSchema);
}

export function softDeleteAdminUser(id: number): Promise<UserResponse> {
  return postParsed(`/admin/users/${id}/soft-delete`, undefined, UserResponseSchema);
}

export function restoreAdminUser(id: number): Promise<UserResponse> {
  return postParsed(`/admin/users/${id}/restore`, undefined, UserResponseSchema);
}
