import { z } from "zod";

export const CheckoutStepSchema = z.enum([
  "shipping",
  "payment",
  "processing",
  "success",
  "failure",
]);
export type CheckoutStep = z.infer<typeof CheckoutStepSchema>;

const FULL_NAME_PATTERN = /^[A-Za-z]+(?:[-\s][A-Za-z]+)*$/;
const nameLikeSchema = (label: string) =>
  z
    .string()
    .trim()
    .refine((v) => v.length >= 2 && v.length <= 100 && FULL_NAME_PATTERN.test(v), {
      message: `${label} must be 2-100 letters (a-z); '-' or space allowed only between letters`,
    });

const fullNameSchema = nameLikeSchema("Full name");
const cardholderNameSchema = nameLikeSchema("Cardholder name");

const emailSchema = z
  .string()
  .trim()
  .pipe(z.email("Enter a valid email address").max(254, "Email must be 254 characters or fewer"));

const phoneSchema = z.string().refine((v) => /^05\d{8}$/.test(v), {
  message: "Enter a valid Israeli mobile number — 10 digits starting with 05 (e.g. 0521234567)",
});

export const ShippingFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: z.string().min(1, "Country is required").max(100),
  city: z.string().min(1, "City is required").max(100),
  addressLine: z.string().min(1, "Address is required").max(200),
});
export type ShippingForm = z.infer<typeof ShippingFormSchema>;

const cardNumberSchema = z
  .string()
  .transform((v) => v.replace(/\s/g, ""))
  .refine((v) => /^\d{13,19}$/.test(v), {
    message: "Card number must be 13-19 digits",
  });

const expirySchema = z.string().refine(
  (value) => {
    const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
    if (!match) return false;
    const [, mm, yy] = match;
    if (mm === undefined || yy === undefined) return false;
    const month = parseInt(mm, 10);
    const year = 2000 + parseInt(yy, 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year > currentYear) return true;
    if (year < currentYear) return false;
    return month >= currentMonth;
  },
  { message: "Expiry must be MM/YY and not in the past" },
);

const cvcSchema = z.string().refine((v) => /^\d{3,4}$/.test(v.trim()), {
  message: "CVC must be 3 or 4 digits",
});

export const PaymentFormSchema = z.object({
  cardNumber: cardNumberSchema,
  cardholderName: cardholderNameSchema,
  expiry: expirySchema,
  cvc: cvcSchema,
});
export type PaymentForm = z.infer<typeof PaymentFormSchema>;
