export type UserSortField = "id" | "name" | "email";
export type UserSortDirection = "asc" | "desc";

export type UserRoleWire = "ADMIN" | "USER";
export type UserStatusWire = "ACTIVE" | "DELETED";

export type UserRoleFilter = UserRoleWire | "ALL";
export type UserStatusFilter = UserStatusWire | "ALL";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 20;

export function isPageSize(value: number): value is PageSize {
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value);
}

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

  const trimmedSearch = filters.search.trim();
  if (trimmedSearch.length > 0) params.q = trimmedSearch;

  if (filters.role !== "ALL") params.role = filters.role;
  if (filters.status !== "ALL") params.status = filters.status;

  if (filters.sortEnabled) {
    params.sortField = filters.sortField;
    params.sortDirection = filters.sortDirection;
  }

  return params;
}

export function filtersEqual(a: StagedUserFilters, b: StagedUserFilters): boolean {
  return (
    a.search === b.search &&
    a.role === b.role &&
    a.status === b.status &&
    a.sortEnabled === b.sortEnabled &&
    a.sortField === b.sortField &&
    a.sortDirection === b.sortDirection &&
    a.pageSize === b.pageSize
  );
}
