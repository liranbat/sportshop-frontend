import type { OrderStatus } from "@/features/orders/schema";

export type OrderSortField = "date" | "total";
export type OrderSortDirection = "asc" | "desc";

export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 10;

export function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value);
}

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

  const trimmedSearch = filters.search.trim();
  if (trimmedSearch.length > 0) params.orderNumber = trimmedSearch;

  const trimmedCustomer = filters.customer.trim();
  if (trimmedCustomer.length > 0) params.customer = trimmedCustomer;

  if (filters.status !== null) params.status = filters.status;

  if (filters.amountEnabled) {
    if (filters.amountMin !== null) params.amountMin = filters.amountMin;
    if (filters.amountMax !== null) params.amountMax = filters.amountMax;
  }

  if (filters.dateEnabled) {
    if (filters.dateFrom !== null) params.dateFrom = filters.dateFrom;
    if (filters.dateTo !== null) params.dateTo = filters.dateTo;
  }

  if (filters.sortEnabled) {
    params.sortField = filters.sortField;
    params.sortDirection = filters.sortDirection;
  }

  return params;
}

export function filtersEqual(a: StagedOrderFilters, b: StagedOrderFilters): boolean {
  return (
    a.search === b.search &&
    a.customer === b.customer &&
    a.status === b.status &&
    a.amountEnabled === b.amountEnabled &&
    a.amountMin === b.amountMin &&
    a.amountMax === b.amountMax &&
    a.dateEnabled === b.dateEnabled &&
    a.dateFrom === b.dateFrom &&
    a.dateTo === b.dateTo &&
    a.sortEnabled === b.sortEnabled &&
    a.sortField === b.sortField &&
    a.sortDirection === b.sortDirection &&
    a.pageSize === b.pageSize
  );
}
