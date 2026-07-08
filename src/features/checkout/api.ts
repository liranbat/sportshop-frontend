import {
  CheckoutResultSchema,
  type CheckoutRequest,
  type CheckoutResult,
} from "@/features/checkout/schema";
import { postParsed } from "@/lib/api-client";

export function postCheckout(payload: CheckoutRequest): Promise<CheckoutResult> {
  return postParsed("/checkout", payload, CheckoutResultSchema);
}
