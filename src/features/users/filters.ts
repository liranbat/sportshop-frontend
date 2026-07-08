import {
  createFiltersEqual,
  createPageSizeOptions,
  wireOptionalTrimmed,
  wireSort,
  type SortDirection,
} from "@/lib/filters";

export type UserSortField = "id" | "name" | "email";
export type UserSortDirection = SortDirection;

export type UserRoleWire = "ADMIN" | "USER";
export type UserStatusWire = "ACTIVE" | "DELETED";

export type UserRoleFilter = UserRoleWire | "ALL";
export type UserStatusFilter = UserStatusWire | "ALL";

export const { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, isPageSize } = createPageSizeOptions(
  [10, 20, 50] as const,
  20,
);
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export type StagedUserFilters = {
  search: string;
  role: UserRoleFilter;
  status: UserStatusFilter;
  sortEnabled: boolean;
  sortField: UserSortField;
  sortDirection: UserSortDirection;
  pageSize: PageSize;
};

export const DEFAULT_FILTERS: StagedUserFilters = {
  search: "",
  role: "ALL",
  status: "ALL",
  sortEnabled: false,
  sortField: "id",
  sortDirection: "desc",
  pageSize: DEFAULT_PAGE_SIZE,
};

export type UserListParams = {
  role?: UserRoleWire;
  status?: UserStatusWire;
  q?: string;
  sortField?: UserSortField;
  sortDirection?: UserSortDirection;
  page?: number;
  pageSize?: number;
};

export function toUserListParams(filters: StagedUserFilters, page: number): UserListParams {
  const params: UserListParams = { page, pageSize: filters.pageSize };
  wireOptionalTrimmed(params, "q", filters.search);
  if (filters.role !== "ALL") params.role = filters.role;
  if (filters.status !== "ALL") params.status = filters.status;
  wireSort(params, filters.sortEnabled, filters.sortField, filters.sortDirection);
  return params;
}

export const filtersEqual = createFiltersEqual<StagedUserFilters>([
  "search",
  "role",
  "status",
  "sortEnabled",
  "sortField",
  "sortDirection",
  "pageSize",
]);
