import { FilterDateInput } from "@/components/FilterDateInput";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { ListFilterToolbar } from "@/components/ListFilterToolbar";
import {
  earliestAllowedFrom,
  latestAllowedTo,
  type StagedSalesFilters,
} from "@/features/sales/filters";
import type { TopProductsSortBy } from "@/features/sales/schema";

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "revenue", label: "Revenue" },
  { value: "quantity", label: "Quantity" },
];

function isTopProductsSortBy(value: string): value is TopProductsSortBy {
  return value === "revenue" || value === "quantity";
}

type Props = {
  staged: StagedSalesFilters;
  setStaged: (next: StagedSalesFilters) => void;
  hasPendingEdits: boolean;
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
};

export function SalesDashboardToolbar({
  staged,
  setStaged,
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
}: Props) {
  return (
    <ListFilterToolbar
      ariaLabel="Sales filters"
      isRefreshing={isRefreshing}
      hasPendingEdits={hasPendingEdits}
      onApply={onApply}
      onClear={onClear}
    >
      <div className="flex flex-wrap items-end gap-2">
        <FilterDropdownLabeled label="From">
          <FilterDateInput
            value={staged.dateFrom}
            onChange={(dateFrom) => setStaged({ ...staged, dateFrom: dateFrom ?? "" })}
            ariaLabel="Sales range start date"
            min={earliestAllowedFrom(staged.dateTo)}
            max={staged.dateTo}
          />
        </FilterDropdownLabeled>

        <FilterDropdownLabeled label="To">
          <FilterDateInput
            value={staged.dateTo}
            onChange={(dateTo) => setStaged({ ...staged, dateTo: dateTo ?? "" })}
            ariaLabel="Sales range end date"
            min={staged.dateFrom}
            max={latestAllowedTo(staged.dateFrom)}
          />
        </FilterDropdownLabeled>

        <div className="flex-1" />

        <FilterDropdownLabeled label="Rank top products by">
          <FilterDropdown
            options={SORT_OPTIONS}
            value={staged.topProductsSortBy}
            onChange={(value) => {
              if (isTopProductsSortBy(value)) setStaged({ ...staged, topProductsSortBy: value });
            }}
            ariaLabel="Rank top products by"
            className="w-36"
          />
        </FilterDropdownLabeled>
      </div>
    </ListFilterToolbar>
  );
}
