import { z } from "zod";
import {
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  phoneSchema,
} from "@/features/auth/schema";

export const UpdateProfileRequestSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
});
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

const currentPasswordField = z.string().min(1, "Current password is required");

export const ChangePasswordRequestSchema = z.object({
  currentPassword: currentPasswordField,
  newPassword: passwordSchema,
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const ChangePasswordFormSchema = ChangePasswordRequestSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

export const DeleteAccountRequestSchema = z.object({
  currentPassword: currentPasswordField,
});
export type DeleteAccountRequest = z.infer<typeof DeleteAccountRequestSchema>;
