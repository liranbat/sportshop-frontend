import { api } from "@/lib/api";
import type { ProductListParams } from "@/features/catalog/filters";
import {
  ProductDetailSchema,
  ProductPageSchema,
  type ProductCreateRequest,
  type ProductDetail,
  type ProductLifecycleRequest,
  type ProductPage,
  type ProductUpdateRequest,
} from "@/features/catalog/schema";

export async function listProducts(params: ProductListParams): Promise<ProductPage> {
  const { data } = await api.get<unknown>("/products", { params });
  return ProductPageSchema.parse(data);
}

export async function listAdminProducts(params: ProductListParams): Promise<ProductPage> {
  const { data } = await api.get<unknown>("/admin/products", { params });
  return ProductPageSchema.parse(data);
}

export async function getProduct(id: number): Promise<ProductDetail> {
  const { data } = await api.get<unknown>(`/products/${id}`);
  return ProductDetailSchema.parse(data);
}

export async function createAdminProduct(payload: ProductCreateRequest): Promise<ProductDetail> {
  const { data } = await api.post<unknown>("/admin/products", payload);
  return ProductDetailSchema.parse(data);
}

export async function updateAdminProduct(
  id: number,
  payload: ProductUpdateRequest,
): Promise<ProductDetail> {
  const { data } = await api.put<unknown>(`/admin/products/${id}`, payload);
  return ProductDetailSchema.parse(data);
}

export async function archiveAdminProduct(
  id: number,
  payload: ProductLifecycleRequest,
): Promise<ProductDetail> {
  const { data } = await api.post<unknown>(`/admin/products/${id}/archive`, payload);
  return ProductDetailSchema.parse(data);
}

export async function restoreAdminProduct(
  id: number,
  payload: ProductLifecycleRequest,
): Promise<ProductDetail> {
  const { data } = await api.post<unknown>(`/admin/products/${id}/restore`, payload);
  return ProductDetailSchema.parse(data);
}
