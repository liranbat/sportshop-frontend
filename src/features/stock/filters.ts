import {
  createFiltersEqual,
  createPageSizeOptions,
  wireOptionalTrimmed,
  wireSort,
  type SortDirection,
} from "@/lib/filters";

export type StockSortField = "name" | "quantity" | "threshold";
export type StockSortDirection = SortDirection;

export type StockStatusFilter = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type StockArchiveStatus = "ACTIVE" | "ARCHIVED" | "ALL";

export const { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, isPageSize } = createPageSizeOptions(
  [25, 50, 100] as const,
  50,
);
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

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

  wireOptionalTrimmed(params, "searchName", filters.search);

  const sizes = parseSizesText(filters.sizes);
  if (sizes.length > 0) params.sizes = sizes;

  if (filters.stockStatus !== "ALL") params.stockStatus = filters.stockStatus;
  if (filters.archiveStatus !== "ALL") params.archiveStatus = filters.archiveStatus;

  wireSort(params, filters.sortEnabled, filters.sortField, filters.sortDirection);

  return params;
}

export const filtersEqual = createFiltersEqual<StagedStockFilters>([
  "search",
  "sizes",
  "stockStatus",
  "archiveStatus",
  "sortField",
  "sortDirection",
  "sortEnabled",
  "pageSize",
]);

// "M, L, 42" -> ["M", "L", "42"]; trims tokens and drops empties so trailing
// commas / double commas don't reach the backend.
function parseSizesText(text: string): readonly string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
