import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Notice } from "@/components/Notice";
import { useMeQuery } from "@/features/auth/queries";
import { AdminSessionRevokeAllModal } from "@/features/sessions/components/admin/AdminSessionRevokeAllModal";
import { AdminSessionRevokeSingleModal } from "@/features/sessions/components/admin/AdminSessionRevokeSingleModal";
import { AdminSessionsList } from "@/features/sessions/components/admin/AdminSessionsList";
import { AdminSessionsListPagination } from "@/features/sessions/components/admin/AdminSessionsListPagination";
import { AdminSessionsToolbar } from "@/features/sessions/components/admin/AdminSessionsToolbar";
import { EmptyAdminSessionsList } from "@/features/sessions/components/admin/EmptyAdminSessionsList";
import {
  DEFAULT_FILTERS,
  filtersEqual,
  toSessionListParams,
  type PageSize,
  type StagedSessionFilters,
} from "@/features/sessions/filters";
import { sessionQueryKeys, useAdminSessionsListQuery } from "@/features/sessions/queries";
import type { Session } from "@/features/sessions/schema";

export function AdminSessionsPage() {
  const queryClient = useQueryClient();
  const meQuery = useMeQuery();
  const actorUserId = meQuery.data?.id ?? null;

  const [staged, setStaged] = useState<StagedSessionFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedSessionFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  const [revokeTarget, setRevokeTarget] = useState<Session | null>(null);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);

  const appliedParams = useMemo(() => toSessionListParams(applied, page), [applied, page]);
  const sessionsQuery = useAdminSessionsListQuery(appliedParams);
  const sessionPage = sessionsQuery.data;
  const sessions = sessionPage?.items ?? [];
  const totalPages = sessionPage?.totalPages ?? 0;
  const totalElements = sessionPage?.totalElements ?? 0;

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
    void sessionsQuery.refetch();
  };

  const handleStagePageSize = (next: PageSize) => {
    setStaged({ ...staged, pageSize: next });
  };

  const isAtDefaults = page === 0 && filtersEqual(applied, DEFAULT_FILTERS);

  const handleSingleRevokeSuccess = () => {
    // if we revoked the last item on this page, snap back to page 0 — the actor's
    // own session is always there, so it's the only page guaranteed to exist even
    // if a concurrent admin shrunk the list further. otherwise just refetch the
    // current page to drop the deleted row.
    if (sessions.length <= 1 && page > 0) {
      setPage(0);
    } else {
      void queryClient.invalidateQueries({ queryKey: sessionQueryKeys.lists() });
    }
  };

  const handleRevokeAllSuccess = () => {
    // full reset, but only invalidate when we were already at defaults (state
    // change alone is enough to retrigger the fetch otherwise — no redundant call).
    if (isAtDefaults) {
      void queryClient.invalidateQueries({ queryKey: sessionQueryKeys.lists() });
    } else {
      handleClear();
    }
  };

  const isTrueEmpty =
    sessionsQuery.isSuccess && filtersEqual(applied, DEFAULT_FILTERS) && totalElements === 0;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        {isTrueEmpty ? (
          <EmptyAdminSessionsList />
        ) : (
          <>
            <AdminSessionsToolbar
              staged={staged}
              setStaged={setStaged}
              hasPendingEdits={hasPendingEdits}
              isRefreshing={sessionsQuery.isFetching}
              onApply={handleApply}
              onClear={handleClear}
              onRefresh={handleRefresh}
              onRevokeAll={() => setRevokeAllOpen(true)}
            />

            <div className="min-h-0 flex-1">
              {sessionsQuery.isError ? (
                <div className="flex h-full items-center justify-center">
                  <Notice
                    variant="error"
                    message="Could not load sessions. Please refresh and try again."
                  />
                </div>
              ) : (
                <AdminSessionsList
                  sessions={sessions}
                  isLoading={sessionsQuery.isPending}
                  actorUserId={actorUserId}
                  onRevoke={setRevokeTarget}
                />
              )}
            </div>

            <AdminSessionsListPagination
              page={page}
              pageSize={staged.pageSize}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={handleStagePageSize}
            />
          </>
        )}
      </div>

      <AdminSessionRevokeSingleModal
        open={revokeTarget !== null}
        onOpenChange={(next) => {
          if (!next) setRevokeTarget(null);
        }}
        session={revokeTarget}
        onSuccess={handleSingleRevokeSuccess}
      />

      <AdminSessionRevokeAllModal
        open={revokeAllOpen}
        onOpenChange={setRevokeAllOpen}
        onSuccess={handleRevokeAllSuccess}
      />
    </main>
  );
}
