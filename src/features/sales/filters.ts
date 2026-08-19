import type { TopProductsSortBy } from "@/features/sales/schema";
import { createFiltersEqual } from "@/lib/filters";

const DEFAULT_RANGE_DAYS = 30;

// mirrors app.sales.max-date-range in the backend's application.yaml; the server 400s on wider spans.
export const MAX_RANGE_DAYS = 180;

export type StagedSalesFilters = {
  dateFrom: string;
  dateTo: string;
  topProductsSortBy: TopProductsSortBy;
};

export type SalesSummaryParams = {
  dateFrom: string;
  dateTo: string;
  topProductsSortBy: TopProductsSortBy;
};

// a function, not a const: "today" moves, and a module-level default would freeze on first import.
export function createDefaultFilters(): StagedSalesFilters {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (DEFAULT_RANGE_DAYS - 1));
  return {
    dateFrom: toIsoDate(start),
    dateTo: toIsoDate(today),
    topProductsSortBy: "revenue",
  };
}

export function toSalesSummaryParams(filters: StagedSalesFilters): SalesSummaryParams {
  return {
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    topProductsSortBy: filters.topProductsSortBy,
  };
}

export const filtersEqual = createFiltersEqual<StagedSalesFilters>([
  "dateFrom",
  "dateTo",
  "topProductsSortBy",
]);

// these two drive both the date pickers' min/max and the span check, so the clamp and the
// validation message can't drift apart. undefined = the other end isn't set yet, so no bound.
export function latestAllowedTo(dateFrom: string): string | undefined {
  return dateFrom === "" ? undefined : shiftIsoDate(dateFrom, MAX_RANGE_DAYS);
}

export function earliestAllowedFrom(dateTo: string): string | undefined {
  return dateTo === "" ? undefined : shiftIsoDate(dateTo, -MAX_RANGE_DAYS);
}

function shiftIsoDate(iso: string, days: number): string {
  const [year, month, day] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

// local calendar date — toISOString() is UTC and shifts the day for anyone off GMT.
function toIsoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
