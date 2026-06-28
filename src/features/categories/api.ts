import { api } from "@/lib/api";
import {
  CategoriesSchema,
  CategorySchema,
  type Category,
  type CategorySoftDeleteRequest,
  type CategoryWriteRequest,
} from "@/features/categories/schema";

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<unknown>("/api/categories");
  return CategoriesSchema.parse(data);
}

export async function listAdminCategories(): Promise<Category[]> {
  const { data } = await api.get<unknown>("/api/admin/categories");
  return CategoriesSchema.parse(data);
}

export async function createAdminCategory(payload: CategoryWriteRequest): Promise<Category> {
  const { data } = await api.post<unknown>("/api/admin/categories", payload);
  return CategorySchema.parse(data);
}

export async function updateAdminCategory(
  id: number,
  payload: CategoryWriteRequest,
): Promise<Category> {
  const { data } = await api.put<unknown>(`/api/admin/categories/${id}`, payload);
  return CategorySchema.parse(data);
}

export async function softDeleteAdminCategory(
  id: number,
  payload: CategorySoftDeleteRequest,
): Promise<Category> {
  const { data } = await api.post<unknown>(`/api/admin/categories/${id}/delete`, payload);
  return CategorySchema.parse(data);
}

export async function restoreAdminCategory(id: number): Promise<Category> {
  const { data } = await api.post<unknown>(`/api/admin/categories/${id}/restore`);
  return CategorySchema.parse(data);
}
