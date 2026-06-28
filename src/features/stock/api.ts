import { api } from "@/lib/api";
import type { StockListParams } from "@/features/stock/filters";
import {
  StockPageSchema,
  StockRowSchema,
  type StockAdjustRequest,
  type StockPage,
  type StockRow,
  type StockSetRequest,
  type StockSizeAddRequest,
} from "@/features/stock/schema";

export async function listAdminStock(params: StockListParams): Promise<StockPage> {
  const { data } = await api.get<unknown>("/api/admin/stock", { params });
  return StockPageSchema.parse(data);
}

export async function setAdminStock(
  productId: number,
  size: string,
  body: StockSetRequest,
): Promise<StockRow> {
  const { data } = await api.put<unknown>(
    `/api/admin/stock/${productId}/${encodeURIComponent(size)}`,
    body,
  );
  return StockRowSchema.parse(data);
}

export async function adjustAdminStock(
  productId: number,
  size: string,
  body: StockAdjustRequest,
): Promise<StockRow> {
  const { data } = await api.post<unknown>(
    `/api/admin/stock/${productId}/${encodeURIComponent(size)}/adjust`,
    body,
  );
  return StockRowSchema.parse(data);
}

export async function addAdminStockSize(
  productId: number,
  body: StockSizeAddRequest,
): Promise<StockRow> {
  const { data } = await api.post<unknown>(`/api/admin/stock/${productId}/sizes`, body);
  return StockRowSchema.parse(data);
}

export async function removeAdminStockSize(productId: number, size: string): Promise<void> {
  await api.delete(`/api/admin/stock/${productId}/sizes/${encodeURIComponent(size)}`);
}
