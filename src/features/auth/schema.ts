import { z } from "zod";

// Letters only, hyphen permitted only between letter groups (no leading/trailing/consecutive hyphens)
const NAME_PATTERN = /^[A-Za-z]+(-[A-Za-z]+)*$/;

const nameSchema = (fieldLabel: string) =>
  z
    .string()
    .trim()
    .refine((v) => v.length >= 2 && v.length <= 50 && NAME_PATTERN.test(v), {
      message: `${fieldLabel} must be 2-50 letters (a-z); '-' allowed only between letters`,
    });

export const firstNameSchema = nameSchema("First name");
export const lastNameSchema = nameSchema("Last name");

const emailSchema = z
  .string()
  .trim()
  .pipe(z.email("Enter a valid email address").max(254, "Email must be 254 characters or fewer"));

export const phoneSchema = z.string().refine((v) => /^05\d{8}$/.test(v), {
  message: "Enter a valid Israeli mobile number — 10 digits starting with 05 (e.g. 0521234567)",
});

export const passwordSchema = z
  .string()
  .refine(
    (v) => v.length >= 8 && v.length <= 30 && /[A-Za-z]/.test(v) && /\d/.test(v) && !/\s/.test(v),
    {
      message:
        "Password must be 8-30 characters, include both letters and numbers, and contain no spaces",
    },
  );

export const LoginRequestSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

const registerRequestFields = {
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
};

export const RegisterRequestSchema = z.object(registerRequestFields);
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const SignUpFormSchema = z
  .object({
    ...registerRequestFields,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export const UserResponseSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  isAdmin: z.boolean(),
  isDeleted: z.boolean(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;
