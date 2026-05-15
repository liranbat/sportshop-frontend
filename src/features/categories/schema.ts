import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  icon: z.string().nullable(),
});

export const CategoriesSchema = z.array(CategorySchema);

export type Category = z.infer<typeof CategorySchema>;
