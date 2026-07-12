import type { BadgeKind } from "@/components/Badge";

export type StockBadgeKind = Extract<BadgeKind, "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK">;

export const STOCK_LABEL: Record<StockBadgeKind, string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
};

export function statusBadgeStateForStock(
  quantity: number,
  threshold: number | null | undefined,
): StockBadgeKind {
  if (quantity === 0) return "OUT_OF_STOCK";
  if (threshold != null && threshold > 0 && quantity <= threshold) return "LOW_STOCK";
  return "IN_STOCK";
}
