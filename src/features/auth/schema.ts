import { z } from "zod";

// Letters only, hyphen permitted only between letter groups (no leading/trailing/consecutive hyphens)
const NAME_PATTERN = /^[A-Za-z]+(-[A-Za-z]+)*$/;

export const SignInRequestSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;

// confirmPassword lives on the client only; stripped before sending to the server in Phase 3
export const SignUpFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .refine(
        (v) => v.length >= 2 && v.length <= 50 && NAME_PATTERN.test(v),
        {
          message:
            "First name must be 2-50 letters (a-z); '-' allowed only between letters",
        },
      ),
    lastName: z
      .string()
      .trim()
      .refine(
        (v) => v.length >= 2 && v.length <= 50 && NAME_PATTERN.test(v),
        {
          message:
            "Last name must be 2-50 letters (a-z); '-' allowed only between letters",
        },
      ),
    email: z
      .string()
      .trim()
      .pipe(
        z
          .email("Enter a valid email address")
          .max(254, "Email must be 254 characters or fewer"),
      ),
    // strip user-entered dashes/spaces so the server always receives 10-digit "05XXXXXXXX"
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[-\s]/g, ""))
      .refine((v) => /^05\d{8}$/.test(v), {
        message: "Enter a valid Israeli mobile number (e.g. 052-1234567)",
      }),
    password: z
      .string()
      .refine(
        (v) =>
          v.length >= 8 &&
          v.length <= 30 &&
          /[A-Za-z]/.test(v) &&
          /\d/.test(v) &&
          !/\s/.test(v),
        {
          message:
            "Password must be 8-30 characters, include both letters and numbers, and contain no spaces",
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

// /api/auth/me response shape — used by Phase 3 to drive Navbar variant
export const MeResponseSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  isAdmin: z.boolean(),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
