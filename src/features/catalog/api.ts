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
import { getParsed, postParsed, putParsed } from "@/lib/api-client";

export function listProducts(params: ProductListParams): Promise<ProductPage> {
  return getParsed("/products", ProductPageSchema, { params });
}

export function listAdminProducts(params: ProductListParams): Promise<ProductPage> {
  return getParsed("/admin/products", ProductPageSchema, { params });
}

export function getProduct(id: number): Promise<ProductDetail> {
  return getParsed(`/products/${id}`, ProductDetailSchema);
}

export function createAdminProduct(payload: ProductCreateRequest): Promise<ProductDetail> {
  return postParsed("/admin/products", payload, ProductDetailSchema);
}

export function updateAdminProduct(
  id: number,
  payload: ProductUpdateRequest,
): Promise<ProductDetail> {
  return putParsed(`/admin/products/${id}`, payload, ProductDetailSchema);
}

export function archiveAdminProduct(
  id: number,
  payload: ProductLifecycleRequest,
): Promise<ProductDetail> {
  return postParsed(`/admin/products/${id}/archive`, payload, ProductDetailSchema);
}

export function restoreAdminProduct(
  id: number,
  payload: ProductLifecycleRequest,
): Promise<ProductDetail> {
  return postParsed(`/admin/products/${id}/restore`, payload, ProductDetailSchema);
}
