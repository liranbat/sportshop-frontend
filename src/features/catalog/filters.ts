export type SortField = "name" | "price" | "category";
export type SortDirection = "asc" | "desc";

export type StagedFilters = {
  search: string;
  categoryIds: readonly number[];
  priceEnabled: boolean;
  priceMin: number | null;
  priceMax: number | null;
  sortField: SortField;
  sortEnabled: boolean;
  sortDirection: SortDirection;
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
};

export type ProductListParams = {
  active: boolean;
  search?: string;
  categoryIds?: readonly number[];
  priceMin?: number;
  priceMax?: number;
  sortField?: SortField;
  sortDirection?: SortDirection;
};

export function toProductListParams(filters: StagedFilters): ProductListParams {
  const params: ProductListParams = { active: true };

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

  return params;
}
