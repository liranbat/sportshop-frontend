export type SortField = "name" | "price" | "category";
export type SortDirection = "asc" | "desc";

export const PAGE_SIZE_OPTIONS = [4, 9, 16, 25] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 9;

export type ArchiveStatus = "ACTIVE" | "ARCHIVED" | "ALL";

export function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value);
}

export type StagedFilters = {
  search: string;
  categoryIds: readonly number[];
  priceEnabled: boolean;
  priceMin: number | null;
  priceMax: number | null;
  sortField: SortField;
  sortEnabled: boolean;
  sortDirection: SortDirection;
  pageSize: PageSize;
  archiveStatus: ArchiveStatus;
};

export const DEFAULT_FILTERS: StagedFilters = {
  search: "",
  categoryIds: [],
  priceEnabled: false,
  priceMin: null,
  priceMax: null,
  sortField: "name",
  sortEnabled: false,
  sortDirection: "asc",
  pageSize: DEFAULT_PAGE_SIZE,
  archiveStatus: "ACTIVE",
};

export type ProductListParams = {
  search?: string;
  categoryIds?: readonly number[];
  priceMin?: number;
  priceMax?: number;
  sortField?: SortField;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
  archiveStatus?: "ACTIVE" | "ARCHIVED";
  isMultiSize?: boolean;
};

export function toProductListParams(
  filters: StagedFilters,
  page: number,
  isAdmin: boolean,
): ProductListParams {
  const params: ProductListParams = { page, pageSize: filters.pageSize };

  const trimmedSearch = filters.search.trim();
  if (trimmedSearch.length > 0) params.search = trimmedSearch;

  if (filters.categoryIds.length > 0) params.categoryIds = filters.categoryIds;

  if (filters.priceEnabled) {
    if (filters.priceMin !== null) params.priceMin = filters.priceMin;
    if (filters.priceMax !== null) params.priceMax = filters.priceMax;
  }

  if (filters.sortEnabled) {
    params.sortField = filters.sortField;
    params.sortDirection = filters.sortDirection;
  }

  if (isAdmin && filters.archiveStatus !== "ALL") {
    params.archiveStatus = filters.archiveStatus;
  }

  return params;
}

export function filtersEqual(a: StagedFilters, b: StagedFilters): boolean {
  return (
    a.search === b.search &&
    a.priceEnabled === b.priceEnabled &&
    a.priceMin === b.priceMin &&
    a.priceMax === b.priceMax &&
    a.sortField === b.sortField &&
    a.sortEnabled === b.sortEnabled &&
    a.sortDirection === b.sortDirection &&
    a.pageSize === b.pageSize &&
    a.archiveStatus === b.archiveStatus &&
    a.categoryIds.length === b.categoryIds.length &&
    a.categoryIds.every((id, i) => id === b.categoryIds[i])
  );
}
