import { z } from "zod";

export const CartCountSchema = z.object({
  itemCount: z.number().int().nonnegative(),
});

export const CartItemSchema = z.object({
  productId: z.number().int().positive(),
  size: z.string().min(1).max(20),
  quantity: z.number().int().min(1),
  productName: z.string().min(1).max(200),
  productImageUrl: z.string().max(500).nullable(),
  productPrice: z.number().min(0),
  productCategoryName: z.string().max(100).nullable(),
  productIsArchived: z.boolean(),
  productVersionInCart: z.number().int().min(1),
  productVersionCurrent: z.number().int().min(1),
  availableStock: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().nullable(),
  lineTotal: z.number().min(0),
});

export const CartViewSchema = z.object({
  items: z.array(CartItemSchema),
  itemCount: z.number().int().nonnegative(),
  subtotal: z.number().min(0),
});

export const StockIssueKindSchema = z.enum(["OUT_OF_STOCK", "INSUFFICIENT_STOCK"]);

export const VersionMismatchSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1).max(200),
  size: z.string().min(1).max(20),
  productIsArchived: z.boolean(),
});

export const StockIssueSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1).max(200),
  size: z.string().min(1).max(20),
  kind: StockIssueKindSchema,
  availableStock: z.number().int().nonnegative(),
  requestedQuantity: z.number().int().min(1),
});

export const CartValidationResultSchema = z.object({
  ok: z.boolean(),
  versionMismatches: z.array(VersionMismatchSchema),
  stockIssues: z.array(StockIssueSchema),
  cart: CartViewSchema,
});

export const AddCartItemRequestSchema = z.object({
  productId: z.number().int().positive(),
  size: z.string().min(1).max(20),
  quantity: z.number().int().min(1),
});

export const UpdateCartItemRequestSchema = z.object({
  quantity: z.number().int().min(1),
});

export type CartCount = z.infer<typeof CartCountSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type CartView = z.infer<typeof CartViewSchema>;
export type StockIssueKind = z.infer<typeof StockIssueKindSchema>;
export type VersionMismatch = z.infer<typeof VersionMismatchSchema>;
export type StockIssue = z.infer<typeof StockIssueSchema>;
export type CartValidationResult = z.infer<typeof CartValidationResultSchema>;
export type AddCartItemRequest = z.infer<typeof AddCartItemRequestSchema>;
export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemRequestSchema>;
