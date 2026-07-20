import { useMemo, useState } from "react";
import { ListPagination } from "@/components/ListPagination";
import { Notice } from "@/components/Notice";
import { AdminUserList } from "@/features/users/components/admin/AdminUserList";
import { AdminUserListToolbar } from "@/features/users/components/admin/AdminUserListToolbar";
import { EmptyAdminUserList } from "@/features/users/components/admin/EmptyAdminUserList";
import {
  DEFAULT_FILTERS,
  filtersEqual,
  PAGE_SIZE_OPTIONS,
  toUserListParams,
  type PageSize,
  type StagedUserFilters,
} from "@/features/users/filters";
import { useUsersListQuery } from "@/features/users/queries";

export function AdminUserListPage() {
  const [staged, setStaged] = useState<StagedUserFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedUserFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  const appliedParams = useMemo(() => toUserListParams(applied, page), [applied, page]);
  const usersQuery = useUsersListQuery(appliedParams);
  const userPage = usersQuery.data;
  const users = userPage?.items ?? [];
  const totalPages = userPage?.totalPages ?? 0;
  const totalElements = userPage?.totalElements ?? 0;

  const hasPendingEdits = !filtersEqual(staged, applied);

  const handleApply = () => {
    setPage(0);
    setApplied(staged);
  };

  const handleClear = () => {
    setPage(0);
    setStaged(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  };

  const handleRefresh = () => {
    void usersQuery.refetch();
  };

  const handleStagePageSize = (next: PageSize) => {
    setStaged({ ...staged, pageSize: next });
  };

  const isTrueEmpty =
    usersQuery.isSuccess && filtersEqual(applied, DEFAULT_FILTERS) && totalElements === 0;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        {isTrueEmpty ? (
          <EmptyAdminUserList />
        ) : (
          <>
            <AdminUserListToolbar
              staged={staged}
              setStaged={setStaged}
              hasPendingEdits={hasPendingEdits}
              isRefreshing={usersQuery.isFetching}
              onApply={handleApply}
              onClear={handleClear}
              onRefresh={handleRefresh}
            />

            <div className="min-h-0 flex-1">
              {usersQuery.isError ? (
                <div className="flex h-full items-center justify-center">
                  <Notice
                    variant="error"
                    message="Could not load users. Please refresh and try again."
                  />
                </div>
              ) : (
                <AdminUserList users={users} isLoading={usersQuery.isPending} />
              )}
            </div>

            <ListPagination
              ariaLabel="Admin user list pagination"
              page={page}
              pageSize={staged.pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              totalPages={totalPages}
              disabled={usersQuery.isFetching}
              onPageChange={setPage}
              onPageSizeChange={handleStagePageSize}
            />
          </>
        )}
      </div>
    </main>
  );
}
