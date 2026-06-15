export type SessionSortField = "user" | "expiresAt";
export type SessionSortDirection = "asc" | "desc";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 20;

export function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value);
}

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

  const trimmedSearch = filters.search.trim();
  if (trimmedSearch.length > 0) params.q = trimmedSearch;

  if (filters.sortEnabled) {
    params.sortField = filters.sortField;
    params.sortDirection = filters.sortDirection;
  }

  return params;
}

export function filtersEqual(a: StagedSessionFilters, b: StagedSessionFilters): boolean {
  return (
    a.search === b.search &&
    a.sortEnabled === b.sortEnabled &&
    a.sortField === b.sortField &&
    a.sortDirection === b.sortDirection &&
    a.pageSize === b.pageSize
  );
}
