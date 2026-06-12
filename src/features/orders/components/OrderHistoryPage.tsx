import { useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { EmptyOrderHistory } from "@/features/orders/components/EmptyOrderHistory";
import { OrderHistoryList } from "@/features/orders/components/OrderHistoryList";
import { OrderHistoryPagination } from "@/features/orders/components/OrderHistoryPagination";
import { OrderHistoryToolbar } from "@/features/orders/components/OrderHistoryToolbar";
import {
  DEFAULT_FILTERS,
  filtersEqual,
  toOrderListParams,
  type PageSize,
  type StagedOrderFilters,
} from "@/features/orders/filters";
import { useOrdersListQuery } from "@/features/orders/queries";

export function OrderHistoryPage() {
  const [staged, setStaged] = useState<StagedOrderFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedOrderFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  const appliedParams = useMemo(() => toOrderListParams(applied, page), [applied, page]);
  const ordersQuery = useOrdersListQuery(appliedParams);
  const orderPage = ordersQuery.data;
  const orders = orderPage?.items ?? [];
  const totalPages = orderPage?.totalPages ?? 0;
  const totalElements = orderPage?.totalElements ?? 0;

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

  const handleStagePageSize = (next: PageSize) => {
    setStaged({ ...staged, pageSize: next });
  };

  const isTrueEmpty =
    ordersQuery.isSuccess && filtersEqual(applied, DEFAULT_FILTERS) && totalElements === 0;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        {isTrueEmpty ? (
          <EmptyOrderHistory />
        ) : (
          <>
            <OrderHistoryToolbar
              staged={staged}
              setStaged={setStaged}
              hasPendingEdits={hasPendingEdits}
              onApply={handleApply}
              onClear={handleClear}
            />

            <div className="min-h-0 flex-1">
              {ordersQuery.isError ? (
                <div className="flex h-full items-center justify-center">
                  <Notice
                    variant="error"
                    message="Could not load orders. Please refresh and try again."
                  />
                </div>
              ) : (
                <OrderHistoryList orders={orders} isLoading={ordersQuery.isPending} />
              )}
            </div>

            <OrderHistoryPagination
              page={page}
              pageSize={staged.pageSize}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={handleStagePageSize}
            />
          </>
        )}
      </div>
    </main>
  );
}
