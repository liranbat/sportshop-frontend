import { api } from "@/lib/api";
import {
  CartCountSchema,
  CartValidationResultSchema,
  CartViewSchema,
  type AddCartItemRequest,
  type CartCount,
  type CartValidationResult,
  type CartView,
  type UpdateCartItemRequest,
} from "@/features/cart/schema";

export async function getCartCount(): Promise<CartCount> {
  const { data } = await api.get<unknown>("/api/cart/count");
  return CartCountSchema.parse(data);
}

export async function syncCart(): Promise<CartView> {
  const { data } = await api.post<unknown>("/api/cart/sync");
  return CartViewSchema.parse(data);
}

export async function validateCart(): Promise<CartValidationResult> {
  const { data } = await api.post<unknown>("/api/cart/validate");
  return CartValidationResultSchema.parse(data);
}

export async function addCartItem(payload: AddCartItemRequest): Promise<void> {
  await api.post("/api/cart/items", payload);
}

export async function updateCartItem(
  productId: number,
  size: string,
  payload: UpdateCartItemRequest,
): Promise<void> {
  await api.patch(`/api/cart/items/${productId}/${encodeURIComponent(size)}`, payload);
}

export async function removeCartItem(productId: number, size: string): Promise<void> {
  await api.delete(`/api/cart/items/${productId}/${encodeURIComponent(size)}`);
}
