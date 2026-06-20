import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  icon: z.string().nullable(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  deletedAt: z.string().nullable().optional(),
  deletedBy: z.number().int().positive().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

export const CategoriesSchema = z.array(CategorySchema);

export type Category = z.infer<typeof CategorySchema>;

export const CategoryWriteRequestSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(500).nullable(),
});

export type CategoryWriteRequest = z.infer<typeof CategoryWriteRequestSchema>;

export const CategorySoftDeleteRequestSchema = z.object({
  replacementCategoryId: z.number().int().positive(),
});

export type CategorySoftDeleteRequest = z.infer<typeof CategorySoftDeleteRequestSchema>;
