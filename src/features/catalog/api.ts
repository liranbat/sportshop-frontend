import { api } from "@/lib/api";
import type { ProductListParams } from "@/features/catalog/filters";
import { ProductPageSchema, type ProductPage } from "@/features/catalog/schema";

export async function listProducts(params: ProductListParams): Promise<ProductPage> {
  const { data } = await api.get<unknown>("/api/products", { params });
  return ProductPageSchema.parse(data);
}
