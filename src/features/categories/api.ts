import {
  CategoriesSchema,
  CategorySchema,
  type Category,
  type CategorySoftDeleteRequest,
  type CategoryWriteRequest,
} from "@/features/categories/schema";
import { getParsed, postParsed, putParsed } from "@/lib/api-client";

export function listCategories(): Promise<Category[]> {
  return getParsed("/categories", CategoriesSchema);
}

export function listAdminCategories(): Promise<Category[]> {
  return getParsed("/admin/categories", CategoriesSchema);
}

export function createAdminCategory(payload: CategoryWriteRequest): Promise<Category> {
  return postParsed("/admin/categories", payload, CategorySchema);
}

export function updateAdminCategory(id: number, payload: CategoryWriteRequest): Promise<Category> {
  return putParsed(`/admin/categories/${id}`, payload, CategorySchema);
}

export function softDeleteAdminCategory(
  id: number,
  payload: CategorySoftDeleteRequest,
): Promise<Category> {
  return postParsed(`/admin/categories/${id}/delete`, payload, CategorySchema);
}

export function restoreAdminCategory(id: number): Promise<Category> {
  return postParsed(`/admin/categories/${id}/restore`, undefined, CategorySchema);
}
