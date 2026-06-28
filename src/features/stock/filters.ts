export type StockSortField = "name" | "quantity" | "threshold";
export type StockSortDirection = "asc" | "desc";

export type StockStatusFilter = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type StockArchiveStatus = "ACTIVE" | "ARCHIVED" | "ALL";

export const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 50;

export function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value);
}

export type StagedStockFilters = {
  search: string;
  sizes: string;
  stockStatus: StockStatusFilter;
  archiveStatus: StockArchiveStatus;
  sortField: StockSortField;
  sortDirection: StockSortDirection;
  sortEnabled: boolean;
  pageSize: PageSize;
};

export const DEFAULT_FILTERS: StagedStockFilters = {
  search: "",
  sizes: "",
  stockStatus: "ALL",
  archiveStatus: "ACTIVE",
  sortField: "name",
  sortDirection: "asc",
  sortEnabled: false,
  pageSize: DEFAULT_PAGE_SIZE,
};

export type StockListParams = {
  searchName?: string;
  sizes?: readonly string[];
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  archiveStatus?: "ACTIVE" | "ARCHIVED";
  sortField?: StockSortField;
  sortDirection?: StockSortDirection;
  page?: number;
  pageSize?: number;
};

export function toStockListParams(filters: StagedStockFilters, page: number): StockListParams {
  const params: StockListParams = { page, pageSize: filters.pageSize };

  const trimmed = filters.search.trim();
  if (trimmed.length > 0) params.searchName = trimmed;

  const sizes = parseSizesText(filters.sizes);
  if (sizes.length > 0) params.sizes = sizes;

  if (filters.stockStatus !== "ALL") params.stockStatus = filters.stockStatus;
  if (filters.archiveStatus !== "ALL") params.archiveStatus = filters.archiveStatus;

  if (filters.sortEnabled) {
    params.sortField = filters.sortField;
    params.sortDirection = filters.sortDirection;
  }

  return params;
}

export function filtersEqual(a: StagedStockFilters, b: StagedStockFilters): boolean {
  return (
    a.search === b.search &&
    a.stockStatus === b.stockStatus &&
    a.archiveStatus === b.archiveStatus &&
    a.sortField === b.sortField &&
    a.sortDirection === b.sortDirection &&
    a.sortEnabled === b.sortEnabled &&
    a.pageSize === b.pageSize &&
    a.sizes === b.sizes
  );
}

// "M, L, 42" -> ["M", "L", "42"]; trims tokens and drops empties so trailing
// commas / double commas don't reach the backend.
function parseSizesText(text: string): readonly string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
