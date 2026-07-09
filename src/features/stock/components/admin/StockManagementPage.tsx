import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BackLink } from "@/components/BackLink";
import { ListPagination } from "@/components/ListPagination";
import { paths } from "@/lib/paths";
import { Notice } from "@/components/Notice";
import { AddSizeModal } from "@/features/stock/components/admin/AddSizeModal";
import { EditStockRowModal } from "@/features/stock/components/admin/EditStockRowModal";
import { EmptyStockManagementList } from "@/features/stock/components/admin/EmptyStockManagementList";
import { RemoveSizeConfirmModal } from "@/features/stock/components/admin/RemoveSizeConfirmModal";
import { StockListHeaderRow } from "@/features/stock/components/admin/StockListHeaderRow";
import { StockManagementList } from "@/features/stock/components/admin/StockManagementList";
import { StockManagementToolbar } from "@/features/stock/components/admin/StockManagementToolbar";
import {
  DEFAULT_FILTERS,
  filtersEqual,
  PAGE_SIZE_OPTIONS,
  toStockListParams,
  type PageSize,
  type StagedStockFilters,
} from "@/features/stock/filters";
import { stockQueryKeys, useAdminStockListQuery } from "@/features/stock/queries";
import type { StockRow } from "@/features/stock/schema";

export function StockManagementPage() {
  const queryClient = useQueryClient();

  const [staged, setStaged] = useState<StagedStockFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedStockFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [editTarget, setEditTarget] = useState<StockRow | null>(null);
  const [addSizeOpen, setAddSizeOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<StockRow | null>(null);

  const appliedParams = useMemo(() => toStockListParams(applied, page), [applied, page]);
  const stockQuery = useAdminStockListQuery(appliedParams);
  const stockPage = stockQuery.data;
  const rows = useMemo(() => stockPage?.items ?? [], [stockPage]);
  const totalPages = stockPage?.totalPages ?? 0;
  const totalElements = stockPage?.totalElements ?? 0;

  const hasPendingEdits = !filtersEqual(staged, applied);
  const isFilteredView = !filtersEqual(applied, DEFAULT_FILTERS);
  const isTrueEmpty = stockQuery.isSuccess && !isFilteredView && totalElements === 0;

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
    void stockQuery.refetch();
  };

  const handleAddSize = () => {
    setAddSizeOpen(true);
  };

  const handleStagePageSize = (next: PageSize) => {
    setStaged({ ...staged, pageSize: next });
  };

  const handleStartEdit = (row: StockRow) => {
    setEditTarget(row);
  };

  const handleEditSuccess = () => {
    void queryClient.invalidateQueries({ queryKey: stockQueryKeys.lists() });
  };

  const handleAddSizeSuccess = () => {
    void queryClient.invalidateQueries({ queryKey: stockQueryKeys.lists() });
  };

  const handleRemove = (row: StockRow) => {
    setRemoveTarget(row);
  };

  const handleRemoveSuccess = () => {
    if (rows.length <= 1 && page > 0) {
      setPage(0);
    } else {
      void queryClient.invalidateQueries({ queryKey: stockQueryKeys.lists() });
    }
  };

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <StockListHeaderRow
          isRefreshing={stockQuery.isFetching}
          onRefresh={handleRefresh}
          onAddSize={handleAddSize}
        />

        <BackLink to={paths.catalog()} label="Back to Catalog" />

        {isTrueEmpty ? (
          <EmptyStockManagementList filtered={false} onClearFilters={handleClear} />
        ) : (
          <>
            <StockManagementToolbar
              staged={staged}
              setStaged={setStaged}
              hasPendingEdits={hasPendingEdits}
              isRefreshing={stockQuery.isFetching}
              onApply={handleApply}
              onClear={handleClear}
            />

            <div
              aria-busy={stockQuery.isFetching}
              className={`min-h-0 flex-1 overflow-auto transition-opacity ${
                stockQuery.isFetching ? "opacity-60" : ""
              }`}
            >
              <fieldset disabled={stockQuery.isFetching} className="contents">
                {stockQuery.isError ? (
                  <div className="flex h-full items-center justify-center">
                    <Notice
                      variant="error"
                      message="Could not load stock. Please refresh and try again."
                    />
                  </div>
                ) : rows.length === 0 && !stockQuery.isPending ? (
                  <EmptyStockManagementList filtered={true} onClearFilters={handleClear} />
                ) : (
                  <StockManagementList
                    rows={rows}
                    isLoading={stockQuery.isPending}
                    onStartEdit={handleStartEdit}
                    onRemove={handleRemove}
                  />
                )}
              </fieldset>
            </div>

            <ListPagination
              ariaLabel="Stock list pagination"
              page={page}
              pageSize={staged.pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              totalPages={totalPages}
              disabled={stockQuery.isFetching}
              onPageChange={setPage}
              onPageSizeChange={handleStagePageSize}
            />
          </>
        )}
      </div>

      <EditStockRowModal
        open={editTarget !== null}
        onOpenChange={(next) => {
          if (!next) setEditTarget(null);
        }}
        row={editTarget}
        onSuccess={handleEditSuccess}
      />

      <AddSizeModal
        open={addSizeOpen}
        onOpenChange={setAddSizeOpen}
        onSuccess={handleAddSizeSuccess}
      />

      {removeTarget && (
        <RemoveSizeConfirmModal
          row={removeTarget}
          onClose={() => setRemoveTarget(null)}
          onSuccess={handleRemoveSuccess}
        />
      )}
    </main>
  );
}
