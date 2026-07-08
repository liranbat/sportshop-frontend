import { z } from "zod";
import { ONE_SIZE_TOKEN } from "@/lib/schemas/constants";
import { pageSchema } from "@/lib/schemas/pagination";

export { ONE_SIZE_TOKEN };

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().nullable(),
  categoryId: z.number().int().positive().optional(),
  isMultiSize: z.boolean(),
  imageUrl: z.string().nullable(),
  price: z.number().min(0),
  version: z.number().int().nonnegative(),
  isArchived: z.boolean(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
  archivedAt: z.string().nullable().optional(),
  archivedBy: z.number().int().positive().nullable().optional(),
});

export const ProductPageSchema = pageSchema(ProductSchema);

export const StockStateSchema = z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]);

export const ProductSizeSchema = z.object({
  size: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  state: StockStateSchema,
});

export const ProductDetailSchema = ProductSchema.extend({
  categoryName: z.string().min(1).max(100).optional(),
  sizes: z.array(ProductSizeSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductPage = z.infer<typeof ProductPageSchema>;
export type StockState = z.infer<typeof StockStateSchema>;
export type ProductSize = z.infer<typeof ProductSizeSchema>;
export type ProductDetail = z.infer<typeof ProductDetailSchema>;

export const SIZE_TOKEN_MAX_LENGTH = 20;
const NAME_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 2000;
const IMAGE_URL_MAX_LENGTH = 500;

export const ProductStockEntrySchema = z.object({
  quantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).nullable().optional(),
});
export type ProductStockEntry = z.infer<typeof ProductStockEntrySchema>;

export const ProductCreateRequestSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH).nullable().optional(),
  categoryId: z.number().int().positive(),
  isMultiSize: z.boolean(),
  imageUrl: z.string().max(IMAGE_URL_MAX_LENGTH).nullable().optional(),
  price: z.number().min(0),
  stockBySize: z.record(z.string(), ProductStockEntrySchema),
});
export type ProductCreateRequest = z.infer<typeof ProductCreateRequestSchema>;

// Form-only shape: row array for useFieldArray ergonomics, transformed to ProductCreateRequest on submit.
export const ProductCreateFormStockRowSchema = z.object({
  size: z
    .string()
    .trim()
    .min(1, "Size is required.")
    .max(SIZE_TOKEN_MAX_LENGTH, `Size must be ≤ ${SIZE_TOKEN_MAX_LENGTH} characters.`),
  quantity: z
    .number({ message: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(0, "Quantity must be ≥ 0."),
  lowStockThreshold: z
    .number()
    .int("Threshold must be a whole number.")
    .min(0, "Threshold must be ≥ 0.")
    .nullable(),
});
export type ProductCreateFormStockRow = z.infer<typeof ProductCreateFormStockRowSchema>;

export const ProductCreateFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required.")
      .max(NAME_MAX_LENGTH, `Name must be ≤ ${NAME_MAX_LENGTH} characters.`),
    description: z
      .string()
      .max(DESCRIPTION_MAX_LENGTH, `Description must be ≤ ${DESCRIPTION_MAX_LENGTH} characters.`),
    categoryId: z
      .number({ message: "Category is required." })
      .int()
      .positive("Category is required."),
    imageUrl: z
      .string()
      .max(IMAGE_URL_MAX_LENGTH, `Image URL must be ≤ ${IMAGE_URL_MAX_LENGTH} characters.`),
    price: z.number({ message: "Price is required." }).min(0, "Price must be ≥ 0."),
    isMultiSize: z.boolean(),
    stockRows: z.array(ProductCreateFormStockRowSchema).min(1, "Add at least one stock row."),
  })
  .superRefine((data, ctx) => {
    if (!data.isMultiSize) {
      if (data.stockRows.length !== 1 || data.stockRows[0]?.size !== ONE_SIZE_TOKEN) {
        ctx.addIssue({
          code: "custom",
          path: ["stockRows"],
          message: `Single-size products must have exactly one row keyed '${ONE_SIZE_TOKEN}'.`,
        });
      }
      return;
    }
    data.stockRows.forEach((row, index) => {
      if (row.size === ONE_SIZE_TOKEN) {
        ctx.addIssue({
          code: "custom",
          path: ["stockRows", index, "size"],
          message: `Multi-size products must not use '${ONE_SIZE_TOKEN}'.`,
        });
      }
    });
    const seen = new Map<string, number>();
    data.stockRows.forEach((row, index) => {
      const key = row.size.trim();
      if (key.length === 0) return;
      const prior = seen.get(key);
      if (prior !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["stockRows", index, "size"],
          message: `Duplicate size '${key}'.`,
        });
      } else {
        seen.set(key, index);
      }
    });
  });
export type ProductCreateForm = z.infer<typeof ProductCreateFormSchema>;

export function toProductCreateRequest(form: ProductCreateForm): ProductCreateRequest {
  const stockBySize: Record<string, ProductStockEntry> = {};
  for (const row of form.stockRows) {
    stockBySize[row.size.trim()] = {
      quantity: row.quantity,
      lowStockThreshold: row.lowStockThreshold,
    };
  }
  return {
    name: form.name.trim(),
    description: form.description.trim().length === 0 ? null : form.description.trim(),
    categoryId: form.categoryId,
    isMultiSize: form.isMultiSize,
    imageUrl: form.imageUrl.length === 0 ? null : form.imageUrl,
    price: form.price,
    stockBySize,
  };
}

export const ProductUpdateRequestSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH).nullable().optional(),
  categoryId: z.number().int().positive(),
  isMultiSize: z.boolean(),
  imageUrl: z.string().max(IMAGE_URL_MAX_LENGTH).nullable().optional(),
  price: z.number().min(0),
  version: z.number().int().nonnegative(),
});
export type ProductUpdateRequest = z.infer<typeof ProductUpdateRequestSchema>;

export const ProductUpdateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .max(NAME_MAX_LENGTH, `Name must be ≤ ${NAME_MAX_LENGTH} characters.`),
  description: z
    .string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be ≤ ${DESCRIPTION_MAX_LENGTH} characters.`),
  categoryId: z
    .number({ message: "Category is required." })
    .int()
    .positive("Category is required."),
  imageUrl: z
    .string()
    .max(IMAGE_URL_MAX_LENGTH, `Image URL must be ≤ ${IMAGE_URL_MAX_LENGTH} characters.`),
  price: z.number({ message: "Price is required." }).min(0, "Price must be ≥ 0."),
  isMultiSize: z.boolean(),
  version: z.number().int().nonnegative(),
});
export type ProductUpdateForm = z.infer<typeof ProductUpdateFormSchema>;

export function toProductUpdateRequest(form: ProductUpdateForm): ProductUpdateRequest {
  return {
    name: form.name.trim(),
    description: form.description.trim().length === 0 ? null : form.description.trim(),
    categoryId: form.categoryId,
    isMultiSize: form.isMultiSize,
    imageUrl: form.imageUrl.length === 0 ? null : form.imageUrl,
    price: form.price,
    version: form.version,
  };
}

export const ProductLifecycleRequestSchema = z.object({
  version: z.number().int().nonnegative(),
});
export type ProductLifecycleRequest = z.infer<typeof ProductLifecycleRequestSchema>;
