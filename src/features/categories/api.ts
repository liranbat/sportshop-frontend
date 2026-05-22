import { api } from "@/lib/api";
import {
  CategoriesSchema,
  type CategoryListParams,
  type Category,
} from "@/features/categories/schema";

export async function listCategories(params: CategoryListParams): Promise<Category[]> {
  const { data } = await api.get<unknown>("/api/categories", { params });
  return CategoriesSchema.parse(data);
}
