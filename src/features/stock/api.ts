import type { StockListParams } from "@/features/stock/filters";
import {
  StockAdjustRequestSchema,
  StockPageSchema,
  StockRowSchema,
  StockSetRequestSchema,
  StockSizeAddRequestSchema,
  type StockAdjustRequest,
  type StockPage,
  type StockRow,
  type StockSetRequest,
  type StockSizeAddRequest,
} from "@/features/stock/schema";
import { deleteVoid, getParsed, postParsed, putParsed } from "@/lib/api-client";

export function listAdminStock(params: StockListParams): Promise<StockPage> {
  return getParsed("/admin/stock", StockPageSchema, { params });
}

export function setAdminStock(
  productId: number,
  size: string,
  body: StockSetRequest,
): Promise<StockRow> {
  return putParsed(
    `/admin/stock/${productId}/${encodeURIComponent(size)}`,
    StockSetRequestSchema.parse(body),
    StockRowSchema,
  );
}

export function adjustAdminStock(
  productId: number,
  size: string,
  body: StockAdjustRequest,
): Promise<StockRow> {
  return postParsed(
    `/admin/stock/${productId}/${encodeURIComponent(size)}/adjust`,
    StockAdjustRequestSchema.parse(body),
    StockRowSchema,
  );
}

export function addAdminStockSize(productId: number, body: StockSizeAddRequest): Promise<StockRow> {
  return postParsed(
    `/admin/stock/${productId}/sizes`,
    StockSizeAddRequestSchema.parse(body),
    StockRowSchema,
  );
}

export function removeAdminStockSize(productId: number, size: string): Promise<void> {
  return deleteVoid(`/admin/stock/${productId}/sizes/${encodeURIComponent(size)}`);
}
