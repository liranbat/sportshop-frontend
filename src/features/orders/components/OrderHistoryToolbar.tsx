import { Button } from "@/components/Button";
import { FilterDateRange } from "@/components/FilterDateRange";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { FilterPriceRange } from "@/components/FilterPriceRange";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import type { OrderSortField, StagedOrderFilters } from "@/features/orders/filters";
import { OrderStatusSchema, type OrderStatus } from "@/features/orders/schema";

const ALL_STATUSES = "ALL";

const STATUS_OPTIONS: readonly DropdownOption[] = [
  { value: ALL_STATUSES, label: "All statuses" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED_BY_USER", label: "Cancelled" },
  { value: "CANCELLED_BY_ADMIN", label: "Cancelled by admin" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "DONE", label: "Done" },
];

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "date", label: "Date" },
  { value: "total", label: "Total" },
];

function parseStatus(value: string): OrderStatus | null {
  if (value === ALL_STATUSES) return null;
  const parsed = OrderStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function isOrderSortField(value: string): value is OrderSortField {
  return value === "date" || value === "total";
}

type Props = {
  staged: StagedOrderFilters;
  setStaged: (next: StagedOrderFilters) => void;
  hasPendingEdits: boolean;
  onApply: () => void;
  onClear: () => void;
};

export function OrderHistoryToolbar({
  staged,
  setStaged,
  hasPendingEdits,
  onApply,
  onClear,
}: Props) {
  return (
    <section aria-label="Order history filters" className="relative z-20 flex flex-col gap-1">
      <h1 className="text-body-large font-semibold text-text-primary">My Orders</h1>

      <div className="flex flex-wrap items-end gap-2">
        <FilterSearchBar
          value={staged.search}
          onChange={(search) => setStaged({ ...staged, search })}
          placeholder="Search by order #..."
          ariaLabel="Search by order number"
          className="w-60"
        />

        <FilterDropdownLabeled label="STATUS">
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={staged.status ?? ALL_STATUSES}
            onChange={(next) => setStaged({ ...staged, status: parseStatus(next) })}
            ariaLabel="Filter by order status"
            className="w-40"
          />
        </FilterDropdownLabeled>

        <FilterPriceRange
          enabled={staged.amountEnabled}
          min={staged.amountMin}
          max={staged.amountMax}
          onEnabledChange={(amountEnabled) => setStaged({ ...staged, amountEnabled })}
          onMinChange={(amountMin) => setStaged({ ...staged, amountMin })}
          onMaxChange={(amountMax) => setStaged({ ...staged, amountMax })}
        />

        <FilterDateRange
          enabled={staged.dateEnabled}
          from={staged.dateFrom}
          to={staged.dateTo}
          onEnabledChange={(dateEnabled) => setStaged({ ...staged, dateEnabled })}
          onFromChange={(dateFrom) => setStaged({ ...staged, dateFrom })}
          onToChange={(dateTo) => setStaged({ ...staged, dateTo })}
        />

        <FilterSort
          options={SORT_OPTIONS}
          field={staged.sortField}
          direction={staged.sortDirection}
          enabled={staged.sortEnabled}
          onFieldChange={(value) => {
            if (isOrderSortField(value)) {
              setStaged({ ...staged, sortField: value });
            }
          }}
          onDirectionToggle={() =>
            setStaged({
              ...staged,
              sortDirection: staged.sortDirection === "asc" ? "desc" : "asc",
            })
          }
          onEnabledChange={(sortEnabled) => setStaged({ ...staged, sortEnabled })}
          className="ml-auto"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="relative">
          <Button variant="primary" className="h-7 px-3 text-body-small" onClick={onApply}>
            Apply
          </Button>
          {hasPendingEdits && (
            <span
              aria-label="Unapplied filter changes"
              title="Unapplied filter changes"
              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-error-red ring-2 ring-background-page"
            />
          )}
        </div>
        <Button variant="outlined" className="h-7 px-3 text-body-small" onClick={onClear}>
          Clear
        </Button>
      </div>
    </section>
  );
}
