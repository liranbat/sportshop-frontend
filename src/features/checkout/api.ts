import { api } from "@/lib/api";
import {
  CheckoutResultSchema,
  type CheckoutRequest,
  type CheckoutResult,
} from "@/features/checkout/schema";

export async function postCheckout(payload: CheckoutRequest): Promise<CheckoutResult> {
  const { data } = await api.post<unknown>("/api/checkout", payload);
  return CheckoutResultSchema.parse(data);
}
