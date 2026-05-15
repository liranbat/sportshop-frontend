import { api } from "@/lib/api";
import { CategoriesSchema, type Category } from "@/features/categories/schema";

export async function listActiveCategories(): Promise<Category[]> {
  const { data } = await api.get<unknown>("/api/categories/active");
  return CategoriesSchema.parse(data);
}
