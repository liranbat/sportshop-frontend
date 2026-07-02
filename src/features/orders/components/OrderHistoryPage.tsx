import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Notice } from "@/components/Notice";
import { useMeQuery } from "@/features/auth/queries";
import { EmptyOrderHistory } from "@/features/orders/components/EmptyOrderHistory";
import {
  OrderHistoryHeaderRow,
  type OrderListView,
} from "@/features/orders/components/OrderHistoryHeaderRow";
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
import { useAdminOrdersListQuery, useOrdersListQuery } from "@/features/orders/queries";

const VIEW_PARAM = "view";

function parseView(raw: string | null, isAdmin: boolean): OrderListView {
  if (!isAdmin) return "user";
  return raw === "admin" ? "admin" : "user";
}

export function OrderHistoryPage() {
  const meQuery = useMeQuery();
  const isAdmin = meQuery.data?.isAdmin === true;

  const [searchParams, setSearchParams] = useSearchParams();
  const view = parseView(searchParams.get(VIEW_PARAM), isAdmin);

  const [staged, setStaged] = useState<StagedOrderFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<StagedOrderFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  // reset filters on every view change — toggle click OR isAdmin flipping mid-session.
  // setting state during render is safe here: React re-renders with the fresh state
  // before the queries below run, so they never fire with the previous view's params.
  const [prevView, setPrevView] = useState(view);
  if (prevView !== view) {
    setPrevView(view);
    setStaged(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(0);
  }

  const appliedParams = useMemo(() => toOrderListParams(applied, page), [applied, page]);
  const userOrdersQuery = useOrdersListQuery(appliedParams, view === "user");
  const adminOrdersQuery = useAdminOrdersListQuery(appliedParams, view === "admin");
  const ordersQuery = view === "admin" ? adminOrdersQuery : userOrdersQuery;

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

  const handleRefresh = () => {
    void ordersQuery.refetch();
  };

  const isRefreshing = ordersQuery.isFetching;

  const handleStagePageSize = (next: PageSize) => {
    setStaged({ ...staged, pageSize: next });
  };

  const handleViewChange = useCallback(
    (next: OrderListView) => {
      if (next === view) return;
      // URL-only — the prevViewRef guard above handles the actual filter/page reset
      // once `view` re-derives from the new query param.
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          if (next === "admin") {
            updated.set(VIEW_PARAM, "admin");
          } else {
            updated.delete(VIEW_PARAM);
          }
          return updated;
        },
        { replace: true },
      );
    },
    [view, setSearchParams],
  );

  // "no orders at all" — either the user has placed none, or (in admin view) the system has none.
  // Copy + CTA differ per view inside EmptyOrderHistory.
  const isTrueEmpty =
    ordersQuery.isSuccess && filtersEqual(applied, DEFAULT_FILTERS) && totalElements === 0;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <OrderHistoryHeaderRow
          view={view}
          onViewChange={handleViewChange}
          isAdmin={isAdmin}
          isRefreshing={isRefreshing}
        />

        {isTrueEmpty ? (
          <EmptyOrderHistory view={view} />
        ) : (
          <>
            <OrderHistoryToolbar
              staged={staged}
              setStaged={setStaged}
              hasPendingEdits={hasPendingEdits}
              isRefreshing={isRefreshing}
              onApply={handleApply}
              onClear={handleClear}
              onRefresh={handleRefresh}
              view={view}
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
                <OrderHistoryList orders={orders} isLoading={ordersQuery.isPending} view={view} />
              )}
            </div>

            <OrderHistoryPagination
              page={page}
              pageSize={staged.pageSize}
              totalPages={totalPages}
              disabled={isRefreshing}
              onPageChange={setPage}
              onPageSizeChange={handleStagePageSize}
            />
          </>
        )}
      </div>
    </main>
  );
}
