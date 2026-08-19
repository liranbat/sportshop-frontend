import { useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { SalesDashboardHeaderRow } from "@/features/sales/components/admin/SalesDashboardHeaderRow";
import { SalesDashboardToolbar } from "@/features/sales/components/admin/SalesDashboardToolbar";
import { SalesKpiCards } from "@/features/sales/components/admin/SalesKpiCards";
import { SalesStatusBreakdown } from "@/features/sales/components/admin/SalesStatusBreakdown";
import { SalesTopProducts } from "@/features/sales/components/admin/SalesTopProducts";
import {
  createDefaultFilters,
  filtersEqual,
  latestAllowedTo,
  MAX_RANGE_DAYS,
  toSalesSummaryParams,
  type StagedSalesFilters,
} from "@/features/sales/filters";
import { formatDateRange } from "@/features/sales/format";
import { useAdminSalesSummaryQuery } from "@/features/sales/queries";
import { ApiError } from "@/lib/api";

const GENERIC_ERROR = "Could not load the sales summary. Please refresh and try again.";

export function SalesDashboardPage() {
  // held in state so Clear returns to the range the page opened with, even past midnight
  const [defaultFilters] = useState(createDefaultFilters);
  const [staged, setStaged] = useState<StagedSalesFilters>(defaultFilters);
  const [applied, setApplied] = useState<StagedSalesFilters>(defaultFilters);

  const appliedParams = useMemo(() => toSalesSummaryParams(applied), [applied]);
  const salesQuery = useAdminSalesSummaryQuery(appliedParams);
  const summary = salesQuery.data;

  const hasPendingEdits = !filtersEqual(staged, applied);
  const validationError = validateFilters(staged);

  const handleApply = () => {
    if (validationError === null) setApplied(staged);
  };

  const handleClear = () => {
    setStaged(defaultFilters);
    setApplied(defaultFilters);
  };

  const handleRefresh = () => {
    void salesQuery.refetch();
  };

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <SalesDashboardHeaderRow
          rangeLabel={formatDateRange(applied.dateFrom, applied.dateTo)}
          isRefreshing={salesQuery.isFetching}
          onRefresh={handleRefresh}
        />

        <SalesDashboardToolbar
          staged={staged}
          setStaged={setStaged}
          hasPendingEdits={hasPendingEdits}
          isRefreshing={salesQuery.isFetching}
          onApply={handleApply}
          onClear={handleClear}
        />

        {validationError !== null && <Notice variant="warning" message={validationError} />}

        <div
          aria-busy={salesQuery.isFetching}
          className={`min-h-0 flex-1 overflow-auto transition-opacity ${
            salesQuery.isFetching ? "opacity-60" : ""
          }`}
        >
          <fieldset disabled={salesQuery.isFetching} className="contents">
            {salesQuery.isError ? (
              <div className="flex h-full items-center justify-center">
                <Notice variant="error" message={errorMessage(salesQuery.error)} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <SalesKpiCards summary={summary?.summary} isLoading={salesQuery.isPending} />

                <div className="grid gap-3 xl:grid-cols-2">
                  <SalesStatusBreakdown
                    rows={summary?.statusBreakdown ?? []}
                    isLoading={salesQuery.isPending}
                  />
                  <SalesTopProducts
                    products={summary?.topProducts ?? []}
                    sortBy={summary?.topProductsSortBy ?? applied.topProductsSortBy}
                    isLoading={salesQuery.isPending}
                  />
                </div>
              </div>
            )}
          </fieldset>
        </div>
      </div>
    </main>
  );
}

// backstop for the pickers' min/max, which browsers only enforce for the calendar, not typed input.
function validateFilters(filters: StagedSalesFilters): string | null {
  if (filters.dateFrom === "" || filters.dateTo === "") {
    return "Pick both a start and an end date.";
  }
  if (filters.dateFrom > filters.dateTo) {
    return "Start date must be on or before the end date.";
  }
  const latest = latestAllowedTo(filters.dateFrom);
  if (latest !== undefined && filters.dateTo > latest) {
    return `The date range cannot exceed ${MAX_RANGE_DAYS} days.`;
  }
  return null;
}

// the max-span rule lives in server config, so a 400 is the only way the user learns their range is too wide.
function errorMessage(error: Error | null): string {
  if (error instanceof ApiError && error.status === 400) return error.message;
  return GENERIC_ERROR;
}
