import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { FilterMultiDropdown } from "@/components/FilterMultiDropdown";
import { FilterPriceRange } from "@/components/FilterPriceRange";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import { ListFilterToolbar } from "@/components/ListFilterToolbar";
import type { Category } from "@/features/categories";
import type { ArchiveStatus, StagedFilters } from "@/features/catalog/filters";

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "category", label: "Category" },
];

const ARCHIVE_OPTIONS: readonly DropdownOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "ALL", label: "All" },
];

type Props = {
  staged: StagedFilters;
  setStaged: (next: StagedFilters) => void;
  categories: readonly Category[];
  hasPendingEdits: boolean;
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
  onRefresh: () => void;
  isAdmin: boolean;
  showTitle?: boolean;
};

export function CatalogToolbar({
  staged,
  setStaged,
  categories,
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
  onRefresh,
  isAdmin,
  showTitle = true,
}: Props) {
  const categoryOptions: readonly DropdownOption[] = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <ListFilterToolbar
      ariaLabel="Catalog filters"
      title={showTitle ? "Catalog" : undefined}
      isRefreshing={isRefreshing}
      hasPendingEdits={hasPendingEdits}
      onApply={onApply}
      onClear={onClear}
      onRefresh={onRefresh}
      refreshAriaLabel="Refresh product list"
    >
      <div className="flex flex-wrap items-end gap-2">
        <FilterSearchBar
          value={staged.search}
          onChange={(search) => setStaged({ ...staged, search })}
          className="w-72"
        />

        <FilterMultiDropdown
          options={categoryOptions}
          values={staged.categoryIds.map(String)}
          onChange={(next) =>
            setStaged({ ...staged, categoryIds: next.map(Number).filter(Number.isFinite) })
          }
          ariaLabel="Filter by categories"
          placeholder="Categories"
          className="w-40"
        />

        <FilterPriceRange
          enabled={staged.priceEnabled}
          min={staged.priceMin}
          max={staged.priceMax}
          onEnabledChange={(priceEnabled) => setStaged({ ...staged, priceEnabled })}
          onMinChange={(priceMin) => setStaged({ ...staged, priceMin })}
          onMaxChange={(priceMax) => setStaged({ ...staged, priceMax })}
        />

        {isAdmin && (
          <FilterDropdownLabeled label="Archive Status">
            <FilterDropdown
              options={ARCHIVE_OPTIONS}
              value={staged.archiveStatus}
              onChange={(next) => {
                if (isArchiveStatus(next)) {
                  setStaged({ ...staged, archiveStatus: next });
                }
              }}
              ariaLabel="Filter by archive status"
              className="w-40"
            />
          </FilterDropdownLabeled>
        )}

        <div className="flex-1" />

        <FilterSort
          options={SORT_OPTIONS}
          field={staged.sortField}
          direction={staged.sortDirection}
          enabled={staged.sortEnabled}
          onFieldChange={(value) => {
            if (value === "name" || value === "price" || value === "category") {
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
        />
      </div>
    </ListFilterToolbar>
  );
}

function isArchiveStatus(value: string): value is ArchiveStatus {
  return value === "ACTIVE" || value === "ARCHIVED" || value === "ALL";
}
