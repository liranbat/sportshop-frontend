import {
  createFiltersEqual,
  createPageSizeOptions,
  wireOptionalTrimmed,
  wireSort,
  type SortDirection,
} from "@/lib/filters";

export type SessionSortField = "user" | "expiresAt";
export type SessionSortDirection = SortDirection;

export const { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, isPageSize } = createPageSizeOptions(
  [10, 20, 50] as const,
  20,
);
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export type StagedSessionFilters = {
  search: string;
  sortEnabled: boolean;
  sortField: SessionSortField;
  sortDirection: SessionSortDirection;
  pageSize: PageSize;
};

export const DEFAULT_FILTERS: StagedSessionFilters = {
  search: "",
  sortEnabled: false,
  sortField: "expiresAt",
  sortDirection: "desc",
  pageSize: DEFAULT_PAGE_SIZE,
};

export type SessionListParams = {
  q?: string;
  sortField?: SessionSortField;
  sortDirection?: SessionSortDirection;
  page?: number;
  pageSize?: number;
};

export function toSessionListParams(
  filters: StagedSessionFilters,
  page: number,
): SessionListParams {
  const params: SessionListParams = { page, pageSize: filters.pageSize };
  wireOptionalTrimmed(params, "q", filters.search);
  wireSort(params, filters.sortEnabled, filters.sortField, filters.sortDirection);
  return params;
}

export const filtersEqual = createFiltersEqual<StagedSessionFilters>([
  "search",
  "sortEnabled",
  "sortField",
  "sortDirection",
  "pageSize",
]);
