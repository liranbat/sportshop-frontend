import { api } from "@/lib/api";
import type { ProductListParams } from "@/features/catalog/filters";
import { ProductsSchema, type Product } from "@/features/catalog/schema";

export async function listProducts(params: ProductListParams): Promise<Product[]> {
  const { data } = await api.get<unknown>("/api/products", { params });
  return ProductsSchema.parse(data);
}
