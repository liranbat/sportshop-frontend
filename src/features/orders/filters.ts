import type { OrderStatus } from "@/features/orders/schema";
import {
  createFiltersEqual,
  createPageSizeOptions,
  wireOptionalTrimmed,
  wireSort,
  type SortDirection,
} from "@/lib/filters";

export type OrderSortField = "date" | "total";
export type OrderSortDirection = SortDirection;

export const { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, isPageSize } = createPageSizeOptions(
  [5, 10, 20] as const,
  10,
);
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export type StagedOrderFilters = {
  search: string;
  customer: string;
  status: OrderStatus | null;
  amountEnabled: boolean;
  amountMin: number | null;
  amountMax: number | null;
  dateEnabled: boolean;
  dateFrom: string | null;
  dateTo: string | null;
  sortEnabled: boolean;
  sortField: OrderSortField;
  sortDirection: OrderSortDirection;
  pageSize: PageSize;
};

export const DEFAULT_FILTERS: StagedOrderFilters = {
  search: "",
  customer: "",
  status: null,
  amountEnabled: false,
  amountMin: null,
  amountMax: null,
  dateEnabled: false,
  dateFrom: null,
  dateTo: null,
  sortEnabled: false,
  sortField: "date",
  sortDirection: "desc",
  pageSize: DEFAULT_PAGE_SIZE,
};

export type OrderListParams = {
  status?: OrderStatus;
  orderNumber?: string;
  customer?: string;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string;
  dateTo?: string;
  sortField?: OrderSortField;
  sortDirection?: OrderSortDirection;
  page?: number;
  pageSize?: number;
};

export function toOrderListParams(filters: StagedOrderFilters, page: number): OrderListParams {
  const params: OrderListParams = { page, pageSize: filters.pageSize };

  wireOptionalTrimmed(params, "orderNumber", filters.search);
  wireOptionalTrimmed(params, "customer", filters.customer);

  if (filters.status !== null) params.status = filters.status;

  if (filters.amountEnabled) {
    if (filters.amountMin !== null) params.amountMin = filters.amountMin;
    if (filters.amountMax !== null) params.amountMax = filters.amountMax;
  }

  if (filters.dateEnabled) {
    if (filters.dateFrom !== null) params.dateFrom = filters.dateFrom;
    if (filters.dateTo !== null) params.dateTo = filters.dateTo;
  }

  wireSort(params, filters.sortEnabled, filters.sortField, filters.sortDirection);

  return params;
}

export const filtersEqual = createFiltersEqual<StagedOrderFilters>([
  "search",
  "customer",
  "status",
  "amountEnabled",
  "amountMin",
  "amountMax",
  "dateEnabled",
  "dateFrom",
  "dateTo",
  "sortEnabled",
  "sortField",
  "sortDirection",
  "pageSize",
]);
