import type { CartItem } from "@/features/cart/schema";

export type CartItemRowState =
  | "DEFAULT"
  | "LOW_STOCK"
  | "INSUFFICIENT_STOCK"
  | "OUT_OF_STOCK"
  | "UNAVAILABLE";

export function cartItemRowState(item: CartItem): CartItemRowState {
  if (item.productIsArchived) return "UNAVAILABLE";
  if (item.availableStock === 0) return "OUT_OF_STOCK";
  if (item.availableStock < item.quantity) return "INSUFFICIENT_STOCK";
  if (item.lowStockThreshold !== null && item.availableStock <= item.lowStockThreshold) {
    return "LOW_STOCK";
  }
  return "DEFAULT";
}

// LOW_STOCK is informational; only the three real blocking states gate checkout.
export function cartHasBlockingIssues(items: readonly CartItem[]): boolean {
  return items.some((item) => {
    const state = cartItemRowState(item);
    return state === "OUT_OF_STOCK" || state === "INSUFFICIENT_STOCK" || state === "UNAVAILABLE";
  });
}
