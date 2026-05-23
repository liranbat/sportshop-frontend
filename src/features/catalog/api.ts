import { api } from "@/lib/api";
import type { ProductListParams } from "@/features/catalog/filters";
import {
  ProductDetailSchema,
  ProductPageSchema,
  type ProductDetail,
  type ProductPage,
} from "@/features/catalog/schema";

export async function listProducts(params: ProductListParams): Promise<ProductPage> {
  const { data } = await api.get<unknown>("/api/products", { params });
  return ProductPageSchema.parse(data);
}

export async function getProduct(id: number): Promise<ProductDetail> {
  const { data } = await api.get<unknown>(`/api/products/${id}`);
  return ProductDetailSchema.parse(data);
}
