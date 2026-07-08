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
import { deleteVoid, getParsed, patchVoid, postParsed, postVoid } from "@/lib/api-client";

export function getCartCount(): Promise<CartCount> {
  return getParsed("/cart/count", CartCountSchema);
}

export function getCart(): Promise<CartView> {
  return getParsed("/cart", CartViewSchema);
}

export function syncCart(): Promise<CartView> {
  return postParsed("/cart/sync", undefined, CartViewSchema);
}

export function validateCart(): Promise<CartValidationResult> {
  return postParsed("/cart/validate", undefined, CartValidationResultSchema);
}

export function addCartItem(payload: AddCartItemRequest): Promise<void> {
  return postVoid("/cart/items", payload);
}

export function updateCartItem(
  productId: number,
  size: string,
  payload: UpdateCartItemRequest,
): Promise<void> {
  return patchVoid(`/cart/items/${productId}/${encodeURIComponent(size)}`, payload);
}

export function removeCartItem(productId: number, size: string): Promise<void> {
  return deleteVoid(`/cart/items/${productId}/${encodeURIComponent(size)}`);
}
