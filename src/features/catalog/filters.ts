import {
  createFiltersEqual,
  createPageSizeOptions,
  shallowArrayEqual,
  wireOptionalTrimmed,
  wireSort,
  type SortDirection as SharedSortDirection,
} from "@/lib/filters";

export type SortField = "name" | "price" | "category";
export type SortDirection = SharedSortDirection;

export const { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, isPageSize } = createPageSizeOptions(
  [4, 9, 16, 25] as const,
  9,
);
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export type ArchiveStatus = "ACTIVE" | "ARCHIVED" | "ALL";

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

  wireOptionalTrimmed(params, "search", filters.search);

  if (filters.categoryIds.length > 0) params.categoryIds = filters.categoryIds;

  if (filters.priceEnabled) {
    if (filters.priceMin !== null) params.priceMin = filters.priceMin;
    if (filters.priceMax !== null) params.priceMax = filters.priceMax;
  }

  wireSort(params, filters.sortEnabled, filters.sortField, filters.sortDirection);

  if (isAdmin && filters.archiveStatus !== "ALL") {
    params.archiveStatus = filters.archiveStatus;
  }

  return params;
}

export const filtersEqual = createFiltersEqual<StagedFilters>(
  [
    "search",
    "priceEnabled",
    "priceMin",
    "priceMax",
    "sortField",
    "sortEnabled",
    "sortDirection",
    "pageSize",
    "archiveStatus",
    "categoryIds",
  ],
  {
    categoryIds: shallowArrayEqual,
  },
);
