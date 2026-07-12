import { FilterDateRange } from "@/components/FilterDateRange";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { FilterPriceRange } from "@/components/FilterPriceRange";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import { ListFilterToolbar } from "@/components/ListFilterToolbar";
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
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
  onRefresh: () => void;
  view: "user" | "admin";
};

export function OrderHistoryToolbar({
  staged,
  setStaged,
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
  onRefresh,
  view,
}: Props) {
  return (
    <ListFilterToolbar
      ariaLabel="Order history filters"
      isRefreshing={isRefreshing}
      hasPendingEdits={hasPendingEdits}
      onApply={onApply}
      onClear={onClear}
      onRefresh={onRefresh}
      refreshAriaLabel="Refresh orders"
    >
      <div className="flex flex-wrap items-end gap-2">
        <FilterSearchBar
          value={staged.search}
          onChange={(search) => setStaged({ ...staged, search })}
          placeholder="Search by order #..."
          ariaLabel="Search by order number"
          className="w-60"
        />

        {view === "admin" && (
          <FilterSearchBar
            value={staged.customer}
            onChange={(customer) => setStaged({ ...staged, customer })}
            placeholder="Search by name or email..."
            ariaLabel="Search by customer name or email"
            className="w-60"
          />
        )}

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
    </ListFilterToolbar>
  );
}
