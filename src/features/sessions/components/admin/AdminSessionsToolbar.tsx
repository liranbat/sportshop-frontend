import { Button } from "@/components/Button";
import { type DropdownOption } from "@/components/FilterDropdown";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import { ListFilterToolbar } from "@/components/ListFilterToolbar";
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
    <ListFilterToolbar
      ariaLabel="Admin sessions filters"
      title="Sessions"
      headerActions={
        <Button variant="danger" className="h-7 px-3 text-body-small" onClick={onRevokeAll}>
          Revoke All
        </Button>
      }
      isRefreshing={isRefreshing}
      hasPendingEdits={hasPendingEdits}
      onApply={onApply}
      onClear={onClear}
      onRefresh={onRefresh}
      refreshAriaLabel="Refresh session list"
    >
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
    </ListFilterToolbar>
  );
}
