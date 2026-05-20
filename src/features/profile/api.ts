import { api } from "@/lib/api";
import { UserResponseSchema, type UserResponse } from "@/features/auth/schema";
import type {
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
} from "@/features/profile/schema";

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
