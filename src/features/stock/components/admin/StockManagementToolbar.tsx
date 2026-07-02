import { Button } from "@/components/Button";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import type {
  StagedStockFilters,
  StockArchiveStatus,
  StockSortField,
  StockStatusFilter,
} from "@/features/stock/filters";

const STOCK_STATUS_OPTIONS: readonly DropdownOption[] = [
  { value: "ALL", label: "All" },
  { value: "IN_STOCK", label: "In stock" },
  { value: "LOW_STOCK", label: "Low stock" },
  { value: "OUT_OF_STOCK", label: "Out of stock" },
];

const ARCHIVE_STATUS_OPTIONS: readonly DropdownOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "ALL", label: "All" },
];

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "name", label: "Product name" },
  { value: "quantity", label: "Quantity" },
  { value: "threshold", label: "Threshold" },
];

function isStockStatus(value: string): value is StockStatusFilter {
  return (
    value === "ALL" || value === "IN_STOCK" || value === "LOW_STOCK" || value === "OUT_OF_STOCK"
  );
}

function isArchiveStatus(value: string): value is StockArchiveStatus {
  return value === "ACTIVE" || value === "ARCHIVED" || value === "ALL";
}

function isSortField(value: string): value is StockSortField {
  return value === "name" || value === "quantity" || value === "threshold";
}

type Props = {
  staged: StagedStockFilters;
  setStaged: (next: StagedStockFilters) => void;
  hasPendingEdits: boolean;
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
};

export function StockManagementToolbar({
  staged,
  setStaged,
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
}: Props) {
  return (
    <section
      aria-label="Stock filters"
      aria-busy={isRefreshing}
      className={`relative z-20 flex flex-col gap-1 transition-opacity ${
        isRefreshing ? "opacity-60" : ""
      }`}
    >
      <fieldset disabled={isRefreshing} className="contents">
        <div className="flex flex-wrap items-end gap-2">
          <FilterSearchBar
            value={staged.search}
            onChange={(search) => setStaged({ ...staged, search })}
            placeholder="Search by product name..."
            ariaLabel="Search stock by product name"
            className="w-72"
          />

          <FilterDropdownLabeled label="Stock status">
            <FilterDropdown
              options={STOCK_STATUS_OPTIONS}
              value={staged.stockStatus}
              onChange={(value) => {
                if (isStockStatus(value)) setStaged({ ...staged, stockStatus: value });
              }}
              ariaLabel="Filter by stock status"
              className="w-36"
            />
          </FilterDropdownLabeled>

          <FilterDropdownLabeled label="Archive status">
            <FilterDropdown
              options={ARCHIVE_STATUS_OPTIONS}
              value={staged.archiveStatus}
              onChange={(value) => {
                if (isArchiveStatus(value)) setStaged({ ...staged, archiveStatus: value });
              }}
              ariaLabel="Filter by archive status"
              className="w-36"
            />
          </FilterDropdownLabeled>

          <FilterDropdownLabeled label="Sizes" className="w-48">
            <FilterSearchBar
              value={staged.sizes}
              onChange={(sizes) => setStaged({ ...staged, sizes })}
              placeholder="e.g. M, L, 42"
              ariaLabel="Filter by size (comma-separated)"
            />
          </FilterDropdownLabeled>

          <div className="flex-1" />

          <FilterSort
            options={SORT_OPTIONS}
            field={staged.sortField}
            direction={staged.sortDirection}
            enabled={staged.sortEnabled}
            onFieldChange={(value) => {
              if (isSortField(value)) setStaged({ ...staged, sortField: value });
            }}
            onDirectionToggle={() =>
              setStaged({
                ...staged,
                sortDirection: staged.sortDirection === "asc" ? "desc" : "asc",
              })
            }
            onEnabledChange={(sortEnabled) => setStaged({ ...staged, sortEnabled })}
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
      </fieldset>
    </section>
  );
}
