import { Button } from "@/components/Button";
import type { DropdownOption } from "@/components/FilterDropdown";
import { FilterMultiDropdown } from "@/components/FilterMultiDropdown";
import { FilterPriceRange } from "@/components/FilterPriceRange";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import type { Category } from "@/features/categories";
import type { StagedFilters } from "@/features/catalog/filters";

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "category", label: "Category" },
];

type Props = {
  staged: StagedFilters;
  setStaged: (next: StagedFilters) => void;
  categories: readonly Category[];
  hasPendingEdits: boolean;
  onApply: () => void;
  onClear: () => void;
};

export function CatalogToolbar({
  staged,
  setStaged,
  categories,
  hasPendingEdits,
  onApply,
  onClear,
}: Props) {
  const categoryOptions: readonly DropdownOption[] = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <section aria-label="Catalog filters" className="flex flex-col gap-1">
      <h1 className="text-body-large font-semibold text-text-primary">Catalog</h1>

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

      <div className="flex items-center gap-2">
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
