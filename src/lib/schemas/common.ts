import { z } from "zod";

export const emailFormSchema = z
  .string()
  .trim()
  .pipe(z.email("Enter a valid email address").max(254, "Email must be 254 characters or fewer"));

export const phoneSchema = z.string().refine((v) => /^05\d{8}$/.test(v), {
  message: "Enter a valid Israeli mobile number — 10 digits starting with 05 (e.g. 0521234567)",
});

export const orderNumberSchema = z
  .string()
  .length(23)
  .regex(/^ORD-\d{8}-[A-Z0-9]{10}$/, "Invalid order number format");
