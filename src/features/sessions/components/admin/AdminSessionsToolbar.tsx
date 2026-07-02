import { Button } from "@/components/Button";
import { type DropdownOption } from "@/components/FilterDropdown";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import { RefreshButton } from "@/components/RefreshButton";
import type { SessionSortField, StagedSessionFilters } from "@/features/sessions/filters";

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "expiresAt", label: "Expires at" },
  { value: "user", label: "User" },
];

function isSessionSortField(value: string): value is SessionSortField {
  return value === "user" || value === "expiresAt";
}

type Props = {
  staged: StagedSessionFilters;
  setStaged: (next: StagedSessionFilters) => void;
  hasPendingEdits: boolean;
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
  onRefresh: () => void;
  onRevokeAll: () => void;
};

export function AdminSessionsToolbar({
  staged,
  setStaged,
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
  onRefresh,
  onRevokeAll,
}: Props) {
  return (
    <section
      aria-label="Admin sessions filters"
      aria-busy={isRefreshing}
      className={`relative z-20 flex flex-col gap-1 transition-opacity ${
        isRefreshing ? "opacity-60" : ""
      }`}
    >
      <fieldset disabled={isRefreshing} className="contents">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-body-large font-semibold text-text-primary">Sessions</h1>
          <Button variant="danger" className="h-7 px-3 text-body-small" onClick={onRevokeAll}>
            Revoke All
          </Button>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <FilterSearchBar
            value={staged.search}
            onChange={(search) => setStaged({ ...staged, search })}
            placeholder="Search name or email..."
            ariaLabel="Search sessions"
            className="w-72"
          />

          <FilterSort
            options={SORT_OPTIONS}
            field={staged.sortField}
            direction={staged.sortDirection}
            enabled={staged.sortEnabled}
            onFieldChange={(value) => {
              if (isSessionSortField(value)) {
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
          <div className="ml-auto">
            <RefreshButton
              onClick={onRefresh}
              isPending={isRefreshing}
              ariaLabel="Refresh session list"
            />
          </div>
        </div>
      </fieldset>
    </section>
  );
}
